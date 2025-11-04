import { useState, useEffect, FormEvent } from 'react';
import { getSupabaseClient } from '@/lib/supabaseClient';

interface Profile {
  id: string;
  full_name: string | null;
  bio: string | null;
  hobbies: string | null;
  bad_habits: string | null;
  height: number | null;
  eye_colour: string | null;
  gender: string | null;
  preferred_gender: string | null;
  photos: string[];
}

export default function UserProfileForm() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const supabase = getSupabaseClient();
      const {
        data: { user }
      } = await supabase.auth.getUser();
      if (!user) {
        setError('Необходимо войти через Telegram');
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();
      if (error) {
        setError(error.message);
      } else {
        setProfile(data as Profile);
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setLoading(true);
    const supabase = getSupabaseClient();
    // Update profile
    const { error } = await supabase.from('users').update({
      full_name: profile.full_name,
      bio: profile.bio,
      hobbies: profile.hobbies,
      bad_habits: profile.bad_habits,
      height: profile.height,
      eye_colour: profile.eye_colour,
      gender: profile.gender,
      preferred_gender: profile.preferred_gender,
      photos: profile.photos
    }).eq('id', profile.id);
    if (error) setError(error.message);
    setLoading(false);
  };

  const handleChange = (field: keyof Profile, value: any) => {
    setProfile((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!profile) return null;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-[var(--card-bg)] border border-[var(--border-color)] p-6 rounded-lg shadow-md max-w-lg">
      <div>
        <label className="block mb-1 font-medium">Имя</label>
        <input
          type="text"
          className="w-full p-2 rounded-md border border-[var(--border-color)] bg-[var(--secondary)]"
          value={profile.full_name ?? ''}
          onChange={(e) => handleChange('full_name', e.target.value)}
        />
      </div>
      <div>
        <label className="block mb-1 font-medium">О себе</label>
        <textarea
          className="w-full p-2 rounded-md border border-[var(--border-color)] bg-[var(--secondary)]"
          value={profile.bio ?? ''}
          onChange={(e) => handleChange('bio', e.target.value)}
        />
      </div>
      <div>
        <label className="block mb-1 font-medium">Хобби</label>
        <input
          type="text"
          className="w-full p-2 rounded-md border border-[var(--border-color)] bg-[var(--secondary)]"
          value={profile.hobbies ?? ''}
          onChange={(e) => handleChange('hobbies', e.target.value)}
        />
      </div>
      <div>
        <label className="block mb-1 font-medium">Вредные привычки</label>
        <input
          type="text"
          className="w-full p-2 rounded-md border border-[var(--border-color)] bg-[var(--secondary)]"
          value={profile.bad_habits ?? ''}
          onChange={(e) => handleChange('bad_habits', e.target.value)}
        />
      </div>
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block mb-1 font-medium">Рост (см)</label>
          <input
            type="number"
            className="w-full p-2 rounded-md border border-[var(--border-color)] bg-[var(--secondary)]"
            value={profile.height ?? ''}
            onChange={(e) => handleChange('height', Number(e.target.value))}
          />
        </div>
        <div className="flex-1">
          <label className="block mb-1 font-medium">Цвет глаз</label>
          <input
            type="text"
            className="w-full p-2 rounded-md border border-[var(--border-color)] bg-[var(--secondary)]"
            value={profile.eye_colour ?? ''}
            onChange={(e) => handleChange('eye_colour', e.target.value)}
          />
        </div>
      </div>
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block mb-1 font-medium">Пол</label>
          <select
            className="w-full p-2 rounded-md border border-[var(--border-color)] bg-[var(--secondary)]"
            value={profile.gender ?? ''}
            onChange={(e) => handleChange('gender', e.target.value)}
          >
            <option value="">Выберите…</option>
            <option value="male">Мужчина</option>
            <option value="female">Женщина</option>
            <option value="other">Другое</option>
          </select>
        </div>
        <div className="flex-1">
          <label className="block mb-1 font-medium">Предпочтительный пол</label>
          <select
            className="w-full p-2 rounded-md border border-[var(--border-color)] bg-[var(--secondary)]"
            value={profile.preferred_gender ?? ''}
            onChange={(e) => handleChange('preferred_gender', e.target.value)}
          >
            <option value="">Любой</option>
            <option value="male">Мужчины</option>
            <option value="female">Женщины</option>
            <option value="other">Другое</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block mb-1 font-medium">Фото (URL через запятую)</label>
        <input
          type="text"
          className="w-full p-2 rounded-md border border-[var(--border-color)] bg-[var(--secondary)]"
          value={profile.photos.join(', ')}
          onChange={(e) => handleChange('photos', e.target.value.split(',').map((p) => p.trim()))}
        />
        <p className="text-xs text-gray-500 mt-1">
          Загрузите изображения в Supabase Storage и вставьте URL.
        </p>
      </div>
      <button
        type="submit"
        className="btn w-full"
        disabled={loading}
      >
        {loading ? 'Сохранение…' : 'Сохранить изменения'}
      </button>
    </form>
  );
}