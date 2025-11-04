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
  // Possible states: loading (initial), processing (verifying initData),
  // noInitData (running inside Telegram but initData is empty), notTelegram (opened in regular browser).
  const [status, setStatus] = useState<'loading' | 'processing' | 'noInitData' | 'notTelegram'>('loading');

  useEffect(() => {
    // Wait for Telegram object to appear.  In some environments it may be injected after a delay.
    let attempts = 0;
    const maxAttempts = 15; // ~3 seconds total
    const interval = setInterval(() => {
      const tg: any = typeof window !== 'undefined' ? (window as any).Telegram : undefined;
      if (tg) {
        clearInterval(interval);
        const initData = tg.WebApp?.initData || '';
        const userUnsafe = tg.WebApp?.initDataUnsafe?.user;
        if (initData || userUnsafe) {
          setStatus('processing');
          fetch('/api/init', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ initData, userUnsafe }),
          })
            .then((res) => res.json())
            .then((json) => {
              if (json.success) {
                router.replace('/dashboard');
              } else {
                console.error('initData verification failed', json);
                setStatus('noInitData');
              }
            })
            .catch((err) => {
              console.error(err);
              setStatus('noInitData');
            });
        } else {
          // Telegram object exists but contains no auth data
          setStatus('noInitData');
        }
      } else if (attempts >= maxAttempts) {
        clearInterval(interval);
        setStatus('notTelegram');
      }
      attempts++;
    }, 200);
    return () => clearInterval(interval);
  }, [router]);

  if (status === 'loading' || status === 'processing') {
    const message = status === 'processing' ? 'Авторизация…' : 'Загрузка…';
    return <div className="flex items-center justify-center min-h-[60vh]">{message}</div>;
  }
  if (status === 'noInitData') {
    return (
      <div className="flex flex-col items-center justify-center text-center space-y-6 py-10">
        <h1 className="text-4xl font-bold">DatingBot</h1>
        <p className="max-w-md">
          Не удалось получить данные Telegram. Пожалуйста, запустите мини‑приложение через бота
          (например, выбрав его в меню бота).
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
  // status === 'notTelegram'
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