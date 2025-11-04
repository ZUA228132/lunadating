/*
 * Navigation bar component.  Displays links based on user role.
 */
"use client";
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
    <nav className="border-b border-[var(--border-color)] bg-[var(--card-bg)] sticky top-0 z-40">
      <div className="container px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-[var(--primary)]">
          DatingBot
        </Link>
        {/* Desktop navigation links; hidden on small screens in favour of bottom nav */}
        <ul className="hidden md:flex items-center space-x-6 text-sm font-medium list-none">
          <li>
            <Link href="/dashboard" className="hover:text-[var(--primary-hover)]">
              Профиль
            </Link>
          </li>
          <li>
            <Link href="/swipe" className="hover:text-[var(--primary-hover)]">
              Свайпы
            </Link>
          </li>
          <li>
            <Link href="/settings" className="hover:text-[var(--primary-hover)]">
              Настройки
            </Link>
          </li>
          {user?.role === 'admin' && (
            <li>
              <Link href="/admin" className="hover:text-[var(--primary-hover)]">
                Админка
              </Link>
            </li>
          )}
          {(user?.role === 'admin' || user?.role === 'support') && (
            <li>
              <Link href="/support" className="hover:text-[var(--primary-hover)]">
                Поддержка
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}