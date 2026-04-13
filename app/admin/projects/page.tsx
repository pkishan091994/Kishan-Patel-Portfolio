'use client';

import { useEffect, useRef, useState } from 'react';
import { getProjects, upsertProject, deleteProject, uploadImage, Project } from '@/lib/api';
import toast from 'react-hot-toast';
import styles from '../admin.module.css';
import uploadStyles from './page.module.css';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiUpload, FiImage } from 'react-icons/fi';

const EMPTY: Partial<Project> = {
  title: '', description: '', image_url: '', tech_stack: [],
  app_store_url: '', play_store_url: '', github_url: '', order_index: 0,
};

export default function AdminProjectsPage() {
  const [items, setItems] = useState<Project[]>([]);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Partial<Project>>(EMPTY);
  const [techInput, setTechInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = () => getProjects().then(setItems);
  useEffect(() => { load(); }, []);

  const openNew = () => {
    setEditing({ ...EMPTY, order_index: items.length + 1 });
    setTechInput('');
    setModal(true);
  };
  const openEdit = (item: Project) => {
    setEditing(item);
    setTechInput((item.tech_stack || []).join(', '));
    setModal(true);
  };
  const closeModal = () => { setModal(false); setEditing(EMPTY); setTechInput(''); };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const val = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
    setEditing((prev) => ({ ...prev, [e.target.name]: val }));
  };

  // ── Image upload for project ──────────────────────────────────────
  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast.error('Please select an image.'); return; }
    if (file.size > 8 * 1024 * 1024) { toast.error('Image must be under 8 MB.'); return; }

    setUploading(true);
    try {
      const url = await uploadImage(file, 'projects');
      setEditing((prev) => ({ ...prev, image_url: url }));
      toast.success('Image uploaded!');
    } catch {
      // Show local preview as fallback
      const reader = new FileReader();
      reader.onload = (ev) => {
        setEditing((prev) => ({ ...prev, image_url: ev.target?.result as string }));
      };
      reader.readAsDataURL(file);
      toast.error('Set up the Supabase "portfolio" bucket for persistent uploads. Preview shown locally.');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const tech = techInput.split(',').map((t) => t.trim()).filter(Boolean);
      await upsertProject({ ...editing, tech_stack: tech });
      toast.success('Project saved!');
      closeModal();
      load();
    } catch { toast.error('Save failed.'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this project?')) return;
    await deleteProject(id);
    toast.success('Deleted.');
    load();
  };

  return (
    <div className={styles.page}>
      <div className={styles.topRow}>
        <div className={styles.pageHeader} style={{ marginBottom: 0 }}>
          <h1>Projects</h1>
          <p>Manage your portfolio projects.</p>
        </div>
        <button className="btn btn-primary" onClick={openNew}><FiPlus /> Add Project</button>
      </div>

      <div className={styles.tableWrap}>
        <table>
          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Tech Stack</th>
              <th>Order</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>No projects yet.</td></tr>
            ) : items.map((item) => (
              <tr key={item.id}>
                <td>
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.title} style={{ width: 56, height: 40, objectFit: 'cover', borderRadius: 6, border: '1px solid var(--border)' }} />
                  ) : (
                    <div style={{ width: 56, height: 40, borderRadius: 6, background: 'var(--accent-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' }}>
                      <FiImage size={16} />
                    </div>
                  )}
                </td>
                <td><strong>{item.title}</strong></td>
                <td style={{ maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {(item.tech_stack || []).join(', ')}
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
              <h2>{editing.id ? 'Edit Project' : 'Add Project'}</h2>
              <button className={styles.modalClose} onClick={closeModal}><FiX /></button>
            </div>
            <form onSubmit={handleSave}>
              <div className={styles.modalBody}>

                {/* ── Image Upload ── */}
                <div className={uploadStyles.imgUploadSection}>
                  <div className={uploadStyles.imgPreview}>
                    {editing.image_url ? (
                      <img src={editing.image_url} alt="preview" className={uploadStyles.previewImg} />
                    ) : (
                      <div className={uploadStyles.previewPlaceholder}>
                        <FiImage size={32} />
                        <span>No image</span>
                      </div>
                    )}
                    {uploading && (
                      <div className={uploadStyles.uploadingOverlay}>
                        <div className={uploadStyles.spinner} />
                      </div>
                    )}
                  </div>

                  <div className={uploadStyles.imgActions}>
                    <p>Project thumbnail image. Recommended: 800×500px, JPG or PNG, max 8 MB.</p>
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleImageSelect}
                      style={{ display: 'none' }}
                      id="project-img-upload"
                    />
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <label htmlFor="project-img-upload" className="btn btn-primary" style={{ cursor: 'pointer', fontSize: '0.82rem', padding: '0.45rem 1rem' }}>
                        <FiUpload size={13} /> {uploading ? 'Uploading...' : 'Upload Image'}
                      </label>
                      {editing.image_url && (
                        <button type="button" className="btn btn-ghost" style={{ fontSize: '0.82rem', padding: '0.45rem 1rem' }}
                          onClick={() => setEditing((prev) => ({ ...prev, image_url: '' }))}>
                          Remove
                        </button>
                      )}
                    </div>
                    <div className="form-group" style={{ marginTop: '0.5rem' }}>
                      <label className="form-label" style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Or paste image URL</label>
                      <input name="image_url" value={editing.image_url?.startsWith('data:') ? '' : (editing.image_url || '')}
                        onChange={handleChange} className="form-input" placeholder="https://..." style={{ marginTop: '0.25rem' }} />
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Title</label>
                  <input name="title" value={editing.title || ''} onChange={handleChange} className="form-input" placeholder="HealthTrack Pro" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea name="description" value={editing.description || ''} onChange={handleChange} className="form-input form-textarea" rows={3} placeholder="Describe the project..." />
                </div>
                <div className="form-group">
                  <label className="form-label">Tech Stack (comma separated)</label>
                  <input value={techInput} onChange={(e) => setTechInput(e.target.value)} className="form-input" placeholder="Flutter, Firebase, ML Kit" />
                </div>
                <div className="form-group">
                  <label className="form-label">App Store URL</label>
                  <input name="app_store_url" value={editing.app_store_url || ''} onChange={handleChange} className="form-input" placeholder="https://apps.apple.com/..." />
                </div>
                <div className="form-group">
                  <label className="form-label">Play Store URL</label>
                  <input name="play_store_url" value={editing.play_store_url || ''} onChange={handleChange} className="form-input" placeholder="https://play.google.com/..." />
                </div>
                <div className="form-group">
                  <label className="form-label">GitHub URL</label>
                  <input name="github_url" value={editing.github_url || ''} onChange={handleChange} className="form-input" placeholder="https://github.com/..." />
                </div>
                <div className="form-group">
                  <label className="form-label">Order</label>
                  <input name="order_index" type="number" value={editing.order_index ?? ''} onChange={handleChange} className="form-input" />
                </div>
              </div>
              <div className={styles.modalFooter}>
                <button type="button" className="btn btn-ghost" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving || uploading}>
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
