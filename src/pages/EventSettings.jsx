import React, { useState } from 'react';
import { useEvents } from '../context/EventContext';
import { useAuth } from '../context/AuthContext';
import { Plus, Edit2, Trash2, Calendar, MapPin, ArrowLeft } from 'lucide-react';

const EventSettings = ({ onBack }) => {
  const { events, addEvent, updateEvent, deleteEvent } = useEvents();
  const { user } = useAuth();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ title: '', category: 'Workshop', date: '', time: '', location: '', image: '', description: '' });

  const canManage = user?.role === 'Admin';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) updateEvent(editingId, formData);
    else addEvent(formData);
    resetForm();
  };

  const resetForm = () => {
    setFormData({ title: '', category: 'Workshop', date: '', time: '', location: '', image: '', description: '' });
    setIsAdding(false);
    setEditingId(null);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', padding: '2.5rem' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        <button onClick={onBack} className="btn" style={{ background: 'transparent', color: 'var(--text-dim)', padding: 0, marginBottom: '2rem' }}>
          <ArrowLeft size={20} /> Kembali ke Web
        </button>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h2 style={{ fontSize: '2rem' }}>Pengaturan <span className="text-gradient">Event</span></h2>
          {canManage && (
            <button onClick={() => setIsAdding(true)} className="btn btn-primary" style={{ padding: '0.6rem 1.2rem' }}>
              <Plus size={18} /> Tambah Event
            </button>
          )}
        </div>

        {(isAdding || editingId) && (
          <div className="glass" style={{ padding: '2rem', borderRadius: '16px', marginBottom: '2rem' }}>
            <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <input type="text" placeholder="Judul Event" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required className="glass" style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', color: 'white' }} />
              <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="glass" style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', color: 'white' }}>
                <option value="Workshop">Workshop</option>
                <option value="Seminar">Seminar</option>
                <option value="Gathering">Gathering</option>
                <option value="Internal">Internal</option>
              </select>
              <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} required className="glass" style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', color: 'white' }} />
              <input type="text" placeholder="Waktu (contoh: 09:00 - 12:00)" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} className="glass" style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', color: 'white' }} />
              <input type="text" placeholder="Lokasi" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="glass" style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', color: 'white' }} />
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <input 
                  type="file" 
                  accept="image/jpeg, image/png, image/jpg" 
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setFormData({...formData, image: reader.result});
                      };
                      reader.readAsDataURL(file);
                    }
                  }} 
                  className="glass" 
                  style={{ padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--glass-border)', color: 'white', fontSize: '0.85rem' }} 
                />
                {formData.image && (
                  <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <img src={formData.image} alt="Preview" style={{ width: '80px', height: '50px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--glass-border)' }} />
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Preview Gambar</span>
                  </div>
                )}
              </div>
              <div style={{ gridColumn: 'span 2', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button type="button" onClick={resetForm} className="btn btn-outline">Batal</button>
                <button type="submit" className="btn btn-primary">{editingId ? 'Simpan Perubahan' : 'Tambah Event'}</button>
              </div>
            </form>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {events.map(event => (
            <div key={event.id} className="glass" style={{ padding: '1.25rem', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                <img src={event.image} style={{ width: '80px', height: '80px', borderRadius: '8px', objectFit: 'cover' }} alt="" />
                <div>
                  <div style={{ fontWeight: '600', fontSize: '1.1rem', marginBottom: '0.5rem' }}>{event.title}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', display: 'flex', gap: '1.25rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Calendar size={14} /> {event.date}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><MapPin size={14} /> {event.location}</span>
                  </div>
                </div>
              </div>
              {canManage && (
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button onClick={() => { setEditingId(event.id); setFormData(event); }} className="glass" style={{ padding: '0.5rem', borderRadius: '8px', border: 'none', color: 'var(--secondary)', cursor: 'pointer' }}>
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => deleteEvent(event.id)} className="glass" style={{ padding: '0.5rem', borderRadius: '8px', border: 'none', color: 'var(--accent)', cursor: 'pointer' }}>
                    <Trash2 size={18} />
                  </button>
                </div>
              )}
            </div>
          ))}
          {events.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-dim)' }}>
              Belum ada event yang didaftarkan.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventSettings;
