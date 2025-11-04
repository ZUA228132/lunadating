import { NextRequest, NextResponse } from 'next/server';
import { getTelegramUserFromQuery } from '@/lib/auth';
import { getSupabaseClient } from '@/lib/supabaseClient';

export async function GET(request: NextRequest) {
  // Telegram sends data via GET query parameters to the authUrl.
  const url = new URL(request.url);
  const userData = getTelegramUserFromQuery(url.searchParams);
  if (!userData) {
    return NextResponse.json({ error: 'Неверные данные Telegram' }, { status: 400 });
  }
  try {
    // Use service role to upsert user in database.
    const supabase = getSupabaseClient(process.env.SUPABASE_SERVICE_ROLE_KEY);
    const { data, error } = await supabase
      .from('users')
      .upsert(
        {
          telegram_id: parseInt(userData.id, 10),
          username: userData.username,
          full_name: `${userData.first_name || ''} ${userData.last_name || ''}`.trim() || userData.username,
          photos: userData.photo_url ? [userData.photo_url] : [],
        },
        { onConflict: 'telegram_id' }
      )
      .select('id, telegram_id');
    if (error) {
      console.error('Supabase upsert error', error);
    }
    const user = data?.[0];
    // Set a cookie with the Supabase user ID for client identification.  In a production
    // system you should use Supabase Auth or your own JWT implementation instead.
    const response = NextResponse.redirect(new URL('/dashboard', request.url));
    if (user) {
      response.cookies.set('uid', user.id, { path: '/', httpOnly: false });
    }
    return response;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}