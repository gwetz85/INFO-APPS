import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, MapPin, Users, Timer } from 'lucide-react';
import { useEvents } from '../context/EventContext';

const EventDetailModal = ({ isOpen, event, onClose }) => {
  const { getEventParticipants, maskPhone } = useEvents();
  const [participants, setParticipants] = useState([]);
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    if (event) {
      setParticipants(getEventParticipants(event.id));
      
      const timer = setInterval(() => {
        const timeString = (event.time.split(' - ')[0] || '00:00').replace(/\./g, ':');
        let eventDate = new Date(`${event.date}T${timeString}`);
        
        // Fallback for invalid date
        if (isNaN(eventDate.getTime())) {
          const [hours, minutes] = timeString.split(':');
          eventDate = new Date(event.date);
          eventDate.setHours(parseInt(hours || 0, 10));
          eventDate.setMinutes(parseInt(minutes || 0, 10));
          eventDate.setSeconds(0);
        }

        const now = new Date();
        const diff = eventDate - now;

        if (diff <= 0) {
          setTimeLeft('Sedang Berlangsung / Selesai');
          clearInterval(timer);
        } else {
          const d = Math.floor(diff / (1000 * 60 * 60 * 24));
          const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
          const m = Math.floor((diff / 1000 / 60) % 60);
          const s = Math.floor((diff / 1000) % 60);
          setTimeLeft(`${d > 0 ? d + 'd ' : ''}${h}h ${m}m ${s}s`);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [event, getEventParticipants]);

  if (!isOpen || !event) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(2, 6, 23, 0.8)', backdropFilter: 'blur(8px)', padding: '1rem' }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="glass"
        style={{ width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', padding: '2.5rem', borderRadius: '24px', position: 'relative' }}
      >
        <button onClick={onClose} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}>
          <X size={24} />
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.5fr)', gap: '2.5rem' }}>
          {/* Left: Event Info */}
          <div>
            <div style={{ position: 'relative', height: '200px', borderRadius: '16px', overflow: 'hidden', marginBottom: '1.5rem' }}>
              <img src={event.image} alt={event.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', top: '1rem', left: '1rem', background: 'rgba(2, 6, 23, 0.6)', backdropFilter: 'blur(4px)', padding: '0.25rem 0.75rem', borderRadius: '99px', fontSize: '0.75rem', border: '1px solid var(--glass-border)' }}>
                {event.category}
              </div>
            </div>

            <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem', lineHeight: 1.2 }}>{event.title}</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-dim)' }}>
                <div style={{ background: 'rgba(45, 212, 191, 0.1)', padding: '0.4rem', borderRadius: '8px' }}>
                  <Calendar size={16} color="var(--primary)" />
                </div>
                <span style={{ fontSize: '0.9rem' }}>{event.date}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-dim)' }}>
                <div style={{ background: 'rgba(45, 212, 191, 0.1)', padding: '0.4rem', borderRadius: '8px' }}>
                  <Clock size={16} color="var(--primary)" />
                </div>
                <span style={{ fontSize: '0.9rem' }}>{event.time}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-dim)' }}>
                <div style={{ background: 'rgba(45, 212, 191, 0.1)', padding: '0.4rem', borderRadius: '8px' }}>
                  <MapPin size={16} color="var(--primary)" />
                </div>
                <span style={{ fontSize: '0.9rem' }}>{event.location}</span>
              </div>
            </div>

            <div className="glass" style={{ padding: '1rem', borderRadius: '16px', background: 'rgba(45, 212, 191, 0.05)', border: '1px solid rgba(45, 212, 191, 0.2)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: '600', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Timer size={14} /> COUNTDOWN
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 'bold', fontFamily: 'monospace' }}>{timeLeft}</div>
            </div>
          </div>

          {/* Right: Participants List */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Users size={20} color="var(--primary)" /> Peserta Terdaftar
            </h3>
            
            <div className="glass" style={{ borderRadius: '16px', overflow: 'hidden', flexGrow: 1 }}>
              <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                  <thead style={{ position: 'sticky', top: 0, background: 'var(--bg-surface)', zIndex: 1 }}>
                    <tr style={{ background: 'rgba(255,255,255,0.05)' }}>
                      <th style={{ padding: '0.75rem 1rem', width: '40px' }}>No</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Nama</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Alamat</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Nomor HP</th>
                    </tr>
                  </thead>
                  <tbody>
                    {participants.length > 0 ? participants.map((p, index) => (
                      <tr key={index} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                        <td style={{ padding: '0.75rem 1rem' }}>{index + 1}</td>
                        <td style={{ padding: '0.75rem 1rem', fontWeight: '500' }}>{p.name}</td>
                        <td style={{ padding: '0.75rem 1rem', color: 'var(--text-dim)' }}>{p.address}</td>
                        <td style={{ padding: '0.75rem 1rem', color: 'var(--text-dim)', fontFamily: 'monospace' }}>{maskPhone(p.phone)}</td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-dim)' }}>Belum ada peserta terdaftar.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default EventDetailModal;
