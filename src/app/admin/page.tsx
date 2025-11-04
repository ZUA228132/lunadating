"use client";
import { useEffect, useState } from 'react';
import { getSupabaseClient } from '@/lib/supabaseClient';

interface UserProfile {
  id: string;
  username: string;
  full_name: string;
  is_verified: boolean;
  role: string;
}

export default function AdminPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [badgeName, setBadgeName] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const supabase = getSupabaseClient();
      const {
        data: { user }
      } = await supabase.auth.getUser();
      if (!user) {
        setError('Нет доступа');
        setLoading(false);
        return;
      }
      // Check role
      const { data: me } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();
      if (!me || (me as any).role !== 'admin') {
        setError('Вы не администратор');
        setLoading(false);
        return;
      }
      const { data, error } = await supabase.from('users').select('id, username, full_name, is_verified, role');
      if (error) setError(error.message);
      else setUsers(data as UserProfile[]);
      setLoading(false);
    };
    fetchUsers();
  }, []);

  const toggleVerification = async (id: string, verified: boolean) => {
    const supabase = getSupabaseClient();
    const { error } = await supabase.from('users').update({ is_verified: !verified }).eq('id', id);
    if (!error) setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, is_verified: !verified } : u)));
  };

  const banUser = async (id: string) => {
    const supabase = getSupabaseClient();
    const { error } = await supabase.from('users').update({ role: 'banned' }).eq('id', id);
    if (!error) setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  const assignBadge = async (id: string) => {
    if (!badgeName) return;
    const supabase = getSupabaseClient();
    const { error } = await supabase.from('badges').insert({ user_id: id, name: badgeName });
    if (error) alert(error.message);
    else alert(`Бейдж ${badgeName} выдан`);
    setBadgeName('');
  };

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Админка</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-[var(--border-color)] divide-y divide-[var(--border-color)] rounded-lg overflow-hidden">
          <thead className="bg-[var(--secondary)]">
            <tr>
              <th className="p-3 text-left">Имя</th>
              <th className="p-3 text-left">Юзернейм</th>
              <th className="p-3 text-left">Верификация</th>
              <th className="p-3 text-left">Роль</th>
              <th className="p-3 text-left">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-color)]">
            {users.map((user) => (
              <tr key={user.id} className="bg-[var(--card-bg)] hover:bg-[var(--secondary)]">
                <td className="p-3">{user.full_name || '—'}</td>
                <td className="p-3">@{user.username}</td>
                <td className="p-3 flex items-center gap-2">
                  {user.is_verified ? '✓' : '—'}
                  <button
                    className="text-[var(--primary)] underline text-sm"
                    onClick={() => toggleVerification(user.id, user.is_verified)}
                  >
                    {user.is_verified ? 'Снять' : 'Выдать'}
                  </button>
                </td>
                <td className="p-3 capitalize">{user.role}</td>
                <td className="p-3">
                  <div className="flex flex-col gap-2">
                    <button
                      className="btn btn-danger text-xs"
                      onClick={() => banUser(user.id)}
                    >
                      Забанить
                    </button>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        className="border border-[var(--border-color)] p-1 rounded bg-[var(--secondary)] text-xs"
                        placeholder="Бейдж"
                        value={badgeName}
                        onChange={(e) => setBadgeName(e.target.value)}
                      />
                      <button
                        className="btn btn-success text-xs"
                        onClick={() => assignBadge(user.id)}
                      >
                        Выдать
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}