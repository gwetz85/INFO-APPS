import React, { useState } from 'react';
import Navbar from './components/Navbar';
import EventGrid from './components/EventGrid';
import EventSettings from './pages/EventSettings';
import ParticipantSettings from './pages/ParticipantSettings';
import { useAuth } from './context/AuthContext';

function App() {
  const [view, setView] = useState('home'); // 'home' or 'settings' or 'participants'
  const { user } = useAuth();

  // If user logs out while in settings, redirect to home
  React.useEffect(() => {
    if ((view === 'settings' || view === 'participants') && !user) {
      setView('home');
    }
  }, [view, user]);

  if (view === 'settings') {
    return <EventSettings onBack={() => setView('home')} />;
  }

  if (view === 'participants') {
    return <ParticipantSettings onBack={() => setView('home')} />;
  }

  return (
    <div className="app">
      <Navbar onOpenSettings={() => setView('settings')} onOpenParticipants={() => setView('participants')} />
      <main style={{ paddingTop: '120px' }}>
        <EventGrid />
      </main>
      
      <footer style={{ padding: '4rem 0', borderTop: '1px solid var(--glass-border)', marginTop: '4rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-dim)', fontSize: '0.875rem' }}>&copy; 2026 EVENTKU. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
