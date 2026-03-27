import React, { useState } from 'react';
import { useEvents } from '../context/EventContext';
import { useAuth } from '../context/AuthContext';
import { Plus, Trash2, ArrowLeft, Users, Calendar } from 'lucide-react';

const ParticipantSettings = ({ onBack }) => {
  const { events, participants, addParticipant, deleteParticipant, maskPhone } = useEvents();
  const { user } = useAuth();
  
  // Default to first event if exists
  const [formData, setFormData] = useState({ 
    name: '', 
    address: '', 
    phone: '', 
    eventId: events.length > 0 ? events[0].id : '' 
  });
  const [isAdding, setIsAdding] = useState(false);

  const canManage = user?.role === 'Admin' || user?.role === 'Petugas';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.eventId) {
      alert('Pilih event terlebih dahulu');
      return;
    }
    
    addParticipant({
      ...formData,
      eventId: Number(formData.eventId)
    });
    
    // Reset but keep eventId selected
    setFormData({ name: '', address: '', phone: '', eventId: formData.eventId });
    setIsAdding(false);
  };

  const getEventName = (eventId) => {
    const evt = events.find(e => e.id === Number(eventId));
    return evt ? evt.title : 'Event Tidak Diketahui';
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', padding: '2.5rem' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        <button onClick={onBack} className="btn" style={{ background: 'transparent', color: 'var(--text-dim)', padding: 0, marginBottom: '2rem' }}>
          <ArrowLeft size={20} /> Kembali ke Web
        </button>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h2 style={{ fontSize: '2rem' }}>Daftar <span className="text-gradient">Peserta</span></h2>
          {canManage && events.length > 0 && (
            <button onClick={() => setIsAdding(!isAdding)} className="btn btn-primary" style={{ padding: '0.6rem 1.2rem' }}>
              <Plus size={18} /> Tambah Peserta
            </button>
          )}
        </div>

        {events.length === 0 && (
          <div className="glass" style={{ padding: '2rem', textAlign: 'center', borderRadius: '16px', color: 'var(--text-dim)', marginBottom: '2rem' }}>
            <Calendar size={48} style={{ opacity: 0.5, margin: '0 auto 1rem' }} />
            <p>Anda harus menambahkan Event terlebih dahulu di menu Pengaturan sebelum bisa menambah peserta.</p>
          </div>
        )}

        {isAdding && events.length > 0 && (
          <div className="glass" style={{ padding: '2rem', borderRadius: '16px', marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={20} color="var(--primary)" /> Form Pendaftaran
            </h3>
            <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              
              {/* Event Selection */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', gridColumn: 'span 2' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>Pilih Event Tujuan</label>
                <select 
                  value={formData.eventId} 
                  onChange={e => setFormData({...formData, eventId: e.target.value})} 
                  required 
                  className="glass" 
                  style={{ padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--primary)', color: 'white' }}
                >
                  <option value="" disabled>-- Pilih Kegiatan --</option>
                  {events.map(evt => (
                    <option key={evt.id} value={evt.id}>{evt.title} ({evt.date})</option>
                  ))}
                </select>
              </div>

              <input type="text" placeholder="Nama Peserta" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required className="glass" style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', color: 'white' }} />
              <input type="text" placeholder="Nomor HP / WhatsApp" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} required className="glass" style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', color: 'white' }} />
              
              <div style={{ gridColumn: 'span 2' }}>
                <textarea placeholder="Alamat Lengkap" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} required rows="3" className="glass" style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', color: 'white', width: '100%', resize: 'vertical' }}></textarea>
              </div>

              <div style={{ gridColumn: 'span 2', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setIsAdding(false)} className="btn btn-outline">Batal</button>
                <button type="submit" className="btn btn-primary">Daftarkan Peserta</button>
              </div>
            </form>
          </div>
        )}

        <div className="glass" style={{ borderRadius: '16px', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
              <thead style={{ background: 'rgba(0,0,0,0.2)' }}>
                <tr>
                  <th style={{ padding: '1rem', width: '5%' }}>No</th>
                  <th style={{ padding: '1rem', width: '25%' }}>Nama Peserta</th>
                  <th style={{ padding: '1rem', width: '20%' }}>Event Tujuan</th>
                  <th style={{ padding: '1rem', width: '20%' }}>Nomor WA</th>
                  <th style={{ padding: '1rem', width: '25%' }}>Alamat</th>
                  {canManage && <th style={{ padding: '1rem', width: '5%' }}>Aksi</th>}
                </tr>
              </thead>
              <tbody>
                {participants.length > 0 ? (
                  [...participants].reverse().map((p, index) => (
                    <tr key={p.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                      <td style={{ padding: '1rem' }}>{index + 1}</td>
                      <td style={{ padding: '1rem', fontWeight: '500' }}>{p.name}</td>
                      <td style={{ padding: '1rem', color: 'var(--primary)', fontWeight: '600' }}>{getEventName(p.eventId)}</td>
                      <td style={{ padding: '1rem', color: 'var(--text-dim)', fontFamily: 'monospace' }}>{maskPhone(p.phone)}</td>
                      <td style={{ padding: '1rem', color: 'var(--text-dim)' }}>{p.address}</td>
                      {canManage && (
                        <td style={{ padding: '1rem' }}>
                          <button onClick={() => deleteParticipant(p.id)} className="glass" style={{ padding: '0.5rem', borderRadius: '8px', border: 'none', color: 'var(--accent)', cursor: 'pointer' }}>
                            <Trash2 size={16} />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={canManage ? 6 : 5} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-dim)' }}>
                      Belum ada peserta yang mendaftar.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParticipantSettings;
