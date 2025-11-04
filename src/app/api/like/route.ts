import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabaseClient';

export async function POST(request: NextRequest) {
  const { profileId, isSuper } = await request.json();
  const uid = request.cookies.get('uid')?.value;
  if (!uid) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
  }
  const supabase = getSupabaseClient(process.env.SUPABASE_SERVICE_ROLE_KEY);
  try {
    // Insert like
    await supabase.from('likes').upsert({ liker: uid, liked: profileId, is_super: !!isSuper });
    // Check for mutual like
    const { data: backLike } = await supabase
      .from('likes')
      .select('*')
      .eq('liker', profileId)
      .eq('liked', uid)
      .single();
    if (backLike) {
      // Create match (order IDs to avoid duplicates)
      const [u1, u2] = uid < profileId ? [uid, profileId] : [profileId, uid];
      await supabase.from('matches').upsert({ user1: u1, user2: u2 });
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}