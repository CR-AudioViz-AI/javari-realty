'use client'

import { useState } from 'react'
import { 
  Share2, Facebook, Twitter, Linkedin, Mail, MessageCircle, 
  Copy, Check, Link2, Send
} from 'lucide-react'

interface SocialShareProps {
  url: string
  title: string
  description?: string
  image?: string
  price?: number
  className?: string
}

export default function SocialShare({
  url,
  title,
  description = '',
  image,
  price,
  className = ''
}: SocialShareProps) {
  const [copied, setCopied] = useState(false)
  const [showAll, setShowAll] = useState(false)

  const shareText = price 
    ? `${title} - $${price.toLocaleString()}\n${description}`
    : `${title}\n${description}`

  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)
  const encodedText = encodeURIComponent(shareText)

  const shareLinks = [
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'bg-[#1877F2] hover:bg-[#166FE5]',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`,
    },
    {
      name: 'Twitter/X',
      icon: Twitter,
      color: 'bg-black hover:bg-gray-800',
      url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      color: 'bg-[#0A66C2] hover:bg-[#004182]',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'bg-[#25D366] hover:bg-[#128C7E]',
      url: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
    },
    {
      name: 'Email',
      icon: Mail,
      color: 'bg-gray-600 hover:bg-gray-700',
      url: `mailto:?subject=${encodedTitle}&body=${encodedText}%0A%0A${encodedUrl}`,
    },
    {
      name: 'SMS',
      icon: Send,
      color: 'bg-green-600 hover:bg-green-700',
      url: `sms:?body=${encodedText}%20${encodedUrl}`,
    },
  ]

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Copy failed:', err)
    }
  }

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: shareText,
          url: url,
        })
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Share failed:', err)
        }
      }
    } else {
      setShowAll(true)
    }
  }

  const openShareWindow = (shareUrl: string, name: string) => {
    if (name === 'Email' || name === 'SMS') {
      window.location.href = shareUrl
    } else {
      window.open(shareUrl, '_blank', 'width=600,height=400,menubar=no,toolbar=no')
    }
  }

  return (
    <div className={`${className}`}>
      {/* Quick Share Button */}
      <button
        onClick={handleNativeShare}
        className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors mb-4"
      >
        <Share2 size={20} />
        <span className="font-medium">Share This Listing</span>
      </button>

      {/* Social Buttons Grid */}
      <div className={`grid grid-cols-3 gap-2 ${showAll ? '' : 'hidden sm:grid'}`}>
        {shareLinks.map((link) => (
          <button
            key={link.name}
            onClick={() => openShareWindow(link.url, link.name)}
            className={`${link.color} text-white p-3 rounded-lg flex flex-col items-center gap-1 transition-colors`}
          >
            <link.icon size={20} />
            <span className="text-xs">{link.name}</span>
          </button>
        ))}
      </div>

      {/* Copy Link */}
      <button
        onClick={handleCopy}
        className="w-full mt-3 flex items-center justify-center gap-2 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
      >
        {copied ? (
          <>
            <Check size={18} className="text-green-600" />
            <span className="text-green-600">Link Copied!</span>
          </>
        ) : (
          <>
            <Link2 size={18} />
            <span>Copy Link</span>
          </>
        )}
      </button>

      {/* Show More on Mobile */}
      <button
        onClick={() => setShowAll(!showAll)}
        className="w-full mt-2 text-sm text-blue-600 hover:underline sm:hidden"
      >
        {showAll ? 'Show Less' : 'More Sharing Options'}
      </button>
    </div>
  )
}
