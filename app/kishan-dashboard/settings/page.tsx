'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';
import styles from '../admin.module.css';
import settingsStyles from './page.module.css';
import { FiLock, FiEye, FiEyeOff, FiCheck, FiShield } from 'react-icons/fi';

interface PasswordField {
  current: string;
  newPass: string;
  confirm: string;
}

export default function AdminSettingsPage() {
  const [form, setForm] = useState<PasswordField>({ current: '', newPass: '', confirm: '' });
  const [show, setShow] = useState({ current: false, newPass: false, confirm: false });
  const [loading, setLoading] = useState(false);

  const toggle = (field: keyof typeof show) =>
    setShow((prev) => ({ ...prev, [field]: !prev[field] }));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Password strength check
  const getStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score; // 0–4
  };

  const strengthLabel = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColor = ['#e74c3c', '#e67e22', '#f1c40f', '#2ecc71', '#27ae60'];
  const strength = getStrength(form.newPass);

  const rules = [
    { label: 'At least 8 characters', pass: form.newPass.length >= 8 },
    { label: 'Uppercase letter (A–Z)', pass: /[A-Z]/.test(form.newPass) },
    { label: 'Number (0–9)', pass: /[0-9]/.test(form.newPass) },
    { label: 'Special character (#, @, !…)', pass: /[^A-Za-z0-9]/.test(form.newPass) },
    { label: 'Passwords match', pass: form.newPass !== '' && form.newPass === form.confirm },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.current) { toast.error('Please enter your current password.'); return; }
    if (form.newPass.length < 8) { toast.error('New password must be at least 8 characters.'); return; }
    if (form.newPass !== form.confirm) { toast.error('Passwords do not match.'); return; }
    if (strength < 2) { toast.error('Please choose a stronger password.'); return; }

    setLoading(true);
    try {
      // Re-authenticate with current password first
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.email) throw new Error('Not authenticated.');

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: form.current,
      });
      if (signInError) throw new Error('Current password is incorrect.');

      // Update to new password
      const { error: updateError } = await supabase.auth.updateUser({
        password: form.newPass,
      });
      if (updateError) throw updateError;

      toast.success('Password changed successfully!');
      setForm({ current: '', newPass: '', confirm: '' });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to change password.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1>Account Settings</h1>
        <p>Manage your admin account credentials.</p>
      </div>

      {/* ── Account Info Card ── */}
      <div className={settingsStyles.infoCard}>
        <div className={settingsStyles.infoIcon}><FiShield /></div>
        <div>
          <strong>Admin Account</strong>
          <p>kishan@portfolio.com · You are the portfolio administrator</p>
        </div>
      </div>

      {/* ── Change Password Form ── */}
      <div className={settingsStyles.section}>
        <div className={settingsStyles.sectionHeader}>
          <FiLock />
          <h2>Change Password</h2>
        </div>

        <form onSubmit={handleSubmit} className={settingsStyles.form} noValidate>
          {/* Current Password */}
          <div className="form-group">
            <label className="form-label">Current Password</label>
            <div className={settingsStyles.inputWrap}>
              <FiLock className={settingsStyles.inputIcon} />
              <input
                name="current"
                type={show.current ? 'text' : 'password'}
                value={form.current}
                onChange={handleChange}
                className={`form-input ${settingsStyles.input}`}
                placeholder="Enter current password"
                autoComplete="current-password"
                required
              />
              <button type="button" className={settingsStyles.eyeBtn} onClick={() => toggle('current')}>
                {show.current ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="form-group">
            <label className="form-label">New Password</label>
            <div className={settingsStyles.inputWrap}>
              <FiLock className={settingsStyles.inputIcon} />
              <input
                name="newPass"
                type={show.newPass ? 'text' : 'password'}
                value={form.newPass}
                onChange={handleChange}
                className={`form-input ${settingsStyles.input}`}
                placeholder="Enter new password"
                autoComplete="new-password"
                required
              />
              <button type="button" className={settingsStyles.eyeBtn} onClick={() => toggle('newPass')}>
                {show.newPass ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            {/* Strength meter */}
            {form.newPass && (
              <div className={settingsStyles.strengthWrap}>
                <div className={settingsStyles.strengthBar}>
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={settingsStyles.strengthSegment}
                      style={{ background: i < strength ? strengthColor[strength] : 'var(--border)' }}
                    />
                  ))}
                </div>
                <span className={settingsStyles.strengthLabel} style={{ color: strengthColor[strength] }}>
                  {strengthLabel[strength]}
                </span>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label className="form-label">Confirm New Password</label>
            <div className={settingsStyles.inputWrap}>
              <FiLock className={settingsStyles.inputIcon} />
              <input
                name="confirm"
                type={show.confirm ? 'text' : 'password'}
                value={form.confirm}
                onChange={handleChange}
                className={`form-input ${settingsStyles.input}`}
                placeholder="Re-enter new password"
                autoComplete="new-password"
                required
              />
              <button type="button" className={settingsStyles.eyeBtn} onClick={() => toggle('confirm')}>
                {show.confirm ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          {/* Password Rules */}
          <div className={settingsStyles.rules}>
            {rules.map((r, i) => (
              <div key={i} className={`${settingsStyles.rule} ${r.pass ? settingsStyles.rulePass : ''}`}>
                <FiCheck className={settingsStyles.ruleIcon} />
                <span>{r.label}</span>
              </div>
            ))}
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ alignSelf: 'flex-start' }}>
            <FiLock /> {loading ? 'Changing...' : 'Change Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
