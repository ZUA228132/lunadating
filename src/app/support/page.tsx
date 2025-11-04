"use client";
import TicketList from '@/components/TicketList';
import { useEffect, useState } from 'react';
import { getSupabaseClient } from '@/lib/supabaseClient';

export default function SupportPage() {
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkRole = async () => {
      const supabase = getSupabaseClient();
      const {
        data: { user }
      } = await supabase.auth.getUser();
      if (!user) {
        setAuthorized(false);
        return;
      }
      const { data } = await supabase.from('users').select('role').eq('id', user.id).single();
      const role = (data as any)?.role;
      setAuthorized(role === 'support' || role === 'admin');
    };
    checkRole();
  }, []);

  if (authorized === null) return <p>Проверка доступа...</p>;
  if (!authorized) return <p className="text-red-500">У вас нет прав для просмотра этой страницы.</p>;
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Панель техподдержки</h1>
      <TicketList />
    </div>
  );
}