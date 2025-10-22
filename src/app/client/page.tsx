"use client";
import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ClientHero } from './ClientHero';

export default function ClientAccess() {
  const [error, setError] = React.useState('');
  const [pending, setPending] = React.useState(false);
  const [checked, setChecked] = React.useState(false);
  const [authenticated, setAuthenticated] = React.useState(false);

  React.useEffect(() => {
    let active = true;
    fetch('/api/client-auth', { method: 'GET' })
      .then(res => {
        if (!active) return;
        if (res.ok) setAuthenticated(true);
      })
      .catch(() => {})
      .finally(() => { if (active) setChecked(true); });
    return () => { active = false; };
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    const formData = new FormData(event.currentTarget);
    const password = formData.get('password')?.toString() ?? '';
    if (!password) {
      setError('Password is required.');
      return;
    }
    setPending(true);
    try {
      const res = await fetch('/api/client-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      if (res.ok) {
        setAuthenticated(true);
        setChecked(true);
        setError('');
        return;
      }
      setError('Incorrect password.');
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setPending(false);
    }
  }

  const showGate = checked && !authenticated;
  const showContent = authenticated;
  return (
    <main
      style={{
        minHeight: '100vh',
        position: 'relative'
      }}
    >
      <div style={{ position: 'relative', padding: '3.2rem 1.2rem 4.2rem' }}>
        <AnimatePresence>
          {showContent && (
            <motion.div
              key="client-content"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            >
              <ClientHero />
            </motion.div>
          )}
        </AnimatePresence>

        {!checked && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem 0' }}>
            <span style={{ letterSpacing: '0.4em', textTransform: 'uppercase', fontSize: '0.75rem', opacity: 0.6 }}>Verifying access…</span>
          </div>
        )}

        <AnimatePresence>
          {showGate && (
            <motion.div
              key="gate-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(12, 8, 4, 0.7)',
                backdropFilter: 'blur(14px)',
                WebkitBackdropFilter: 'blur(14px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem 1.5rem',
                zIndex: 80
              }}
            >
              <motion.div
                key="gate-card"
                initial={{ opacity: 0, y: 40, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -30, scale: 0.78 }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  width: 'min(420px, 100%)',
                  background: '#f8cfa4',
                  borderRadius: 26,
                  border: '1px solid rgba(0,0,0,0.08)',
                  boxShadow: '0 50px 140px -65px rgba(0,0,0,0.85)',
                  padding: '2.4rem 2.6rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.25rem',
                  textAlign: 'left'
                }}
              >
                <header style={{ display: 'grid', gap: '0.4rem' }}>
                  <span style={{ fontSize: '0.72rem', letterSpacing: '0.55em', textTransform: 'uppercase', color: 'rgba(17,24,39,0.6)' }}>Client Gate</span>
                  <h2 style={{ margin: 0, fontSize: '1.6rem', letterSpacing: '0.08em' }}>Enter Passcode</h2>
                  <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.55, color: '#3d2a1f' }}>
                    This entrance is reserved for client partners. Provide the shared password to unlock client catalogs and token tools.
                  </p>
                </header>
                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '0.85rem' }}>
                  <label style={{ display: 'grid', gap: '0.4rem', fontSize: '0.8rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    Password
                    <input
                      type="password"
                      name="password"
                      placeholder="Enter password"
                      style={{
                        padding: '0.85rem 0.95rem',
                        borderRadius: 16,
                        border: '1px solid rgba(17,24,39,0.25)',
                        background: '#111f3d',
                        color: '#fff',
                        fontSize: '1rem',
                        letterSpacing: '0.04em'
                      }}
                      disabled={pending}
                      autoComplete="off"
                      required
                    />
                  </label>
                  {error && (
                    <span style={{ color: '#c0392b', fontSize: '0.82rem', letterSpacing: '0.05em' }}>{error}</span>
                  )}
                  <motion.button
                    type="submit"
                    disabled={pending}
                    style={{
                      padding: '0.95rem',
                      borderRadius: 18,
                      border: 'none',
                      background: 'linear-gradient(135deg, #111f3d 0%, #1f2f55 65%)',
                      color: '#fff',
                      fontSize: '0.92rem',
                      letterSpacing: '0.32em',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      fontWeight: 600
                    }}
                    whileHover={{ scale: pending ? 1 : 1.02 }}
                    whileTap={{ scale: pending ? 1 : 0.97 }}
                  >
                    {pending ? 'Verifying…' : 'Unlock Access'}
                  </motion.button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

