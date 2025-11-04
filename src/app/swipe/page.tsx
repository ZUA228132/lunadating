"use client";
import { useEffect, useState } from 'react';
import SwipeCard from '@/components/SwipeCard';
import { getSupabaseClient } from '@/lib/supabaseClient';

interface Profile {
  id: string;
  full_name: string;
  bio: string;
  hobbies?: string;
  height?: number;
  eye_colour?: string;
  photos: string[];
  is_verified?: boolean;
}

export default function SwipePage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [current, setCurrent] = useState(0);
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [superLikesLeft, setSuperLikesLeft] = useState(1);

  useEffect(() => {
    const fetchProfiles = async () => {
      const supabase = getSupabaseClient();
      const {
        data: { user }
      } = await supabase.auth.getUser();
      if (!user) return;
      // Fetch premium status
      const { data: subscriptions } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .filter('expires_at', 'gte', new Date().toISOString())
        .maybeSingle();
      const isPremium = !!subscriptions;
      setShowAllPhotos(isPremium);
      setSuperLikesLeft(isPremium ? 5 : 1);
      // Fetch profiles excluding current user and already liked/disliked ones
      const { data } = await supabase
        .from('users')
        .select('*')
        .neq('id', user.id)
        .limit(50);
      setProfiles((data as any[]) ?? []);
    };
    fetchProfiles();
  }, []);

  const handleLike = async (profileId: string, isSuper?: boolean) => {
    try {
      if (isSuper && superLikesLeft <= 0) {
        alert('У вас закончились суперлайки');
        return;
      }
      await fetch('/api/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileId, isSuper }),
      });
      if (isSuper) setSuperLikesLeft((n) => n - 1);
      setCurrent((i) => i + 1);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDislike = async (profileId: string) => {
    // Do not record dislike in database for simplicity
    setCurrent((i) => i + 1);
  };

  const currentProfile = profiles[current];
  if (!currentProfile) {
    return <p>Пока нет анкет для просмотра.</p>;
  }
  return (
    <div className="flex flex-col items-center gap-4">
      <h1 className="text-2xl font-bold">Свайпы</h1>
      <SwipeCard
        profile={currentProfile}
        onLike={handleLike}
        onDislike={handleDislike}
        showAllPhotos={showAllPhotos}
      />
      <p className="text-sm text-[var(--text)] opacity-70">
        Суперлайков осталось: {superLikesLeft}
      </p>
    </div>
  );
}