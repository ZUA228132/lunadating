"use client";
import { useState, useEffect } from 'react';
import { getSupabaseClient } from '@/lib/supabaseClient';

export default function SettingsPage() {
  const [language, setLanguage] = useState('ru');
  const [theme, setTheme] = useState('light');
  const [notifications, setNotifications] = useState(true);
  const [preferredGender, setPreferredGender] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      const supabase = getSupabaseClient();
      const {
        data: { user }
      } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from('users').select('preferred_gender').eq('id', user.id).single();
      setPreferredGender((data as any)?.preferred_gender ?? '');
      // Retrieve settings from local storage
      setLanguage(localStorage.getItem('lang') || 'ru');
      setTheme(localStorage.getItem('theme') || 'light');
      setNotifications(localStorage.getItem('notifications') !== 'false');
    };
    fetchSettings();
  }, []);

  const saveSettings = async () => {
    setLoading(true);
    const supabase = getSupabaseClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('users').update({ preferred_gender: preferredGender }).eq('id', user.id);
    }
    localStorage.setItem('lang', language);
    localStorage.setItem('theme', theme);
    localStorage.setItem('notifications', notifications ? 'true' : 'false');
    setLoading(false);
    alert('Настройки сохранены');
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Настройки</h1>
      <div className="space-y-4 max-w-md bg-[var(--card-bg)] border border-[var(--border-color)] p-6 rounded-lg shadow-md">
        <div>
          <label className="block mb-1 font-medium">Тема</label>
          <select
            className="w-full p-2 rounded-md border border-[var(--border-color)] bg-[var(--secondary)]"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
          >
            <option value="light">Светлая</option>
            <option value="dark">Тёмная</option>
          </select>
        </div>
        <div>
          <label className="block mb-1 font-medium">Язык</label>
          <select
            className="w-full p-2 rounded-md border border-[var(--border-color)] bg-[var(--secondary)]"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="ru">Русский</option>
            <option value="en">English</option>
            <option value="uk">Українська</option>
          </select>
        </div>
        <div>
          <label className="flex items-center gap-2 font-medium">
            <input
              type="checkbox"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
            />
            Получать уведомления
          </label>
        </div>
        <div>
          <label className="block mb-1 font-medium">Предпочтительный пол в свайпах</label>
          <select
            className="w-full p-2 rounded-md border border-[var(--border-color)] bg-[var(--secondary)]"
            value={preferredGender}
            onChange={(e) => setPreferredGender(e.target.value)}
          >
            <option value="">Любой</option>
            <option value="male">Мужчины</option>
            <option value="female">Женщины</option>
            <option value="other">Другое</option>
          </select>
        </div>
        <button
          className="btn w-full"
          onClick={saveSettings}
          disabled={loading}
        >
          {loading ? 'Сохранение…' : 'Сохранить'}
        </button>
      </div>
    </div>
  );
}