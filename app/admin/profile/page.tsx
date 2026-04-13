'use client';

import { useEffect, useRef, useState } from 'react';
import { getProfile, upsertProfile, uploadImage, Profile } from '@/lib/api';
import toast from 'react-hot-toast';
import styles from '../admin.module.css';
import profileStyles from './page.module.css';
import { FiSave, FiUpload, FiUser } from 'react-icons/fi';

export default function AdminProfilePage() {
  const [form, setForm] = useState<Partial<Profile>>({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getProfile().then((p) => {
      if (p) setForm(p);
      else setForm({ avatar_url: '/kishan-avatar.jpg' }); // default local photo
      setFetching(false);
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // ── Image Upload ──────────────────────────────────────────────────
  const handleAvatarSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type & size
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5 MB.');
      return;
    }

    setUploading(true);
    try {
      const url = await uploadImage(file, 'avatars');
      setForm((prev) => ({ ...prev, avatar_url: url }));
      toast.success('Avatar uploaded! Click Save Profile to apply.');
    } catch (err) {
      // Fallback: show local preview if Supabase storage not set up yet
      const reader = new FileReader();
      reader.onload = (ev) => {
        setForm((prev) => ({ ...prev, avatar_url: ev.target?.result as string }));
      };
      reader.readAsDataURL(file);
      toast.error('Supabase storage not configured. Image preview shown locally — set up the "portfolio" bucket to persist uploads.');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await upsertProfile(form);
      toast.success('Profile saved!');
    } catch {
      toast.error('Failed to save profile.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className={styles.loading}>Loading...</div>;

  const avatarSrc = form.avatar_url || '/kishan-avatar.jpg';

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1>Edit Profile</h1>
        <p>Update your personal information shown on the portfolio.</p>
      </div>

      <form onSubmit={handleSave} className={styles.form}>
        {/* ── Avatar Section ── */}
        <div className={profileStyles.avatarSection}>
          <div className={profileStyles.avatarWrap}>
            {avatarSrc ? (
              <img src={avatarSrc} alt="Profile avatar" className={profileStyles.avatarImg} />
            ) : (
              <div className={profileStyles.avatarPlaceholder}>
                <FiUser size={40} />
              </div>
            )}
            {uploading && (
              <div className={profileStyles.uploadingOverlay}>
                <div className={profileStyles.spinner} />
              </div>
            )}
          </div>

          <div className={profileStyles.avatarInfo}>
            <h3>Profile Photo</h3>
            <p>JPG, PNG or WebP. Max 5 MB. Displays on your portfolio hero and about pages.</p>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleAvatarSelect}
              style={{ display: 'none' }}
              id="avatar-upload"
            />
            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
              <label htmlFor="avatar-upload" className={`btn btn-primary ${profileStyles.uploadBtn}`}>
                <FiUpload /> {uploading ? 'Uploading...' : 'Upload Photo'}
              </label>
              {form.avatar_url && (
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setForm((prev) => ({ ...prev, avatar_url: '' }))}
                >
                  Remove
                </button>
              )}
            </div>
            {/* Manual URL fallback */}
            <div style={{ marginTop: '0.75rem' }}>
              <label className="form-label" style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Or paste image URL</label>
              <input
                name="avatar_url"
                value={form.avatar_url?.startsWith('data:') ? '' : (form.avatar_url || '')}
                onChange={handleChange}
                className="form-input"
                placeholder="https://..."
                style={{ marginTop: '0.25rem' }}
              />
            </div>
          </div>
        </div>

        <div className="divider" style={{ margin: '0' }} />

        {/* ── Form Fields ── */}
        <div className={styles.formGrid}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input name="name" value={form.name || ''} onChange={handleChange} className="form-input" placeholder="Kishan Patel" />
          </div>
          <div className="form-group">
            <label className="form-label">Title / Role</label>
            <input name="title" value={form.title || ''} onChange={handleChange} className="form-input" placeholder="Mobile Application Developer" />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input name="email" type="email" value={form.email || ''} onChange={handleChange} className="form-input" placeholder="your@email.com" />
          </div>
          <div className="form-group">
            <label className="form-label">Phone</label>
            <input name="phone" value={form.phone || ''} onChange={handleChange} className="form-input" placeholder="+91 98765 43210" />
          </div>
          <div className="form-group">
            <label className="form-label">Location</label>
            <input name="location" value={form.location || ''} onChange={handleChange} className="form-input" placeholder="Gujarat, India" />
          </div>
          <div className="form-group">
            <label className="form-label">Years of Experience</label>
            <input name="years_experience" type="number" value={form.years_experience || ''} onChange={handleChange} className="form-input" placeholder="8" />
          </div>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">Resume URL</label>
            <input name="resume_url" value={form.resume_url || ''} onChange={handleChange} className="form-input" placeholder="https://drive.google.com/..." />
          </div>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">Bio</label>
            <textarea name="bio" value={form.bio || ''} onChange={handleChange} className="form-input form-textarea" rows={6} placeholder="Write your bio..." />
          </div>
        </div>

        <div className={styles.formFooter}>
          <button type="submit" className="btn btn-primary" disabled={loading || uploading}>
            <FiSave /> {loading ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  );
}
