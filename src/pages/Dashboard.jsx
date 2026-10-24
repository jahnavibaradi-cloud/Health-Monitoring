import React from 'react';
import { useHealth } from '../context/HealthContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Heart, Activity, Thermometer, Droplets, AlertTriangle, TrendingUp, Zap, Clock } from 'lucide-react';
import clsx from 'clsx';

const Dashboard = () => {
  const { currentVitals, readings, getStatus, user } = useHealth();

  if (!currentVitals) return (
    <div className="flex flex-col items-center justify-center py-20 animate-fadeIn">
      <div className="glass-card rounded-3xl p-12 text-center max-w-md">
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-teal-400/20 to-cyan-400/20 flex items-center justify-center">
          <Activity className="w-8 h-8 text-teal-400 animate-pulse" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2 font-display">No Vitals Recorded Yet</h3>
        <p className="text-slate-400 text-sm">
          Click the <span className="text-teal-400 font-medium">"Add Vitals"</span> button to record your first health reading.
        </p>
      </div>
    </div>
  );

  const cards = [
    {
      title: 'Heart Rate',
      value: currentVitals.heartRate,
      unit: 'bpm',
      icon: Heart,
      color: 'rose',
      gradient: 'from-rose-500 to-pink-600',
      glowClass: 'glow-rose',
      bgAccent: 'bg-rose-500/10',
      textAccent: 'text-rose-400',
      borderAccent: 'border-rose-500/20',
      status: getStatus('heartRate', currentVitals.heartRate),
      normalRange: '60-100',
    },
    {
      title: 'Blood Pressure',
      value: `${currentVitals.bloodPressureSys}/${currentVitals.bloodPressureDia}`,
      unit: 'mmHg',
      icon: Activity,
      color: 'blue',
      gradient: 'from-blue-500 to-indigo-600',
      glowClass: 'glow-blue',
      bgAccent: 'bg-blue-500/10',
      textAccent: 'text-blue-400',
      borderAccent: 'border-blue-500/20',
      status: getStatus('bloodPressureSys', currentVitals.bloodPressureSys),
      normalRange: '<120/80',
    },
    {
      title: 'O₂ Saturation',
      value: currentVitals.oxygenSaturation,
      unit: '%',
      icon: Droplets,
      color: 'cyan',
      gradient: 'from-cyan-500 to-blue-600',
      glowClass: 'glow-blue',
      bgAccent: 'bg-cyan-500/10',
      textAccent: 'text-cyan-400',
      borderAccent: 'border-cyan-500/20',
      status: getStatus('oxygenSaturation', currentVitals.oxygenSaturation),
      normalRange: '95-100',
    },
    {
      title: 'Temperature',
      value: currentVitals.bodyTemperature,
      unit: '°C',
      icon: Thermometer,
      color: 'amber',
      gradient: 'from-amber-500 to-orange-600',
      glowClass: 'glow-amber',
      bgAccent: 'bg-amber-500/10',
      textAccent: 'text-amber-400',
      borderAccent: 'border-amber-500/20',
      status: getStatus('bodyTemperature', currentVitals.bodyTemperature),
      normalRange: '36.1-37.2',
    },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass rounded-xl p-3 shadow-2xl border border-white/10">
          <p className="text-xs text-slate-400 mb-1">
            {new Date(label).toLocaleString()}
          </p>
          {payload.map((p, i) => (
            <p key={i} className="text-sm font-semibold" style={{ color: p.stroke }}>
              {p.name || p.dataKey}: {p.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white font-display">
            Health Dashboard
          </h2>
          <p className="text-slate-400 text-sm mt-1 flex items-center gap-2">
            <Clock className="w-3.5 h-3.5" />
            Last updated: {new Date(currentVitals.timestamp).toLocaleString()}
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <span className="status-dot status-normal" />
          <span className="text-emerald-400 text-xs font-medium">Live Monitoring</span>
        </div>
      </div>

      {/* Vitals Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 stagger">
        {cards.map((card, idx) => (
          <div
            key={idx}
            className={clsx(
              "glass-card rounded-2xl p-5 animate-fadeInUp",
              card.status === 'critical' ? 'border-red-500/30 glow-rose' :
                card.status === 'warning' ? 'border-amber-500/30 glow-amber' :
                  card.glowClass
            )}
          >
            <div className="flex justify-between items-start mb-4">
              <div className={clsx("p-2.5 rounded-xl", card.bgAccent)}>
                <card.icon className={clsx("w-5 h-5", card.textAccent)} />
              </div>
              {card.status !== 'normal' ? (
                <div className={clsx(
                  "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
                  card.status === 'critical'
                    ? 'bg-red-500/15 text-red-400 border border-red-500/20'
                    : 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
                )}>
                  <AlertTriangle className="w-3 h-3" />
                  {card.status}
                </div>
              ) : (
                <span className="status-dot status-normal mt-2" />
              )}
            </div>

            <div className="space-y-1">
              <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">{card.title}</p>
              <div className="flex items-baseline gap-1.5">
                <span className={clsx("text-3xl font-bold font-display", card.textAccent)}>
                  {card.value}
                </span>
                <span className="text-slate-500 text-sm">{card.unit}</span>
              </div>
              <p className="text-slate-600 text-xs">Normal: {card.normalRange}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Heart Rate Chart */}
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-rose-500/10 rounded-lg">
              <TrendingUp className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-display">Heart Rate Trend</h3>
              <p className="text-xs text-slate-500">Last {readings.length} readings</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={readings}>
                <defs>
                  <linearGradient id="colorHr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.04)" />
                <XAxis
                  dataKey="timestamp"
                  tickFormatter={(t) => new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  stroke="#475569"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis stroke="#475569" fontSize={11} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="heartRate" stroke="#f43f5e" strokeWidth={2.5} fillOpacity={1} fill="url(#colorHr)" name="Heart Rate" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Blood Pressure Chart */}
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Activity className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-display">Blood Pressure</h3>
              <p className="text-xs text-slate-500">Systolic & Diastolic</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={readings}>
                <defs>
                  <linearGradient id="colorBpSys" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.04)" />
                <XAxis
                  dataKey="timestamp"
                  tickFormatter={(t) => new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  stroke="#475569"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis stroke="#475569" fontSize={11} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="bloodPressureSys" stroke="#3b82f6" strokeWidth={2.5} dot={{ fill: '#3b82f6', r: 3, strokeWidth: 0 }} name="Systolic" />
                <Line type="monotone" dataKey="bloodPressureDia" stroke="#8b5cf6" strokeWidth={2.5} strokeDasharray="5 5" dot={{ fill: '#8b5cf6', r: 3, strokeWidth: 0 }} name="Diastolic" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-blue-500 rounded" />
              Systolic
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-purple-500 rounded" style={{ borderBottom: '2px dashed #8b5cf6', height: 0 }} />
              Diastolic
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
