import React, { createContext, useContext, useState, useEffect } from 'react';
import io from 'socket.io-client';

const HealthContext = createContext();

export const useHealth = () => useContext(HealthContext);

const socket = io('http://localhost:5001'); // Connect to backend

export const HealthProvider = ({ children }) => {
  const [readings, setReadings] = useState([]);
  const [currentVitals, setCurrentVitals] = useState(null);
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Load User from token (fallback if user not in localStorage)
  useEffect(() => {
    if (token && !user) {
      const userId = JSON.parse(atob(token.split('.')[1])).id;
      setUser({ id: userId });
    }
  }, [token, user]);

  // Fetch initial history
  useEffect(() => {
    if (token) {
      fetch('http://localhost:5001/api/health', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          setReadings(data.reverse()); // Show oldest first in charts
          if (data.length > 0) setCurrentVitals(data[data.length - 1]);
        })
        .catch(err => console.error(err));
    }
  }, [token]);

  // Real-time updates
  useEffect(() => {
    socket.on('healthUpdate', (newReading) => {
      // Only update if it belongs to current user (simplified check)
      if (user && newReading.user === user.id) {
        setReadings(prev => [...prev, newReading]);
        setCurrentVitals(newReading);
      }
    });

    return () => socket.off('healthUpdate');
  }, [user]);

  const login = async (email, password) => {
    const res = await fetch('http://localhost:5001/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (res.ok) {
      setToken(data.token);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      setUser(data);
    } else {
      throw new Error(data.message);
    }
  };

  const register = async (name, email, password, role = 'patient', specialization = '') => {
    const res = await fetch('http://localhost:5001/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role, specialization }),
    });
    const data = await res.json();
    if (res.ok) {
      setToken(data.token);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      setUser(data);
    } else {
      throw new Error(data.message);
    }
  };

  const addReading = async (newReading) => {
    if (!token) return;
    try {
      const res = await fetch('http://localhost:5001/api/health', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newReading),
      });
      if (!res.ok) throw new Error('Failed to add reading');
      // Socket will handle the update
    } catch (err) {
      console.error(err);
    }
  };

  const getStatus = (type, value) => {
    switch (type) {
      case 'heartRate':
        if (value < 60 || value > 100) return 'warning';
        if (value < 50 || value > 120) return 'critical';
        return 'normal';
      case 'oxygenSaturation':
        if (value < 95) return 'warning';
        if (value < 90) return 'critical';
        return 'normal';
      case 'bodyTemperature':
        if (value < 36 || value > 37.5) return 'warning';
        if (value < 35 || value > 39) return 'critical';
        return 'normal';
      case 'bloodPressureSys':
        if (value > 120 && value < 140) return 'warning';
        if (value >= 140) return 'critical';
        return 'normal';
      default:
        return 'normal';
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setReadings([]);
    setCurrentVitals(null);
  };

  const updateProfile = async (profileData) => {
    try {
      const res = await fetch('http://localhost:5001/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData),
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data);
        localStorage.setItem('user', JSON.stringify(data));
        return data;
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  };

  const fetchDoctors = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/patient/doctors', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) return data;
      throw new Error(data.message);
    } catch (error) {
      console.error('Fetch doctors error:', error);
      throw error;
    }
  };

  const assignDoctor = async (doctorId) => {
    try {
      const res = await fetch('http://localhost:5001/api/patient/assign-doctor', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ doctorId }),
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data);
        localStorage.setItem('user', JSON.stringify(data));
        return data;
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Assign doctor error:', error);
      throw error;
    }
  };

  return (
    <HealthContext.Provider value={{
      readings,
      currentVitals,
      addReading,
      getStatus,
      user,
      login,
      register,
      logout,
      updateProfile,
      fetchDoctors,
      assignDoctor
    }}>
      {children}
    </HealthContext.Provider>
  );
};
