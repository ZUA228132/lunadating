import { useState, FormEvent } from 'react';
import { getSupabaseClient } from '@/lib/supabaseClient';

export default function TicketForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const supabase = getSupabaseClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();
    if (!user) {
      setMessage('Необходимо войти для отправки тикета');
      setLoading(false);
      return;
    }
    const { error } = await supabase.from('tickets').insert({
      author: user.id,
      title,
      description,
      status: 'open'
    });
    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Тикет создан. Мы скоро свяжемся с вами.');
      setTitle('');
      setDescription('');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md bg-[var(--card-bg)] border border-[var(--border-color)] p-6 rounded-lg shadow-md">
      {message && <p className="text-[var(--success)] font-medium">{message}</p>}
      <div>
        <label className="block mb-1 font-medium">Тема</label>
        <input
          type="text"
          className="w-full p-2 rounded-md border border-[var(--border-color)] bg-[var(--secondary)]"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block mb-1 font-medium">Описание</label>
        <textarea
          className="w-full p-2 rounded-md border border-[var(--border-color)] bg-[var(--secondary)]"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={5}
        />
      </div>
      <button
        type="submit"
        className="btn w-full"
        disabled={loading}
      >
        {loading ? 'Отправка…' : 'Отправить тикет'}
      </button>
    </form>
  );
}