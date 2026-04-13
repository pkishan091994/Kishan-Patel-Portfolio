'use client';

import { useEffect, useState } from 'react';
import { getEducation, upsertEducation, deleteEducation, Education } from '@/lib/api';
import toast from 'react-hot-toast';
import styles from '../admin.module.css';
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';

const EMPTY: Partial<Education> = { degree: '', institution: '', year: '', description: '' };

export default function AdminEducationPage() {
  const [items, setItems] = useState<Education[]>([]);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Partial<Education>>(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = () => getEducation().then(setItems);
  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing(EMPTY); setModal(true); };
  const openEdit = (item: Education) => { setEditing(item); setModal(true); };
  const closeModal = () => { setModal(false); setEditing(EMPTY); };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditing((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await upsertEducation(editing);
      toast.success('Education saved!');
      closeModal();
      load();
    } catch { toast.error('Save failed.'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this entry?')) return;
    await deleteEducation(id);
    toast.success('Deleted.');
    load();
  };

  return (
    <div className={styles.page}>
      <div className={styles.topRow}>
        <div className={styles.pageHeader} style={{ marginBottom: 0 }}>
          <h1>Education</h1>
          <p>Manage your academic background.</p>
        </div>
        <button className="btn btn-primary" onClick={openNew}><FiPlus /> Add Entry</button>
      </div>

      <div className={styles.tableWrap}>
        <table>
          <thead>
            <tr>
              <th>Degree</th>
              <th>Institution</th>
              <th>Year</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr><td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>No entries yet.</td></tr>
            ) : items.map((item) => (
              <tr key={item.id}>
                <td><strong>{item.degree}</strong></td>
                <td>{item.institution}</td>
                <td>{item.year}</td>
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
              <h2>{editing.id ? 'Edit Education' : 'Add Education'}</h2>
              <button className={styles.modalClose} onClick={closeModal}><FiX /></button>
            </div>
            <form onSubmit={handleSave}>
              <div className={styles.modalBody}>
                <div className="form-group">
                  <label className="form-label">Degree / Qualification</label>
                  <input name="degree" value={editing.degree || ''} onChange={handleChange} className="form-input" placeholder="B.Tech in Computer Science" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Institution</label>
                  <input name="institution" value={editing.institution || ''} onChange={handleChange} className="form-input" placeholder="Gujarat Technological University" />
                </div>
                <div className="form-group">
                  <label className="form-label">Year</label>
                  <input name="year" value={editing.year || ''} onChange={handleChange} className="form-input" placeholder="2012–2016" />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea name="description" value={editing.description || ''} onChange={handleChange} className="form-input form-textarea" rows={3} placeholder="Additional details..." />
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
