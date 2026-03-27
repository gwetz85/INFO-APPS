import React, { useState, useEffect } from 'react';
import { Calendar, User as UserIcon, LogOut, Settings, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AuthModals from './AuthModals';

const Navbar = ({ onOpenSettings, onOpenParticipants }) => {
  const [scrolled, setScrolled] = useState(false);
  const [authModal, setAuthModal] = useState({ open: false, type: 'login' });
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={scrolled ? 'scrolled' : ''}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="glass" style={{ padding: '0.5rem', borderRadius: '12px' }}>
            <Calendar size={24} color="#2dd4bf" />
          </div>
          <span style={{ fontSize: '1.5rem', fontWeight: 'bold', fontFamily: 'var(--font-heading)' }}>
            EVENT<span className="text-gradient">KU</span>
          </span>
        </div>
        
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: '600' }}>{user.username}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--primary)' }}>{user.role}</div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={onOpenParticipants} className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                  <Users size={16} /> Tambah Peserta
                </button>
                <button onClick={onOpenSettings} className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                  <Settings size={16} /> Pengaturan
                </button>
              </div>
              <button onClick={logout} className="glass" style={{ border: 'none', padding: '0.5rem', borderRadius: '12px', color: 'var(--accent)', cursor: 'pointer' }}>
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button 
                onClick={() => setAuthModal({ open: true, type: 'login' })}
                className="btn btn-outline" 
                style={{ padding: '0.5rem 1.5rem', fontSize: '0.875rem' }}
              >
                Login
              </button>
              <button 
                onClick={() => setAuthModal({ open: true, type: 'register' })}
                className="btn btn-primary" 
                style={{ padding: '0.5rem 1.5rem', fontSize: '0.875rem' }}
              >
                Daftar
              </button>
            </div>
          )}
        </div>
      </div>

      <AuthModals 
        isOpen={authModal.open} 
        type={authModal.type} 
        onClose={() => setAuthModal({ ...authModal, open: false })} 
      />
    </nav>
  );
};

export default Navbar;
