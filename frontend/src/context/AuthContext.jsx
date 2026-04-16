import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('mf_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (data) => {
    // data = { token, role, name, email, ... } from backend
    localStorage.setItem('mf_token', data.token);       // ✅ matches axios.js
    localStorage.setItem('mf_user', JSON.stringify(data));
    setUser(data);
  };

  const logout = () => {
    localStorage.removeItem('mf_token');
    localStorage.removeItem('mf_user');
    setUser(null);
  };

  const isAuth = !!user;
  const role = user?.role || null;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuth, role }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);