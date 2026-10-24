import React, { useState } from 'react';
import { Activity, LogOut, UserCircle, Menu, X } from 'lucide-react';
import { useHealth } from '../context/HealthContext';
import DoctorProfile from '../pages/DoctorProfile';
import PatientProfile from '../pages/PatientProfile';

const Layout = ({ children }) => {
  const { user, logout } = useHealth();
  const [showProfile, setShowProfile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen relative">
      {/* Animated Background */}
      <div className="bg-scene">
        <div className="bg-grid" />
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      {/* Header */}
      <header className="relative z-20 glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-teal-400 to-cyan-500 p-2 rounded-xl shadow-lg shadow-teal-500/20">
              <Activity className="w-5 h-5 text-slate-900" />
            </div>
            <h1 className="text-lg font-bold font-display text-gradient-teal hidden sm:block">
              VitalSense
            </h1>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex flex-col items-end mr-2">
              <div className="flex items-center gap-2">
                <span className="text-slate-300 text-sm font-medium">
                  {user?.role === 'doctor' ? 'Dr.' : ''} {user?.name || 'User'}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                  user?.role === 'doctor'
                    ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20'
                    : 'bg-teal-500/15 text-teal-400 border border-teal-500/20'
                }`}>
                  {user?.role || 'patient'}
                </span>
              </div>
              {user?.role === 'doctor' && user?.specialization && (
                <span className="text-xs text-slate-500 mt-0.5">{user.specialization}</span>
              )}
            </div>

            {/* Avatar */}
            {user?.profilePicture ? (
              <img
                src={user.profilePicture}
                alt={user.name}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-white/10"
              />
            ) : (
              <div className="w-9 h-9 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full flex items-center justify-center text-slate-900 text-sm font-bold">
                {getInitials(user?.name)}
              </div>
            )}

            <button
              onClick={() => setShowProfile(true)}
              className="p-2 text-slate-400 hover:text-teal-400 hover:bg-white/5 rounded-xl transition-all"
              title="Edit Profile"
            >
              <UserCircle className="w-5 h-5" />
            </button>

            <div className="w-px h-6 bg-white/10" />

            <button
              onClick={logout}
              className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-white rounded-xl"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden glass border-t border-white/5 p-4 space-y-3 animate-fadeIn">
            <div className="flex items-center gap-3 mb-3">
              {user?.profilePicture ? (
                <img src={user.profilePicture} alt={user.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-white/10" />
              ) : (
                <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full flex items-center justify-center text-slate-900 font-bold">
                  {getInitials(user?.name)}
                </div>
              )}
              <div>
                <p className="text-white font-medium">{user?.name}</p>
                <p className="text-xs text-slate-400 capitalize">{user?.role}</p>
              </div>
            </div>
            <button
              onClick={() => { setShowProfile(true); setMobileMenuOpen(false); }}
              className="w-full text-left px-4 py-2.5 text-slate-300 hover:bg-white/5 rounded-xl flex items-center gap-2 transition-all"
            >
              <UserCircle className="w-4 h-4" /> Edit Profile
            </button>
            <button
              onClick={logout}
              className="w-full text-left px-4 py-2.5 text-red-400 hover:bg-red-500/10 rounded-xl flex items-center gap-2 transition-all"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Profile Modals */}
      {user?.role === 'doctor' && (
        <DoctorProfile isOpen={showProfile} onClose={() => setShowProfile(false)} />
      )}
      {user?.role === 'patient' && (
        <PatientProfile isOpen={showProfile} onClose={() => setShowProfile(false)} />
      )}
    </div>
  );
};

export default Layout;
