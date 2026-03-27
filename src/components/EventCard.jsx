import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, ArrowRight, Timer, Users } from 'lucide-react';
import { useEvents } from '../context/EventContext';

const EventCard = ({ event, onClick }) => {
  const [timeLeft, setTimeLeft] = useState('');
  const { getEventParticipants } = useEvents();
  const participantCount = getEventParticipants(event.id).length;

  useEffect(() => {
    const timer = setInterval(() => {
      const timeString = (event.time.split(' - ')[0] || '00:00').replace(/\./g, ':');
      let eventDate = new Date(`${event.date}T${timeString}`);
      
      // Fallback if Date is still invalid (e.g., Safari might have issues with some formats)
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
        setTimeLeft('Started');
        clearInterval(timer);
      } else {
        const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const m = Math.floor((diff / 1000 / 60) % 60);
        const s = Math.floor((diff / 1000) % 60);
        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        setTimeLeft(`${d > 0 ? d + 'd ' : ''}${h}h ${m}m ${s}s`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [event.date, event.time]);

  return (
    <motion.div 
      whileHover={{ y: -8 }}
      className="event-card glass"
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
      <div className="card-image">
        <img src={event.image} alt={event.title} />
        <div className="category-tag" style={{ position: 'absolute', top: '12px', left: '12px', background: 'rgba(2, 6, 23, 0.6)', backdropFilter: 'blur(8px)', padding: '4px 12px', borderRadius: '99px', border: '1px solid var(--glass-border)', zIndex: 10 }}>
          {event.category}
        </div>
      </div>
      <div className="card-content">
        <div className="card-grid">
          {/* Left Column: Data Kegiatan */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <h3 style={{ fontSize: '1.4rem', lineHeight: 1.2, marginBottom: '0.25rem' }}>{event.title}</h3>
            
            <div className="event-info">
              <Calendar size={16} color="var(--primary)" />
              <span>{event.date}</span>
            </div>
            <div className="event-info">
              <Clock size={16} color="var(--primary)" />
              <span>{event.time}</span>
            </div>
            <div className="event-info">
              <MapPin size={16} color="var(--primary)" />
              <span>{event.location}</span>
            </div>
            <div className="event-info">
              <Users size={16} color="var(--primary)" />
              <span>{participantCount} Peserta Terdaftar</span>
            </div>
          </div>

          {/* Right Column: Countdown */}
          <div className="countdown-col">
            <div className="countdown-box-premium">
              <div className="label">Starts In</div>
              <Timer size={20} color="var(--primary)" />
              <div className="time">{timeLeft}</div>
            </div>
          </div>
        </div>

        <button className="btn btn-primary" style={{ marginTop: '1.5rem', width: '100%', justifyContent: 'center' }}>
          Lihat Detail <ArrowRight size={18} />
        </button>
      </div>
    </motion.div>
  );
};

export default EventCard;
