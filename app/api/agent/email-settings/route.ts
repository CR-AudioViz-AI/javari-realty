import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Admin client for email settings operations
const adminClient = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

// Untyped client for tables not yet in generated types
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db: any = adminClient;

// GET - Retrieve agent's email settings
export async function GET(request: NextRequest) {
  try {
    const agentId = request.nextUrl.searchParams.get('agent_id');
    
    if (!agentId) {
      return NextResponse.json(
        { error: 'agent_id is required' },
        { status: 400 }
      );
    }

    const { data, error } = await db
      .from('agent_email_settings')
      .select('*')
      .eq('agent_id', agentId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch email settings' },
        { status: 500 }
      );
    }

    // Don't expose sensitive tokens to frontend
    if (data) {
      const safeData = data as Record<string, unknown>;
      const sanitized = {
        ...safeData,
        access_token: safeData.access_token ? '[REDACTED]' : null,
        refresh_token: safeData.refresh_token ? '[REDACTED]' : null,
        smtp_password: safeData.smtp_password ? '[REDACTED]' : null,
      };
      return NextResponse.json({ settings: sanitized });
    }

    return NextResponse.json({ settings: null });
  } catch (err) {
    console.error('Email settings GET error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create or update email settings
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { agent_id, provider, smtp_host, smtp_port, smtp_user, smtp_password, sender_email, sender_name, signature } = body;

    if (!agent_id) {
      return NextResponse.json(
        { error: 'agent_id is required' },
        { status: 400 }
      );
    }

    // Build update object based on provided fields
    const updateData: Record<string, unknown> = {
      agent_id,
      updated_at: new Date().toISOString(),
    };

    if (provider) updateData.provider = provider;
    if (smtp_host !== undefined) updateData.smtp_host = smtp_host;
    if (smtp_port !== undefined) updateData.smtp_port = smtp_port;
    if (smtp_user !== undefined) updateData.smtp_user = smtp_user;
    if (smtp_password !== undefined) updateData.smtp_password = smtp_password;
    if (sender_email !== undefined) updateData.sender_email = sender_email;
    if (sender_name !== undefined) updateData.sender_name = sender_name;
    if (signature !== undefined) updateData.signature = signature;

    const { data, error } = await db
      .from('agent_email_settings')
      .upsert(updateData, { onConflict: 'agent_id' })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to save email settings' },
        { status: 500 }
      );
    }

    // Sanitize response
    const safeData = data as Record<string, unknown>;
    const sanitized = {
      ...safeData,
      access_token: safeData.access_token ? '[REDACTED]' : null,
      refresh_token: safeData.refresh_token ? '[REDACTED]' : null,
      smtp_password: safeData.smtp_password ? '[REDACTED]' : null,
    };

    return NextResponse.json({ settings: sanitized, success: true });
  } catch (err) {
    console.error('Email settings POST error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Disconnect email provider
export async function DELETE(request: NextRequest) {
  try {
    const agentId = request.nextUrl.searchParams.get('agent_id');

    if (!agentId) {
      return NextResponse.json(
        { error: 'agent_id is required' },
        { status: 400 }
      );
    }

    const { error } = await db
      .from('agent_email_settings')
      .delete()
      .eq('agent_id', agentId);

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to delete email settings' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Email settings DELETE error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
