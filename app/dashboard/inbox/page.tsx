'use client'

import { useState, useEffect, useRef } from 'react'
import {
  MessageSquare,
  Search,
  Send,
  User,
  Phone,
  Mail,
  Clock,
  ChevronRight,
  Loader2,
  RefreshCw,
  Circle,
  CheckCheck,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface Conversation {
  id: string
  customer_id: string
  agent_id: string
  last_message?: string
  last_message_at?: string
  agent_unread: number
  customer_unread: number
  customers: {
    id: string
    full_name: string
    email: string
    phone?: string
  }
}

interface Message {
  id: string
  conversation_id: string
  sender_type: 'customer' | 'agent' | 'system'
  sender_id: string
  content: string
  read: boolean
  created_at: string
}

export default function AgentInboxPage() {
  const supabase = createClient()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [agentId, setAgentId] = useState<string | null>(null)

  useEffect(() => {
    loadConversations()
  }, [])

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id)
      markMessagesAsRead(selectedConversation.id)
    }
  }, [selectedConversation?.id])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Real-time subscription for new messages
  useEffect(() => {
    if (!selectedConversation) return

    const channel = supabase
      .channel(`messages:${selectedConversation.id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${selectedConversation.id}`
      }, (payload) => {
        const newMsg = payload.new as Message
        // Only add if not from current agent (avoid duplicates)
        if (newMsg.sender_type !== 'agent' || newMsg.sender_id !== agentId) {
          setMessages(prev => [...prev, newMsg])
          markMessagesAsRead(selectedConversation.id)
        }
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [selectedConversation?.id, agentId])

  async function loadConversations() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setAgentId(user.id)

      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          customers (id, full_name, email, phone)
        `)
        .order('last_message_at', { ascending: false, nullsFirst: false })

      if (error) throw error
      setConversations(data || [])
    } catch (error) {
      console.error('Error loading conversations:', error)
    } finally {
      setLoading(false)
    }
  }

  async function loadMessages(conversationId: string) {
    setLoadingMessages(true)
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })

      if (error) throw error
      setMessages(data || [])
    } catch (error) {
      console.error('Error loading messages:', error)
    } finally {
      setLoadingMessages(false)
    }
  }

  async function markMessagesAsRead(conversationId: string) {
    try {
      // Mark all customer messages as read
      await supabase
        .from('messages')
        .update({ read: true, read_at: new Date().toISOString() })
        .eq('conversation_id', conversationId)
        .eq('sender_type', 'customer')
        .eq('read', false)

      // Reset unread count
      await supabase
        .from('conversations')
        .update({ agent_unread: 0 })
        .eq('id', conversationId)

      // Update local state
      setConversations(prev => prev.map(c =>
        c.id === conversationId ? { ...c, agent_unread: 0 } : c
      ))
    } catch (error) {
      console.error('Error marking messages as read:', error)
    }
  }

  async function sendMessage() {
    if (!newMessage.trim() || !selectedConversation || !agentId) return
    
    setSending(true)
    try {
      const messageContent = newMessage.trim()
      setNewMessage('')

      const { data: msg, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: selectedConversation.id,
          customer_id: selectedConversation.customer_id,
          agent_id: agentId,
          sender_type: 'agent',
          sender_id: agentId,
          content: messageContent
        })
        .select()
        .single()

      if (error) throw error

      // Add to local messages
      setMessages(prev => [...prev, msg])

      // Update conversation last message
      await supabase
        .from('conversations')
        .update({
          last_message: messageContent,
          last_message_at: new Date().toISOString(),
          customer_unread: selectedConversation.customer_unread + 1
        })
        .eq('id', selectedConversation.id)

      // Update local conversations
      setConversations(prev => prev.map(c =>
        c.id === selectedConversation.id 
          ? { ...c, last_message: messageContent, last_message_at: new Date().toISOString() }
          : c
      ))
    } catch (error) {
      console.error('Error sending message:', error)
      setNewMessage(newMessage) // Restore message on error
    } finally {
      setSending(false)
    }
  }

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const formatTime = (date: string) => {
    const d = new Date(date)
    const now = new Date()
    const diff = now.getTime() - d.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (days === 0) {
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } else if (days === 1) {
      return 'Yesterday'
    } else if (days < 7) {
      return d.toLocaleDateString([], { weekday: 'short' })
    } else {
      return d.toLocaleDateString([], { month: 'short', day: 'numeric' })
    }
  }

  const filteredConversations = conversations.filter(conv =>
    !searchTerm ||
    conv.customers?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.customers?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalUnread = conversations.reduce((acc, c) => acc + (c.agent_unread || 0), 0)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-200px)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-500">
            {totalUnread > 0 ? `${totalUnread} unread message${totalUnread > 1 ? 's' : ''}` : 'Customer conversations'}
          </p>
        </div>
        <button
          onClick={loadConversations}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      <div className="flex-1 bg-white rounded-xl border overflow-hidden flex">
        {/* Conversations List */}
        <div className="w-80 border-r flex flex-col">
          {/* Search */}
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search conversations..."
                className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length > 0 ? (
              filteredConversations.map(conv => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv)}
                  className={`w-full p-4 text-left border-b hover:bg-gray-50 transition ${
                    selectedConversation?.id === conv.id ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                      {conv.customers?.full_name?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-gray-900 truncate">
                          {conv.customers?.full_name || 'Unknown Customer'}
                        </p>
                        {conv.last_message_at && (
                          <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                            {formatTime(conv.last_message_at)}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 truncate">{conv.last_message || 'No messages yet'}</p>
                      {conv.agent_unread > 0 && (
                        <span className="inline-flex items-center justify-center w-5 h-5 bg-blue-600 text-white text-xs rounded-full mt-1">
                          {conv.agent_unread}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No conversations yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Customer Header */}
              <div className="p-4 border-b bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                      {selectedConversation.customers?.full_name?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{selectedConversation.customers?.full_name}</p>
                      <p className="text-sm text-gray-500">{selectedConversation.customers?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedConversation.customers?.phone && (
                      <a
                        href={`tel:${selectedConversation.customers.phone}`}
                        className="p-2 hover:bg-gray-200 rounded-lg text-gray-600"
                        title="Call"
                      >
                        <Phone className="w-5 h-5" />
                      </a>
                    )}
                    <a
                      href={`mailto:${selectedConversation.customers?.email}`}
                      className="p-2 hover:bg-gray-200 rounded-lg text-gray-600"
                      title="Email"
                    >
                      <Mail className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {loadingMessages ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                  </div>
                ) : messages.length > 0 ? (
                  messages.map(msg => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender_type === 'agent' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[70%] ${
                        msg.sender_type === 'agent'
                          ? 'bg-blue-600 text-white rounded-2xl rounded-br-md'
                          : 'bg-gray-100 text-gray-900 rounded-2xl rounded-bl-md'
                      } p-3`}>
                        <p className="text-sm">{msg.content}</p>
                        <div className={`flex items-center gap-1 mt-1 ${
                          msg.sender_type === 'agent' ? 'text-blue-200' : 'text-gray-400'
                        }`}>
                          <span className="text-xs">
                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {msg.sender_type === 'agent' && msg.read && (
                            <CheckCheck className="w-3 h-3" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !sending && sendMessage()}
                    placeholder="Type a message..."
                    disabled={sending}
                    className="flex-1 px-4 py-2 border rounded-full focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!newMessage.trim() || sending}
                    className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50"
                  >
                    {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="font-medium text-gray-900 mb-1">Select a conversation</p>
                <p className="text-sm">Choose a customer to view messages</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
