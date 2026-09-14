// Supabase Edge Function — invites a new member by email using the service-role key.
//
// The client can never hold the service-role key, so inviting a user (which
// requires the Supabase Auth admin API) has to happen server-side. This
// function verifies the caller is an admin (using their own JWT) before
// using the service-role key to send the invite.
//
// Deploy with:
//   supabase functions deploy invite-member
// and make sure SUPABASE_SERVICE_ROLE_KEY is set as a function secret
// (SUPABASE_URL and SUPABASE_ANON_KEY are provided automatically):
//   supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) throw new Error('Missing Authorization header')

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const anonKey     = Deno.env.get('SUPABASE_ANON_KEY')!
    const serviceKey  = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

    // Scoped to the calling user's JWT — used only to confirm they're an admin.
    const callerClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    })

    const { data: { user }, error: userError } = await callerClient.auth.getUser()
    if (userError || !user) throw new Error('Not authenticated')

    const { data: callerProfile } = await callerClient
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    if (!callerProfile?.is_admin) throw new Error('Admin access required')

    const { email, full_name, belt_id } = await req.json()
    if (!email) throw new Error('Email is required')

    // Service-role client — only ever used inside this trusted function.
    const adminClient = createClient(supabaseUrl, serviceKey)

    const { data: invited, error: inviteError } = await adminClient.auth.admin.inviteUserByEmail(email, {
      data: { full_name: full_name || null },
    })
    if (inviteError) throw inviteError

    if (invited.user && (full_name || belt_id)) {
      await adminClient
        .from('profiles')
        .update({ full_name: full_name || null, belt_id: belt_id || null, status: 'active' })
        .eq('id', invited.user.id)
    }

    return new Response(JSON.stringify({ user: invited.user }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : 'Unknown error' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
