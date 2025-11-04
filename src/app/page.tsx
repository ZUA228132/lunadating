/*
 * Landing page.  If the app is launched inside Telegram (i.e. as a Mini App),
 * we will automatically extract the initData string, validate it via our
 * /api/init route, then redirect the user to the dashboard.  If the app
 * is opened outside Telegram, we inform the visitor that the web version is
 * under development and ask them to open the bot inside Telegram.
 */
"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'processing' | 'notTelegram'>('loading');

  useEffect(() => {
    // Detect the Telegram WebApp environment.  The Telegram object is only
    // available when the page is opened as a Mini App inside Telegram.
    const tg: any = (typeof window !== 'undefined' ? (window as any).Telegram : undefined);
    if (tg && tg.WebApp && tg.WebApp.initData) {
      // We are in Telegram.  Send initData to our API for verification.
      setStatus('processing');
      fetch('/api/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData: tg.WebApp.initData })
      })
        .then((res) => res.json())
        .then((json) => {
          if (json.success) {
            // Navigate to dashboard once the backend has created or updated the user.
            router.replace('/dashboard');
          } else {
            console.error('initData verification failed', json);
            setStatus('notTelegram');
          }
        })
        .catch((err) => {
          console.error(err);
          setStatus('notTelegram');
        });
    } else {
      // Not running inside Telegram; show fallback message.
      setStatus('notTelegram');
    }
  }, [router]);

  if (status === 'loading') {
    return <div className="flex items-center justify-center min-h-[60vh]">Загрузка…</div>;
  }
  if (status === 'processing') {
    return <div className="flex items-center justify-center min-h-[60vh]">Авторизация…</div>;
  }
  // fallback for notTelegram
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-6 py-10">
      <h1 className="text-4xl font-bold">DatingBot</h1>
      <p className="max-w-md">
        Веб‑версия приложения ещё в разработке. Откройте бота в Telegram для использования всех
        возможностей.
      </p>
      <a
        href={`https://t.me/${process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || ''}`}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Перейти к боту
      </a>
    </div>
  );
}