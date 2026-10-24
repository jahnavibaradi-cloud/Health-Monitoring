import React, { useState } from 'react';
import { useHealth } from '../context/HealthContext';
import { Activity, Heart, Shield, Eye, EyeOff, ArrowRight, Stethoscope } from 'lucide-react';

const Login = () => {
  const { login, register } = useHealth();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('patient');
  const [specialization, setSpecialization] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isRegister) {
        await register(name, email, password, role, specialization);
      } else {
        await login(email, password);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated Background */}
      <div className="bg-scene">
        <div className="bg-grid" />
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      <div className="relative z-10 w-full max-w-md mx-4 animate-fadeIn">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-400 to-cyan-500 shadow-lg shadow-teal-500/20 mb-4">
            <Activity className="w-8 h-8 text-slate-900" />
          </div>
          <h1 className="text-3xl font-bold font-display text-gradient-teal mb-2">
            VitalSense
          </h1>
          <p className="text-slate-400 text-sm">
            Real-time health monitoring platform
          </p>
        </div>

        {/* Card */}
        <div className="glass-card rounded-3xl p-8 glow-teal">
          <h2 className="text-xl font-bold text-white mb-1 font-display">
            {isRegister ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="text-slate-400 text-sm mb-6">
            {isRegister ? 'Start monitoring your health today' : 'Sign in to your dashboard'}
          </p>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2 animate-fadeIn">
              <Shield className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div className="space-y-4 animate-fadeIn">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-dark"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">I am a</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setRole('patient')}
                      className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all ${
                        role === 'patient'
                          ? 'bg-teal-500/15 border border-teal-500/30 text-teal-400 shadow-lg shadow-teal-500/5'
                          : 'border border-white/8 text-slate-400 hover:border-white/15 hover:text-slate-300'
                      }`}
                    >
                      <Heart className="w-4 h-4" />
                      Patient
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('doctor')}
                      className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all ${
                        role === 'doctor'
                          ? 'bg-blue-500/15 border border-blue-500/30 text-blue-400 shadow-lg shadow-blue-500/5'
                          : 'border border-white/8 text-slate-400 hover:border-white/15 hover:text-slate-300'
                      }`}
                    >
                      <Stethoscope className="w-4 h-4" />
                      Doctor
                    </button>
                  </div>
                </div>
                {role === 'doctor' && (
                  <div className="animate-fadeIn">
                    <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Specialization</label>
                    <input
                      type="text"
                      value={specialization}
                      onChange={(e) => setSpecialization(e.target.value)}
                      className="input-dark"
                      placeholder="e.g., Cardiology, Pediatrics"
                    />
                  </div>
                )}
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-dark"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-dark pr-12"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
              ) : (
                <>
                  {isRegister ? 'Create Account' : 'Sign In'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/5 text-center">
            <button
              onClick={() => {
                setIsRegister(!isRegister);
                setError('');
              }}
              className="text-slate-400 hover:text-teal-400 text-sm transition-colors"
            >
              {isRegister ? (
                <>Already have an account? <span className="text-teal-400 font-medium">Sign in</span></>
              ) : (
                <>Don&apos;t have an account? <span className="text-teal-400 font-medium">Create one</span></>
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-xs text-slate-600">
          Secured with end-to-end encryption · HIPAA Compliant
        </div>
      </div>
    </div>
  );
};

export default Login;
