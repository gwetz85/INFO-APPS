import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState(() => {
    const savedUsers = localStorage.getItem('eventku_users');
    return savedUsers ? JSON.parse(savedUsers) : [
      { id: 1, username: 'admin', password: 'admin123', role: 'Admin' },
      { id: 2, username: 'petugas1', password: '123', role: 'Petugas' }
    ];
  });

  useEffect(() => {
    localStorage.setItem('eventku_users', JSON.stringify(users));
  }, [users]);

  const login = (username, password) => {
    const foundUser = users.find(u => u.username === username && u.password === password);
    if (foundUser) {
      setUser(foundUser);
      return { success: true };
    }
    return { success: false, message: 'Username atau kata sandi salah' };
  };

  const register = (username, password) => {
    if (users.find(u => u.username === username)) {
      return { success: false, message: 'Username sudah digunakan' };
    }
    const newUser = { id: Date.now(), username, password, role: 'Petugas' };
    setUsers([...users, newUser]);
    return { success: true };
  };

  const logout = () => setUser(null);

  const updateUserRole = (userId, newRole) => {
    setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
  };

  return (
    <AuthContext.Provider value={{ user, users, login, register, logout, updateUserRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
