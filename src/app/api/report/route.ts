import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabaseClient';

export async function POST(request: NextRequest) {
  const { reportedUserId, reason } = await request.json();
  const uid = request.cookies.get('uid')?.value;
  if (!uid) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
  }
  const supabase = getSupabaseClient(process.env.SUPABASE_SERVICE_ROLE_KEY);
  try {
    await supabase.from('reports').insert({ reporter: uid, reported_user: reportedUserId, reason });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}