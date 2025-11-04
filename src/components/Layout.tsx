"use client";

import type { ReactNode } from 'react';
import Navbar from './Navbar';
import BottomNav from './BottomNav';
import { usePathname } from 'next/navigation';

export default function Layout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Only show top navigation for authenticated pages */}
      {pathname !== '/' && <Navbar />}
      {/* Reserve space at bottom for the bottom nav */}
      <main className="flex-1 container mx-auto p-4 pb-20">{children}</main>
      {/* Bottom navigation with icons; hidden on landing page via the component itself */}
      <BottomNav />
    </div>
  );
}