import React, { useState } from 'react';
import EventCard from './EventCard';
import EventDetailModal from './EventDetailModal';
import { useEvents } from '../context/EventContext';
import { Filter, ChevronLeft, ChevronRight } from 'lucide-react';

const EventGrid = () => {
  const { events } = useEvents();
  const [activeTab, setActiveTab] = useState('Semua');
  const [selectedEvent, setSelectedEvent] = useState(null);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const categories = ['Semua', ...new Set(events.map(e => e.category))];
  
  const filteredEvents = activeTab === 'Semua' 
    ? events 
    : events.filter(e => e.category === activeTab);

  // Pagination Logic
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredEvents.slice(indexOfFirstItem, indexOfLastItem);

  const handleTabChange = (cat) => {
    setActiveTab(cat);
    setCurrentPage(1); // Reset to first page on filter change
  };

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <section className="container" style={{ paddingBottom: '100px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '2.5rem' }}>Kegiatan <span className="text-gradient">Unggulan</span></h2>
        <div className="glass" style={{ padding: '0.6rem 1.25rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-dim)', fontSize: '0.9rem' }}>
          <Filter size={18} /> Kondisi: {activeTab}
        </div>
      </div>

      <div className="filter-tabs" style={{ marginBottom: '3rem' }}>
        {categories.map(cat => (
          <div 
            key={cat}
            className={`tab ${activeTab === cat ? 'active' : ''}`}
            onClick={() => handleTabChange(cat)}
          >
            {cat}
          </div>
        ))}
      </div>

      <div className="grid">
        {currentItems.length > 0 ? currentItems.map(event => (
          <EventCard 
            key={event.id} 
            event={event} 
            onClick={() => setSelectedEvent(event)}
          />
        )) : (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '5rem', color: 'var(--text-dim)', fontSize: '1.2rem' }}>
            Tidak ada kegiatan di kategori ini.
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="pagination">
          <button 
            onClick={prevPage} 
            disabled={currentPage === 1}
            className={`btn ${currentPage === 1 ? 'btn-outline' : 'btn-primary'}`}
            style={{ padding: '0.5rem 1rem', opacity: currentPage === 1 ? 0.5 : 1 }}
          >
            <ChevronLeft size={20} /> Prev
          </button>
          
          <div className="page-info">
            Halaman <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{currentPage}</span> dari {totalPages}
          </div>

          <button 
            onClick={nextPage} 
            disabled={currentPage === totalPages}
            className={`btn ${currentPage === totalPages ? 'btn-outline' : 'btn-primary'}`}
            style={{ padding: '0.5rem 1rem', opacity: currentPage === totalPages ? 0.5 : 1 }}
          >
            Next <ChevronRight size={20} />
          </button>
        </div>
      )}

      <EventDetailModal 
        isOpen={!!selectedEvent} 
        event={selectedEvent} 
        onClose={() => setSelectedEvent(null)} 
      />
    </section>
  );
};

export default EventGrid;
