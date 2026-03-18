import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
  });

  function login(email, password) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const found = users.find(u => u.email === email && u.password === password);
    if (!found) throw new Error('Invalid email or password');
    localStorage.setItem('user', JSON.stringify(found));
    setUser(found);
  }

  function signup(name, email, password) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.find(u => u.email === email)) throw new Error('Email already registered');
    const newUser = {
      id: Date.now(), name, email, password,
      avatar: null,
      joinedAt: new Date().toISOString()
    };
    const updated = [...users, newUser];
    localStorage.setItem('users', JSON.stringify(updated));
    // ✅ DO NOT auto-login — just save the user to users list
    // User must manually log in after signup
  }

  function updateAvatar(avatarId) {
    const updated = { ...user, avatar: avatarId };
    const users   = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.map(u => u.id === user.id ? updated : u);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    localStorage.setItem('user', JSON.stringify(updated));
    setUser(updated);
  }

  function logout() {
    localStorage.removeItem('user');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updateAvatar }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);