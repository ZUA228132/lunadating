/*
 * Navigation bar component.  Displays links based on user role.
 */
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getSupabaseClient } from '@/lib/supabaseClient';

interface UserData {
  id: string;
  role: string;
}

export default function Navbar() {
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const supabase = getSupabaseClient();
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        // Fetch role information from the users table
        const { data: profile } = await supabase
          .from('users')
          .select('id, role')
          .eq('id', user.id)
          .single();
        if (profile) setUser(profile as UserData);
      }
    };
    fetchUser();
  }, []);

  return (
    <nav className="border-b border-[var(--border-color)] bg-[var(--card-bg)] sticky top-0 z-50">
      <div className="container px-4 py-3 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-[var(--primary)]">
            DatingBot
          </Link>
          <div className="flex items-center gap-4 text-sm font-medium">
            <Link href="/dashboard" className="hover:text-[var(--primary-hover)]">
              Профиль
            </Link>
            <Link href="/swipe" className="hover:text-[var(--primary-hover)]">
              Свайпы
            </Link>
            <Link href="/settings" className="hover:text-[var(--primary-hover)]">
              Настройки
            </Link>
            {user?.role === 'admin' && (
              <Link href="/admin" className="hover:text-[var(--primary-hover)]">
                Админка
              </Link>
            )}
            {(user?.role === 'admin' || user?.role === 'support') && (
              <Link href="/support" className="hover:text-[var(--primary-hover)]">
                Поддержка
              </Link>
            )}
          </div>
      </div>
    </nav>
  );
}