'use client';

import { useEffect, useState } from 'react';
import { getSkills, upsertSkill, deleteSkill, Skill } from '@/lib/api';
import toast from 'react-hot-toast';
import styles from '../admin.module.css';
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';

const EMPTY: Partial<Skill> = { name: '', category: '', proficiency: 80, order_index: 0 };

export default function AdminSkillsPage() {
  const [items, setItems] = useState<Skill[]>([]);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Partial<Skill>>(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = () => getSkills().then(setItems);
  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing({ ...EMPTY, order_index: items.length + 1 }); setModal(true); };
  const openEdit = (item: Skill) => { setEditing(item); setModal(true); };
  const closeModal = () => { setModal(false); setEditing(EMPTY); };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
    setEditing((prev) => ({ ...prev, [e.target.name]: val }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await upsertSkill(editing);
      toast.success('Skill saved!');
      closeModal();
      load();
    } catch { toast.error('Save failed.'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this skill?')) return;
    await deleteSkill(id);
    toast.success('Deleted.');
    load();
  };

  return (
    <div className={styles.page}>
      <div className={styles.topRow}>
        <div className={styles.pageHeader} style={{ marginBottom: 0 }}>
          <h1>Skills</h1>
          <p>Add or update your technical skills.</p>
        </div>
        <button className="btn btn-primary" onClick={openNew}><FiPlus /> Add Skill</button>
      </div>

      <div className={styles.tableWrap}>
        <table>
          <thead>
            <tr>
              <th>Skill</th>
              <th>Category</th>
              <th>Proficiency</th>
              <th>Order</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>No skills yet.</td></tr>
            ) : items.map((item) => (
              <tr key={item.id}>
                <td><strong>{item.name}</strong></td>
                <td>{item.category}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ flex: 1, height: 6, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ width: `${item.proficiency}%`, height: '100%', background: 'var(--accent)', borderRadius: 3 }} />
                    </div>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent)' }}>{item.proficiency}%</span>
                  </div>
                </td>
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
              <h2>{editing.id ? 'Edit Skill' : 'Add Skill'}</h2>
              <button className={styles.modalClose} onClick={closeModal}><FiX /></button>
            </div>
            <form onSubmit={handleSave}>
              <div className={styles.modalBody}>
                <div className="form-group">
                  <label className="form-label">Skill Name</label>
                  <input name="name" value={editing.name || ''} onChange={handleChange} className="form-input" placeholder="Flutter / Dart" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <input name="category" value={editing.category || ''} onChange={handleChange} className="form-input" placeholder="Cross-Platform, Native, Backend..." />
                </div>
                <div className="form-group">
                  <label className="form-label">Proficiency (0–100)</label>
                  <input name="proficiency" type="number" min="0" max="100" value={editing.proficiency ?? 80} onChange={handleChange} className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">Order</label>
                  <input name="order_index" type="number" value={editing.order_index ?? ''} onChange={handleChange} className="form-input" />
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
