/*
 * Landing page.  Prompts the user to sign in via the Telegram Login Widget.
 * The widget will call our /api/auth route upon successful login.
 */
"use client";
import { useEffect } from 'react';

export default function HomePage() {
  useEffect(() => {
    // Dynamically inject Telegram login script on the client side only.
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.async = true;
    script.dataset.telegramLogin = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || '';
    script.dataset.size = 'large';
    script.dataset.userpic = 'true';
    script.dataset.authUrl = '/api/auth';
    script.dataset.requestAccess = 'write';
    document.getElementById('telegram-login')?.appendChild(script);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center text-center space-y-6">
      <h1 className="text-4xl font-bold">Добро пожаловать в DatingBot</h1>
      <p className="max-w-md">
        Это приложение позволяет знакомиться с новыми людьми через ваш Telegram аккаунт.
        Создайте профиль, свайпайте, находите совпадения, общайтесь и становитесь премиум‑участником.
      </p>
      <div id="telegram-login" />
    </div>
  );
}