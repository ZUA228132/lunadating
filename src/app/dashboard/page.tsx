"use client";
import UserProfileForm from '@/components/UserProfileForm';

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Мой профиль</h1>
      <UserProfileForm />
    </div>
  );
}