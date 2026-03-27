import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const EventContext = createContext();
const DB_URL = "https://eventku-93bf1-default-rtdb.asia-southeast1.firebasedatabase.app";

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [archiveEvents, setArchiveEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Realtime Database Listener (SSE)
  useEffect(() => {
    let source;
    try {
      source = new EventSource(`${DB_URL}/.json`);

      source.addEventListener("put", (e) => {
        try {
          const payload = JSON.parse(e.data);
          
          if (payload.path === "/") {
            const dbData = payload.data;
            if (dbData === null) {
              setEvents([]);
              setParticipants([]);
              setArchiveEvents([]);
            } else {
              setEvents(dbData.events ? Object.values(dbData.events) : []);
              setParticipants(dbData.participants ? Object.values(dbData.participants) : []);
              setArchiveEvents(dbData.archiveEvents ? Object.values(dbData.archiveEvents) : []);
            }
            setLoading(false);
          } else {
            // Partial update from another client or our own syncToFirebase
            // Re-fetch everything simply to guarantee state consistency
            fetch(`${DB_URL}/.json`)
              .then(res => res.json())
              .then(dbData => {
                 if (dbData === null) {
                    setEvents([]); setParticipants([]); setArchiveEvents([]);
                 } else {
                    setEvents(dbData.events ? Object.values(dbData.events) : []);
                    setParticipants(dbData.participants ? Object.values(dbData.participants) : []);
                    setArchiveEvents(dbData.archiveEvents ? Object.values(dbData.archiveEvents) : []);
                 }
              })
              .finally(() => setLoading(false));
          }
        } catch (err) {
          console.error("Error parsing realtime data", err);
        }
      });
    } catch (error) {
      console.error("SSE Error:", error);
    }
    
    return () => {
      if (source) source.close();
    };
  }, []);

  // Utility to push data to Firebase
  const syncToFirebase = async (node, data) => {
    try {
      await fetch(`${DB_URL}/${node}.json`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } catch (err) {
      console.error(`Firebase Sync Error on ${node}:`, err);
    }
  };

  // Automated Archiving Logic
  useEffect(() => {
    if (loading) return;

    const checkAndArchive = () => {
      const now = new Date();
      const toArchive = [];
      const stillActive = [];
      let needsSync = false;

      events.forEach(event => {
        // Assume time is "HH:mm - HH:mm" or just "HH:mm"
        const startTime = event.time.split(' - ')[0] || '00:00';
        const eventDate = new Date(`${event.date}T${startTime}`);
        
        if (eventDate < now) {
          toArchive.push(event);
          needsSync = true;
        } else {
          stillActive.push(event);
        }
      });

      if (needsSync) {
        setEvents(stillActive);
        setArchiveEvents(prev => {
          const updatedArchive = [...prev, ...toArchive];
          syncToFirebase("archiveEvents", updatedArchive);
          return updatedArchive;
        });
        syncToFirebase("events", stillActive);
      }
    };

    checkAndArchive();
    const interval = setInterval(checkAndArchive, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [events, loading]);

  const addEvent = useCallback((event) => {
    const newEvent = { ...event, id: Date.now() };
    setEvents(prev => {
      const newData = [...prev, newEvent];
      syncToFirebase("events", newData);
      return newData;
    });
  }, []);

  const updateEvent = useCallback((id, updatedEvent) => {
    setEvents(prev => {
      const newData = prev.map(e => e.id === id ? { ...e, ...updatedEvent } : e);
      syncToFirebase("events", newData);
      return newData;
    });
  }, []);

  const deleteEvent = useCallback((id) => {
    setEvents(prev => {
      const newData = prev.filter(e => e.id !== id);
      syncToFirebase("events", newData);
      return newData;
    });
    setArchiveEvents(prev => {
      const newData = prev.filter(e => e.id !== id);
      syncToFirebase("archiveEvents", newData);
      return newData;
    });
    setParticipants(prev => {
      const newData = prev.filter(p => p.eventId !== id);
      syncToFirebase("participants", newData);
      return newData;
    });
  }, []);

  const addParticipant = useCallback((participant) => {
    const newPart = { ...participant, id: Date.now() };
    setParticipants(prev => {
      const newData = [...prev, newPart];
      syncToFirebase("participants", newData);
      return newData;
    });
  }, []);

  const deleteParticipant = useCallback((id) => {
    setParticipants(prev => {
      const newData = prev.filter(p => p.id !== id);
      syncToFirebase("participants", newData);
      return newData;
    });
  }, []);

  const getEventParticipants = useCallback((eventId) => {
    return participants.filter(p => p.eventId === eventId);
  }, [participants]);

  const clearAllData = useCallback(() => {
    setEvents([]);
    setParticipants([]);
    setArchiveEvents([]);
    // Remove all node data natively across Firebase
    fetch(`${DB_URL}/.json`, { method: "DELETE" });
  }, []);

  const maskPhone = useCallback((phone) => {
    if (!phone) return '';
    if (phone.length <= 4) return '****';
    return phone.slice(0, -4) + '****';
  }, []);

  return (
    <EventContext.Provider value={{ 
      events, addEvent, updateEvent, deleteEvent, 
      participants, addParticipant, deleteParticipant, getEventParticipants,
      archiveEvents, clearAllData,
      maskPhone,
      loading
    }}>
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = () => useContext(EventContext);
