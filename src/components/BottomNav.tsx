"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

/**
 * Bottom navigation bar for the app.  Displays persistent navigation with
 * icons and labels along the bottom edge of the screen.  Highlights the
 * current section based on the URL pathname.  Hidden on the home page.
 */
export default function BottomNav() {
  const pathname = usePathname();
  // Do not render bottom nav on the landing page
  if (pathname === '/') return null;

  const items = [
    {
      href: '/dashboard',
      label: 'Профиль',
      // Simple user icon
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5 mb-1"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.5 19.5a8.25 8.25 0 1115 0v.75a.75.75 0 01-.75.75h-13.5a.75.75 0 01-.75-.75V19.5z"
          />
        </svg>
      ),
    },
    {
      href: '/swipe',
      label: 'Свайпы',
      // Heart/like icon
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5 mb-1"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.5 3.75a4.5 4.5 0 013.182 7.682l-7.116 7.117a.75.75 0 01-1.06 0l-7.117-7.117a4.5 4.5 0 016.364-6.364l.823.823.824-.823A4.492 4.492 0 0116.5 3.75z"
          />
        </svg>
      ),
    },
    {
      href: '/settings',
      label: 'Настройки',
      // Gear/settings icon
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5 mb-1"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894a1.125 1.125 0 002.163.217l.47-.81a1.125 1.125 0 011.45-.45l.944.472c.5.25.7.88.433 1.358l-.39.677a1.125 1.125 0 00.217 1.284l.697.697c.39.39.878.217 1.284-.217l.677-.39a1.125 1.125 0 011.358.433l.472.944a1.125 1.125 0 01-.45 1.45l-.81.47a1.125 1.125 0 00-.217 2.163l.893.149c.543.09.94.56.94 1.11v1.094c0 .55-.397 1.02-.94 1.11l-.894.149a1.125 1.125 0 00-.217 2.163l.81.47c.5.25.7.878.45 1.358l-.472.944c-.25.5-.878.7-1.358.433l-.677-.39a1.125 1.125 0 00-1.284.217l-.697.697c-.39.39-.217.878.217 1.284l.39.677c.25.5.044 1.108-.433 1.358l-.944.472c-.5.25-1.108.044-1.358-.433l-.47-.81a1.125 1.125 0 00-2.163.217l-.149.894c-.09.542-.56.94-1.11.94h-1.094a1.125 1.125 0 01-1.11-.94l-.149-.894a1.125 1.125 0 00-2.163-.217l-.47.81a1.125 1.125 0 01-1.45.45l-.943-.472a1.125 1.125 0 01-.45-1.358l.39-.677a1.125 1.125 0 00-.217-1.284l-.697-.697a1.125 1.125 0 01-.217-1.284l.39-.677a1.125 1.125 0 00-.45-1.45l-.944-.472a1.125 1.125 0 01-.45-1.45l.472-.944c.25-.5.878-.7 1.358-.45l.677.39c.39.25.878.044 1.284-.217l.697-.697a1.125 1.125 0 011.284-.217l.677.39c.5.25 1.108.044 1.358-.433l.472-.944a1.125 1.125 0 011.45-.45l.81.47c.5.25 1.108.044 1.358-.433l.149-.894zM12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z"
          />
        </svg>
      ),
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t border-[var(--border-color)] bg-[var(--card-bg)] flex justify-around py-2 z-50">
      {items.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={
              'flex flex-col items-center justify-center text-xs font-medium transition-colors' +
              (active ? ' text-[var(--primary)]' : ' text-gray-400 hover:text-[var(--primary-hover)]')
            }
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}