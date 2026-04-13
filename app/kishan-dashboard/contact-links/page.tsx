'use client';

import { useEffect, useState } from 'react';
import { getContactLinks, upsertContactLink, deleteContactLink, ContactLink } from '@/lib/api';
import toast from 'react-hot-toast';
import styles from '../admin.module.css';
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';

const EMPTY: Partial<ContactLink> = { platform: '', url: '', icon: '' };

export default function AdminContactLinksPage() {
  const [items, setItems] = useState<ContactLink[]>([]);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Partial<ContactLink>>(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = () => getContactLinks().then(setItems);
  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing(EMPTY); setModal(true); };
  const openEdit = (item: ContactLink) => { setEditing(item); setModal(true); };
  const closeModal = () => { setModal(false); setEditing(EMPTY); };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditing((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await upsertContactLink(editing);
      toast.success('Link saved!');
      closeModal();
      load();
    } catch { toast.error('Save failed.'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this link?')) return;
    await deleteContactLink(id);
    toast.success('Deleted.');
    load();
  };

  return (
    <div className={styles.page}>
      <div className={styles.topRow}>
        <div className={styles.pageHeader} style={{ marginBottom: 0 }}>
          <h1>Contact Links</h1>
          <p>Manage social media and contact links shown on your site.</p>
        </div>
        <button className="btn btn-primary" onClick={openNew}><FiPlus /> Add Link</button>
      </div>

      <div className={styles.tableWrap}>
        <table>
          <thead>
            <tr>
              <th>Platform</th>
              <th>URL</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr><td colSpan={3} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>No links yet.</td></tr>
            ) : items.map((item) => (
              <tr key={item.id}>
                <td><strong>{item.platform}</strong></td>
                <td style={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  <a href={item.url} target="_blank" rel="noopener" style={{ color: 'var(--accent)' }}>{item.url}</a>
                </td>
                <td>
                  <div className={styles.actions}>
                    <button className="btn btn-ghost btn-sm" onClick={() => openEdit(item)}><FiEdit2 /></button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item.id)}><FiTrash2 /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>{editing.id ? 'Edit Link' : 'Add Link'}</h2>
              <button className={styles.modalClose} onClick={closeModal}><FiX /></button>
            </div>
            <form onSubmit={handleSave}>
              <div className={styles.modalBody}>
                <div className="form-group">
                  <label className="form-label">Platform Name</label>
                  <input name="platform" value={editing.platform || ''} onChange={handleChange} className="form-input" placeholder="LinkedIn, GitHub, Twitter..." required />
                </div>
                <div className="form-group">
                  <label className="form-label">URL</label>
                  <input name="url" type="url" value={editing.url || ''} onChange={handleChange} className="form-input" placeholder="https://linkedin.com/in/..." required />
                </div>
              </div>
              <div className={styles.modalFooter}>
                <button type="button" className="btn btn-ghost" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
