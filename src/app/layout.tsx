import './globals.css';
import type { Metadata } from 'next';
import Layout from '@/components/Layout';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Dating Bot',
  description: 'Telegram dating web app with swipes, verification and admin panel'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}