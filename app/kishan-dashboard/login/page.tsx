'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';
import styles from './page.module.css';
import { FiLock, FiMail, FiEye, FiEyeOff } from 'react-icons/fi';

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'kishan@portfolio.com',
    password: '',
  });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error('Please enter your email and password.');
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });
      if (error) throw error;
      toast.success('Welcome back, Kishan!');
      router.replace('/kishan-dashboard');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed. Check credentials.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.logoMark}>KP</div>
          <h1>Admin Login</h1>
          <p>Kishan Patel — Portfolio Admin</p>
        </div>

        {/* Form */}
        <form className={styles.form} onSubmit={handleLogin} noValidate>
          <div className="form-group">
            <label className="form-label">Email</label>
            <div className={styles.inputWrap}>
              <FiMail className={styles.inputIcon} />
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className={`form-input ${styles.input}`}
                placeholder="kishan@portfolio.com"
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className={styles.inputWrap}>
              <FiLock className={styles.inputIcon} />
              <input
                name="password"
                type={showPass ? 'text' : 'password'}
                value={form.password}
                onChange={handleChange}
                className={`form-input ${styles.input}`}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className={styles.eyeBtn}
                onClick={() => setShowPass(!showPass)}
                aria-label={showPass ? 'Hide password' : 'Show password'}
              >
                {showPass ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className={`btn btn-primary ${styles.submitBtn}`}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Hint */}
        <div className={styles.hint}>
          <span>🔐</span>
          <span>Admin access only — <strong>kishan@portfolio.com</strong></span>
        </div>
      </div>
    </div>
  );
}
