import { NextRequest, NextResponse } from 'next/server';
import { parseTelegramInitData, verifyTelegramInitData } from '@/lib/auth';
import { getSupabaseClient } from '@/lib/supabaseClient';

/**
 * POST /api/init
 *
 * Receives a JSON body with an `initData` string, validates its signature
 * according to Telegram's Web App authentication rules, parses the contained
 * user object and upserts it into Supabase.  Returns a cookie with the
 * internal user ID and redirects the client to the dashboard.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const initData: string | undefined = body?.initData;
    if (!initData || typeof initData !== 'string') {
      return NextResponse.json({ error: 'initData missing' }, { status: 400 });
    }
    const data = parseTelegramInitData(initData);
    if (!verifyTelegramInitData(data)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }
    // Parse the user JSON from the `user` field.  It is passed as a JSON‑serialized
    // object within the querystring (see https://core.telegram.org/bots/webapps#webappinitdata).
    let user: any;
    try {
      user = JSON.parse(data.user);
    } catch (e) {
      return NextResponse.json({ error: 'Invalid user data' }, { status: 400 });
    }
    if (!user || !user.id) {
      return NextResponse.json({ error: 'User not found' }, { status: 400 });
    }
    // Upsert user in Supabase using the service role key.  Use minimal fields to avoid
    // overwriting user details on each login.
    const supabase = getSupabaseClient(process.env.SUPABASE_SERVICE_ROLE_KEY);
    const { data: upserted, error } = await supabase
      .from('users')
      .upsert(
        {
          telegram_id: user.id,
          username: user.username || null,
          full_name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username || null,
          photos: user.photo_url ? [user.photo_url] : [],
        },
        { onConflict: 'telegram_id' }
      )
      .select('id');
    if (error) {
      console.error('Supabase upsert error', error);
    }
    const record = upserted?.[0];
    const response = NextResponse.json({ success: true });
    if (record) {
      // Set uid cookie for client identification; not httpOnly since client code
      // may need to read it to make further API requests.  In production, you
      // should use secure JWT tokens or Supabase Auth.
      response.cookies.set('uid', record.id, { path: '/', httpOnly: false });
    }
    return response;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}