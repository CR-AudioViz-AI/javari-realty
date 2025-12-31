import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: templates, error } = await supabase
      .from('message_templates')
      .select('*')
      .eq('agent_id', user.id)
      .order('name');

    if (error) throw error;
    return NextResponse.json({ templates: templates || [] });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to fetch templates' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { data: template, error } = await supabase
      .from('message_templates')
      .insert({
        agent_id: user.id,
        ...body,
        is_default: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ template });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to create template' }, { status: 500 });
  }
}
