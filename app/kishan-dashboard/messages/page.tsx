'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import styles from '../admin.module.css';

interface Message {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
}

export default function AdminMessagesPage() {
  const [msgs, setMsgs] = useState<Message[]>([]);
  const [selected, setSelected] = useState<Message | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setMsgs(data || []);
        setLoading(false);
      });
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1>Messages</h1>
        <p>Contact form submissions from portfolio visitors.</p>
      </div>

      {loading ? (
        <div className={styles.loading}>Loading messages...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1fr' : '1fr', gap: '1.5rem', alignItems: 'start' }}>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Subject</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {msgs.length === 0 ? (
                  <tr><td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>No messages yet.</td></tr>
                ) : msgs.map((m) => (
                  <tr
                    key={m.id}
                    onClick={() => setSelected(selected?.id === m.id ? null : m)}
                    style={{ cursor: 'pointer', background: selected?.id === m.id ? 'var(--accent-soft)' : undefined }}
                  >
                    <td><strong>{m.name}</strong></td>
                    <td>{m.email}</td>
                    <td>{m.subject || '—'}</td>
                    <td style={{ whiteSpace: 'nowrap', fontSize: '0.8rem' }}>{new Date(m.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {selected && (
            <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h3>{selected.name}</h3>
                <button className="btn btn-ghost btn-sm" onClick={() => setSelected(null)}>✕ Close</button>
              </div>
              <p style={{ fontSize: '0.85rem', marginBottom: '0.25rem' }}><strong>Email:</strong> {selected.email}</p>
              <p style={{ fontSize: '0.85rem', marginBottom: '0.25rem' }}><strong>Subject:</strong> {selected.subject || '—'}</p>
              <p style={{ fontSize: '0.85rem', marginBottom: '1rem' }}><strong>Date:</strong> {new Date(selected.created_at).toLocaleString()}</p>
              <div className="divider" />
              <p style={{ fontSize: '0.9rem', whiteSpace: 'pre-wrap', lineHeight: 1.75 }}>{selected.message}</p>
              <a href={`mailto:${selected.email}`} className="btn btn-primary" style={{ marginTop: '1.25rem', display: 'inline-flex' }}>
                Reply via Email
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
