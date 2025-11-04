import { useState } from 'react';

interface Profile {
  id: string;
  photos: string[];
  full_name: string;
  bio: string;
  hobbies?: string;
  height?: number;
  eye_colour?: string;
  is_verified?: boolean;
}

interface Props {
  profile: Profile;
  onLike: (profileId: string, isSuper?: boolean) => void;
  onDislike: (profileId: string) => void;
  showAllPhotos: boolean;
}

export default function SwipeCard({ profile, onLike, onDislike, showAllPhotos }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const photos = showAllPhotos ? profile.photos : profile.photos.slice(0, 2);

  const nextPhoto = () => {
    setCurrentIndex((i) => (i + 1) % photos.length);
  };

  return (
    <div className="w-full max-w-sm bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl overflow-hidden shadow-md">
      {photos.length > 0 && (
        <div className="relative w-full h-72">
          <img
            src={photos[currentIndex]}
            alt={profile.full_name}
            className="object-cover w-full h-72 cursor-pointer"
            onClick={nextPhoto}
          />
          {profile.is_verified && (
            <span className="absolute top-2 right-2 bg-[var(--primary)] text-white px-2 py-1 rounded-full text-xs">
              ✓
            </span>
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
            <h2 className="text-white text-lg font-semibold flex items-center gap-1">
              {profile.full_name}
            </h2>
            {profile.bio && (
              <p className="text-white text-sm truncate">{profile.bio}</p>
            )}
          </div>
        </div>
      )}
      <div className="p-4 space-y-1">
        {profile.hobbies && (
          <p className="text-sm text-[var(--text)]">
            <span className="font-medium">Хобби:</span> {profile.hobbies}
          </p>
        )}
        {profile.height && (
          <p className="text-sm text-[var(--text)]">
            <span className="font-medium">Рост:</span> {profile.height} см
          </p>
        )}
        {profile.eye_colour && (
          <p className="text-sm text-[var(--text)]">
            <span className="font-medium">Цвет глаз:</span> {profile.eye_colour}
          </p>
        )}
      </div>
      <div className="flex justify-around px-4 pb-4">
        <button
          className="btn btn-danger w-16 h-10 flex items-center justify-center"
          onClick={() => onDislike(profile.id)}
        >
          👎
        </button>
        <button
          className="btn w-20 h-10 flex items-center justify-center"
          onClick={() => onLike(profile.id)}
        >
          👍
        </button>
        <button
          className="btn btn-success w-20 h-10 flex items-center justify-center"
          onClick={() => onLike(profile.id, true)}
        >
          ⭐
        </button>
      </div>
    </div>
  );
}