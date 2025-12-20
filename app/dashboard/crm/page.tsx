'use client'

import { useState } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { Users, Phone, Mail, Calendar, MoreVertical, Plus, Search, Filter } from 'lucide-react'

const PIPELINE_STAGES = [
  { id: 'new', title: 'New Leads', color: 'bg-gray-500' },
  { id: 'contacted', title: 'Contacted', color: 'bg-blue-500' },
  { id: 'qualified', title: 'Qualified', color: 'bg-yellow-500' },
  { id: 'showing', title: 'Showing', color: 'bg-purple-500' },
  { id: 'offer', title: 'Offer Made', color: 'bg-orange-500' },
  { id: 'closed', title: 'Closed', color: 'bg-green-500' }
]

const INITIAL_LEADS = {
  new: [
    { id: '1', name: 'Michael Johnson', email: 'michael@email.com', phone: '(239) 555-0123', budget: '$500K-$750K', area: 'Naples', source: 'Website' },
    { id: '2', name: 'Sarah Williams', email: 'sarah@email.com', phone: '(239) 555-0456', budget: '$400K-$600K', area: 'Cape Coral', source: 'Referral' }
  ],
  contacted: [
    { id: '3', name: 'David Brown', email: 'david@email.com', phone: '(239) 555-0789', budget: 'Under $400K', area: 'Fort Myers', source: 'Zillow' }
  ],
  qualified: [
    { id: '4', name: 'Jennifer Davis', email: 'jennifer@email.com', phone: '(239) 555-0321', budget: '$600K-$900K', area: 'Bonita Springs', source: 'Open House' }
  ],
  showing: [
    { id: '5', name: 'Robert Martinez', email: 'robert@email.com', phone: '(239) 555-0654', budget: '$450K-$550K', area: 'Cape Coral', source: 'Website' }
  ],
  offer: [
    { id: '6', name: 'Lisa Anderson', email: 'lisa@email.com', phone: '(239) 555-0987', budget: '$700K-$850K', area: 'Naples', source: 'Referral' }
  ],
  closed: [
    { id: '7', name: 'James Wilson', email: 'james@email.com', phone: '(239) 555-0147', budget: '$525,000', area: 'Fort Myers', source: 'Website' }
  ]
}

export default function CRMPage() {
  const [leads, setLeads] = useState(INITIAL_LEADS)
  const [searchQuery, setSearchQuery] = useState('')

  const handleDragEnd = (result: any) => {
    if (!result.destination) return
    
    const { source, destination } = result
    if (source.droppableId === destination.droppableId && source.index === destination.index) return

    const sourceStage = source.droppableId as keyof typeof leads
    const destStage = destination.droppableId as keyof typeof leads

    const sourceItems = [...leads[sourceStage]]
    const destItems = sourceStage === destStage ? sourceItems : [...leads[destStage]]

    const [removed] = sourceItems.splice(source.index, 1)
    destItems.splice(destination.index, 0, removed)

    setLeads({
      ...leads,
      [sourceStage]: sourceItems,
      [destStage]: destItems
    })
  }

  const totalLeads = Object.values(leads).flat().length

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Client Pipeline</h1>
            <p className="text-gray-500">{totalLeads} total clients across all stages</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search clients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg w-64"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Plus className="w-5 h-5" />
              Add Client
            </button>
          </div>
        </div>
      </div>

      {/* Pipeline Board */}
      <div className="p-6 overflow-x-auto">
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex gap-4 min-w-max">
            {PIPELINE_STAGES.map((stage) => (
              <div key={stage.id} className="w-80 flex-shrink-0">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${stage.color}`} />
                    <h3 className="font-semibold">{stage.title}</h3>
                    <span className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full text-sm">
                      {leads[stage.id as keyof typeof leads]?.length || 0}
                    </span>
                  </div>
                </div>
                
                <Droppable droppableId={stage.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`space-y-3 min-h-96 p-2 rounded-lg ${snapshot.isDraggingOver ? 'bg-blue-50' : 'bg-gray-50'}`}
                    >
                      {leads[stage.id as keyof typeof leads]?.map((lead, index) => (
                        <Draggable key={lead.id} draggableId={lead.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`bg-white p-4 rounded-lg shadow-sm border ${snapshot.isDragging ? 'shadow-lg' : ''}`}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-medium">{lead.name}</h4>
                                <button className="p-1 hover:bg-gray-100 rounded">
                                  <MoreVertical className="w-4 h-4 text-gray-400" />
                                </button>
                              </div>
                              <div className="space-y-1 text-sm text-gray-500">
                                <div className="flex items-center gap-2">
                                  <Mail className="w-3 h-3" />
                                  {lead.email}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Phone className="w-3 h-3" />
                                  {lead.phone}
                                </div>
                              </div>
                              <div className="mt-3 flex gap-2">
                                <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                                  {lead.area}
                                </span>
                                <span className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs">
                                  {lead.budget}
                                </span>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      </div>
    </div>
  )
}
