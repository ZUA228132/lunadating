import { useEffect, useState } from 'react';
import { getSupabaseClient } from '@/lib/supabaseClient';

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: string;
  answer: string | null;
  created_at: string;
  author: string;
}

"use client";
export default function TicketList() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selected, setSelected] = useState<Ticket | null>(null);
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTickets = async () => {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) setError(error.message);
      else setTickets(data as Ticket[]);
    };
    loadTickets();
  }, []);

  const handleReply = async () => {
    if (!selected) return;
    setLoading(true);
    const supabase = getSupabaseClient();
    const { error: updateError } = await supabase
      .from('tickets')
      .update({ answer: reply, status: 'closed', updated_at: new Date().toISOString() })
      .eq('id', selected.id);
    if (updateError) setError(updateError.message);
    else {
      setTickets((prev) =>
        prev.map((t) => (t.id === selected.id ? { ...t, answer: reply, status: 'closed' } : t))
      );
      setSelected(null);
      setReply('');
    }
    setLoading(false);
  };

  const handleClose = async (ticket: Ticket) => {
    const supabase = getSupabaseClient();
    const { error: updateError } = await supabase
      .from('tickets')
      .update({ status: 'closed', updated_at: new Date().toISOString() })
      .eq('id', ticket.id);
    if (updateError) setError(updateError.message);
    else setTickets((prev) => prev.map((t) => (t.id === ticket.id ? { ...t, status: 'closed' } : t)));
  };

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="w-full md:w-1/3">
        <h2 className="text-xl font-semibold mb-2">Тикеты</h2>
        {error && <p className="text-red-500">{error}</p>}
        <ul className="border border-[var(--border-color)] rounded-lg overflow-hidden divide-y divide-[var(--border-color)]">
          {tickets.map((ticket) => (
            <li
              key={ticket.id}
              className="p-3 hover:bg-[var(--secondary)] cursor-pointer"
              onClick={() => setSelected(ticket)}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium text-[var(--text)] truncate max-w-[150px]">{ticket.title}</span>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${ticket.status === 'open' ? 'bg-yellow-400/20 text-yellow-700' : 'bg-green-400/20 text-green-700'}`}
                >
                  {ticket.status === 'open' ? 'Открыт' : 'Закрыт'}
                </span>
              </div>
              <p className="text-[var(--text)] text-xs mt-1 opacity-70">
                {new Date(ticket.created_at).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex-1">
        {selected ? (
          <div className="border border-[var(--border-color)] rounded-lg p-4 bg-[var(--card-bg)] shadow-sm">
            <h3 className="text-lg font-semibold mb-2">{selected.title}</h3>
            <p className="mb-4 whitespace-pre-line text-[var(--text)] opacity-90">
              {selected.description}
            </p>
            {selected.status === 'open' ? (
              <>
                <textarea
                  className="w-full p-2 border border-[var(--border-color)] rounded-md mb-2 bg-[var(--secondary)]"
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Ваш ответ..."
                  rows={5}
                />
                <div className="flex gap-2">
                  <button
                    className="btn"
                    onClick={handleReply}
                    disabled={loading}
                  >
                    Ответить
                  </button>
                  <button
                    className="btn bg-gray-400 hover:bg-gray-500"
                    onClick={() => handleClose(selected)}
                  >
                    Закрыть
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="mb-2 font-medium">Ответ:</p>
                <p className="whitespace-pre-line mb-4 bg-[var(--secondary)] p-3 rounded">
                  {selected.answer || '—'}
                </p>
                <button
                  className="btn bg-gray-400 hover:bg-gray-500"
                  onClick={() => setSelected(null)}
                >
                  Назад
                </button>
              </>
            )}
          </div>
        ) : (
          <p className="text-[var(--text)] opacity-70">Выберите тикет для просмотра.</p>
        )}
      </div>
    </div>
  );
}