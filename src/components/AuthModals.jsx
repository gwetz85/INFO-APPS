import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AuthModals = ({ isOpen, type, onClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, register } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (type === 'login') {
      const res = login(username, password);
      if (res.success) onClose();
      else setError(res.message);
    } else {
      const res = register(username, password);
      if (res.success) {
        alert('Registrasi berhasil! Silakan login.');
        onClose();
      } else setError(res.message);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(2, 6, 23, 0.8)', backdropFilter: 'blur(8px)' }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="glass"
        style={{ width: '100%', maxWidth: '400px', padding: '2.5rem', borderRadius: '24px', position: 'relative' }}
      >
        <button onClick={onClose} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}>
          <X size={24} />
        </button>

        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', textAlign: 'center' }}>
          {type === 'login' ? 'Login' : 'Daftar'} <span className="text-gradient">Akun</span>
        </h2>
        <p style={{ color: 'var(--text-dim)', textAlign: 'center', marginBottom: '2rem' }}>
          {type === 'login' ? 'Masuk untuk mengelola event Anda' : 'Buat akun untuk mulai berkontribusi'}
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {error && (
            <div style={{ background: 'rgba(244, 63, 94, 0.1)', color: 'var(--accent)', padding: '0.75rem 1rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', color: 'var(--text-dim)' }}>Username</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={{ width: '100%', background: 'var(--bg-surface)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '0.75rem 1rem 0.75rem 3rem', color: 'white', outline: 'none' }} 
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', color: 'var(--text-dim)' }}>Kata Sandi</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ width: '100%', background: 'var(--bg-surface)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '0.75rem 1rem 0.75rem 3rem', color: 'white', outline: 'none' }} 
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', justifyContent: 'center' }}>
            {type === 'login' ? 'Masuk Sekarang' : 'Daftar Sekarang'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default AuthModals;
