'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import AnimatedSection from '@/components/AnimatedSection';
import { getProfile, getContactLinks, Profile, ContactLink } from '@/lib/api';
import { supabase } from '@/lib/supabase';
import styles from './page.module.css';
import toast from 'react-hot-toast';
import { FiMail, FiPhone, FiMapPin, FiSend, FiLinkedin, FiGithub, FiGlobe } from 'react-icons/fi';

export default function ContactPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [links, setLinks] = useState<ContactLink[]>([]);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    getProfile().then(setProfile);
    getContactLinks().then(setLinks);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill all required fields.');
      return;
    }
    setSending(true);
    try {
      const { error } = await supabase.from('contact_messages').insert([form]);
      if (error) throw error;
      toast.success('Message sent! I\'ll get back to you soon.');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch {
      toast.error('Failed to send. Please try emailing directly.');
    } finally {
      setSending(false);
    }
  };

  const getIcon = (platform: string) => {
    const p = platform.toLowerCase();
    if (p.includes('linkedin')) return <FiLinkedin />;
    if (p.includes('github')) return <FiGithub />;
    if (p.includes('mail') || p.includes('email')) return <FiMail />;
    return <FiGlobe />;
  };

  return (
    <div>
      {/* Hero */}
      <section className={styles.hero}>
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="section-label">Get In Touch</span>
            <h1 style={{ marginTop: '0.5rem' }}>Let's Work Together</h1>
            <p style={{ maxWidth: 500, marginTop: '0.75rem' }}>
              Have a project idea or a role that might be a great fit? I'd love to hear from you.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className={styles.grid}>
            {/* ── Contact Info ── */}
            <AnimatedSection>
              <div className={styles.info}>
                <h2>Contact Information</h2>
                <p>Reach out through the form or directly via any of the following channels.</p>

                <div className={styles.contactItems}>
                  {[
                    { icon: <FiMail />, label: 'Email', value: profile?.email || 'kishanpatel@email.com' },
                    { icon: <FiPhone />, label: 'Phone', value: profile?.phone || '+91 98765 43210' },
                    { icon: <FiMapPin />, label: 'Location', value: profile?.location || 'Gujarat, India' },
                  ].map((item, i) => (
                    <div key={i} className={styles.contactItem}>
                      <div className={styles.itemIcon}>{item.icon}</div>
                      <div>
                        <span className={styles.itemLabel}>{item.label}</span>
                        <span className={styles.itemValue}>{item.value}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Social Links */}
                {links.length > 0 && (
                  <div className={styles.socialLinks}>
                    <span className={styles.socialTitle}>Social</span>
                    <div className={styles.socialRow}>
                      {links.map((link) => (
                        <a
                          key={link.id}
                          href={link.url}
                          target="_blank"
                          rel="noopener"
                          className={styles.socialBtn}
                          title={link.platform}
                        >
                          {getIcon(link.platform)}
                          <span>{link.platform}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                <div className={styles.availability}>
                  <div className={styles.availableDot} />
                  <span>Available for new opportunities</span>
                </div>
              </div>
            </AnimatedSection>

            {/* ── Contact Form ── */}
            <AnimatedSection delay={0.12}>
              <form className={styles.form} onSubmit={handleSubmit} noValidate>
                <h2>Send a Message</h2>

                <div className={styles.formRow}>
                  <div className="form-group">
                    <label className="form-label">Name *</label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email *</label>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Subject</label>
                  <input
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Project inquiry, job opportunity..."
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Message *</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    className="form-input form-textarea"
                    placeholder="Tell me about your project or role..."
                    rows={6}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className={`btn btn-primary ${styles.submitBtn}`}
                  disabled={sending}
                >
                  {sending ? 'Sending...' : (
                    <>
                      <FiSend /> Send Message
                    </>
                  )}
                </button>
              </form>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </div>
  );
}
