'use client';

import { useEffect, useState } from 'react';
import { getExperience, upsertExperience, deleteExperience, Experience } from '@/lib/api';
import toast from 'react-hot-toast';
import styles from '../admin.module.css';
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';

const EMPTY: Partial<Experience> = { company: '', role: '', duration: '', description: '', order_index: 0 };

export default function AdminExperiencePage() {
  const [items, setItems] = useState<Experience[]>([]);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Partial<Experience>>(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = () => getExperience().then(setItems);
  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing({ ...EMPTY, order_index: items.length + 1 }); setModal(true); };
  const openEdit = (item: Experience) => { setEditing(item); setModal(true); };
  const closeModal = () => { setModal(false); setEditing(EMPTY); };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditing((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await upsertExperience(editing);
      toast.success('Experience saved!');
      closeModal();
      load();
    } catch { toast.error('Save failed.'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this entry?')) return;
    await deleteExperience(id);
    toast.success('Deleted.');
    load();
  };

  return (
    <div className={styles.page}>
      <div className={styles.topRow}>
        <div className={styles.pageHeader} style={{ marginBottom: 0 }}>
          <h1>Experience</h1>
          <p>Manage your career history.</p>
        </div>
        <button className="btn btn-primary" onClick={openNew}><FiPlus /> Add Entry</button>
      </div>

      <div className={styles.tableWrap}>
        <table>
          <thead>
            <tr>
              <th>Role</th>
              <th>Company</th>
              <th>Duration</th>
              <th>Order</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>No entries yet.</td></tr>
            ) : items.map((item) => (
              <tr key={item.id}>
                <td><strong>{item.role}</strong></td>
                <td>{item.company}</td>
                <td>{item.duration}</td>
                <td>{item.order_index}</td>
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
              <h2>{editing.id ? 'Edit Experience' : 'Add Experience'}</h2>
              <button className={styles.modalClose} onClick={closeModal}><FiX /></button>
            </div>
            <form onSubmit={handleSave}>
              <div className={styles.modalBody}>
                <div className="form-group">
                  <label className="form-label">Role / Position</label>
                  <input name="role" value={editing.role || ''} onChange={handleChange} className="form-input" placeholder="Senior Mobile Developer" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Company</label>
                  <input name="company" value={editing.company || ''} onChange={handleChange} className="form-input" placeholder="TechSolution Pvt. Ltd." required />
                </div>
                <div className="form-group">
                  <label className="form-label">Duration</label>
                  <input name="duration" value={editing.duration || ''} onChange={handleChange} className="form-input" placeholder="Jan 2021 – Present" />
                </div>
                <div className="form-group">
                  <label className="form-label">Order</label>
                  <input name="order_index" type="number" value={editing.order_index ?? ''} onChange={handleChange} className="form-input" placeholder="1" />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea name="description" value={editing.description || ''} onChange={handleChange} className="form-input form-textarea" rows={5} placeholder="Describe your role and achievements..." />
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
