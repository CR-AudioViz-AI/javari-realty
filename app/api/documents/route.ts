import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Document categories
const DOCUMENT_CATEGORIES = [
  'inspection',
  'hoa',
  'title',
  'mortgage',
  'appraisal',
  'insurance',
  'utility_bills',
  'contract',
  'disclosure',
  'photos',
  'videos',
  'notes',
  'agent_evaluation',
  'customer_feedback',
  'other'
]

// GET - Fetch documents
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const propertyId = searchParams.get('property_id')
  const customerId = searchParams.get('customer_id')
  const agentId = searchParams.get('agent_id')
  const category = searchParams.get('category')
  const ownerType = searchParams.get('owner_type') // 'customer' or 'agent'
  const includeShared = searchParams.get('include_shared') === 'true'

  try {
    let query = supabase
      .from('property_documents')
      .select(`
        *,
        properties (id, address, city),
        uploader_profile:profiles!property_documents_uploaded_by_fkey (id, full_name, role)
      `)
      .order('created_at', { ascending: false })

    if (propertyId) query = query.eq('property_id', propertyId)
    if (customerId) query = query.eq('customer_id', customerId)
    if (agentId) query = query.eq('agent_id', agentId)
    if (category) query = query.eq('category', category)
    if (ownerType) query = query.eq('owner_type', ownerType)

    // Include shared documents (agent evaluations visible to all agents)
    if (!includeShared) {
      // Only get own documents
    }

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json({ 
      documents: data || [],
      categories: DOCUMENT_CATEGORIES
    })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

// POST - Upload document metadata (actual file goes to Supabase Storage)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      property_id,
      customer_id,
      agent_id,
      uploaded_by,
      owner_type, // 'customer' or 'agent'
      file_url,
      file_name,
      file_type, // 'document', 'image', 'video'
      file_size,
      mime_type,
      category,
      title,
      description,
      is_private, // Private to owner only
      share_with_agent, // Customer shares with their agent
      share_with_customer, // Agent shares with customer
      visible_to_all_agents, // For agent evaluations - visible to all agents
      tags,
    } = body

    const { data, error } = await supabase
      .from('property_documents')
      .insert({
        property_id,
        customer_id,
        agent_id,
        uploaded_by,
        owner_type,
        file_url,
        file_name,
        file_type,
        file_size,
        mime_type,
        category,
        title: title || file_name,
        description,
        is_private: is_private || false,
        share_with_agent: share_with_agent || false,
        share_with_customer: share_with_customer || false,
        visible_to_all_agents: visible_to_all_agents || false,
        tags: tags || [],
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw error

    // Notify relevant party
    if (share_with_agent && agent_id) {
      await supabase.from('agent_notifications').insert({
        agent_id,
        type: 'document_shared',
        title: 'New Document Shared',
        message: `Customer shared a ${category} document for property`,
        data: { document_id: data.id, property_id, category },
        read: false,
        created_at: new Date().toISOString()
      })
    }

    return NextResponse.json({ success: true, document: data })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

// PATCH - Update document
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updates } = body

    const { data, error } = await supabase
      .from('property_documents')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, document: data })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

// DELETE - Remove document
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json({ error: 'Document ID required' }, { status: 400 })
  }

  try {
    // Get document to delete from storage too
    const { data: doc } = await supabase
      .from('property_documents')
      .select('file_url')
      .eq('id', id)
      .single()

    // Delete from database
    const { error } = await supabase
      .from('property_documents')
      .delete()
      .eq('id', id)

    if (error) throw error

    // TODO: Also delete from Supabase Storage if using it
    // await supabase.storage.from('documents').remove([doc.file_url])

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
