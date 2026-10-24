import React, { useState, useEffect } from 'react';
import { useHealth } from '../context/HealthContext';
import { Heart, Activity, Thermometer, Droplets, User, AlertTriangle, ChevronLeft, Clock, Users, Zap } from 'lucide-react';
import clsx from 'clsx';

const DoctorDashboard = () => {
  const { user } = useHealth();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientHistory, setPatientHistory] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchAllPatients();
  }, []);

  const fetchAllPatients = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/doctor/patients', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setPatients(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching patients:', error);
      setLoading(false);
    }
  };

  const fetchPatientHistory = async (patientId) => {
    try {
      const res = await fetch(`http://localhost:5001/api/doctor/patient/${patientId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setPatientHistory(data);
      setSelectedPatient(patientId);
    } catch (error) {
      console.error('Error fetching patient history:', error);
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

  const getStatusColor = (status) => {
    if (status === 'critical') return 'text-red-400';
    if (status === 'warning') return 'text-amber-400';
    return 'text-slate-200';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="glass-card rounded-3xl p-12 text-center">
          <div className="w-12 h-12 border-2 border-teal-400/30 border-t-teal-400 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading patients...</p>
        </div>
      </div>
    );
  }

  // Patient Detail View
  if (selectedPatient && patientHistory) {
    return (
      <div className="space-y-6 animate-fadeIn">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-teal-400/20 to-cyan-400/20 rounded-xl flex items-center justify-center border border-teal-500/20">
              <User className="w-6 h-6 text-teal-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white font-display">
                {patientHistory.patient.name}
              </h2>
              <p className="text-sm text-slate-400">{patientHistory.patient.email}</p>
            </div>
          </div>
          <button
            onClick={() => {
              setSelectedPatient(null);
              setPatientHistory(null);
            }}
            className="btn-ghost flex items-center gap-2 text-sm"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to All Patients
          </button>
        </div>

        {/* Stats Bar */}
        <div className="glass-card rounded-2xl p-4 flex items-center gap-6 flex-wrap">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-slate-500" />
            <span className="text-slate-400">Total Readings:</span>
            <span className="text-white font-bold">{patientHistory.readings.length}</span>
          </div>
        </div>

        {/* Health History */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
            <Zap className="w-5 h-5 text-teal-400" />
            Health History
          </h3>
          {patientHistory.readings.map((reading, idx) => (
            <div key={idx} className="glass-card rounded-xl p-4 animate-fadeInUp" style={{ animationDelay: `${idx * 50}ms` }}>
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs text-slate-500 flex items-center gap-1.5">
                  <Clock className="w-3 h-3" />
                  {new Date(reading.timestamp).toLocaleString()}
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-slate-500 mb-1 flex items-center gap-1"><Heart className="w-3 h-3" /> Heart Rate</p>
                  <p className={clsx("text-lg font-bold font-display", getStatusColor(getStatus('heartRate', reading.heartRate)))}>
                    {reading.heartRate} <span className="text-xs text-slate-500 font-normal">bpm</span>
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1 flex items-center gap-1"><Activity className="w-3 h-3" /> Blood Pressure</p>
                  <p className={clsx("text-lg font-bold font-display", getStatusColor(getStatus('bloodPressureSys', reading.bloodPressureSys)))}>
                    {reading.bloodPressureSys}/{reading.bloodPressureDia} <span className="text-xs text-slate-500 font-normal">mmHg</span>
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1 flex items-center gap-1"><Droplets className="w-3 h-3" /> O₂ Saturation</p>
                  <p className={clsx("text-lg font-bold font-display", getStatusColor(getStatus('oxygenSaturation', reading.oxygenSaturation)))}>
                    {reading.oxygenSaturation}<span className="text-xs text-slate-500 font-normal">%</span>
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1 flex items-center gap-1"><Thermometer className="w-3 h-3" /> Temperature</p>
                  <p className={clsx("text-lg font-bold font-display", getStatusColor(getStatus('bodyTemperature', reading.bodyTemperature)))}>
                    {reading.bodyTemperature}<span className="text-xs text-slate-500 font-normal">°C</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Patient List View
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white font-display">My Patients</h2>
          <p className="text-sm text-slate-400 mt-1">{patients.length} patients assigned</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20">
          <Users className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-blue-400 text-xs font-medium">{patients.length} Active</span>
        </div>
      </div>

      {patients.length === 0 ? (
        <div className="glass-card rounded-3xl p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-blue-500/10 flex items-center justify-center">
            <Users className="w-8 h-8 text-blue-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2 font-display">No Patients Yet</h3>
          <p className="text-slate-400 text-sm">Patients will appear here once they assign you as their doctor.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 stagger">
          {patients.map((patient) => {
            const vitals = patient.latestVitals;
            const hasWarning = vitals && (
              getStatus('heartRate', vitals.heartRate) !== 'normal' ||
              getStatus('oxygenSaturation', vitals.oxygenSaturation) !== 'normal' ||
              getStatus('bodyTemperature', vitals.bodyTemperature) !== 'normal' ||
              getStatus('bloodPressureSys', vitals.bloodPressureSys) !== 'normal'
            );

            return (
              <div
                key={patient._id}
                onClick={() => fetchPatientHistory(patient._id)}
                className={clsx(
                  "glass-card rounded-2xl p-5 cursor-pointer animate-fadeInUp group",
                  hasWarning ? 'border-amber-500/20 glow-amber' : ''
                )}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 bg-gradient-to-br from-teal-400/20 to-cyan-400/20 rounded-xl flex items-center justify-center border border-teal-500/15 group-hover:border-teal-500/30 transition-colors">
                    <User className="w-5 h-5 text-teal-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-white truncate">{patient.name}</h3>
                    <p className="text-xs text-slate-500 truncate">{patient.email}</p>
                  </div>
                  {hasWarning && (
                    <span className="status-dot status-warning flex-shrink-0" />
                  )}
                </div>

                {vitals ? (
                  <div className="space-y-2">
                    {[
                      { label: 'Heart Rate', value: `${vitals.heartRate} bpm`, status: getStatus('heartRate', vitals.heartRate) },
                      { label: 'BP', value: `${vitals.bloodPressureSys}/${vitals.bloodPressureDia}`, status: getStatus('bloodPressureSys', vitals.bloodPressureSys) },
                      { label: 'O₂', value: `${vitals.oxygenSaturation}%`, status: getStatus('oxygenSaturation', vitals.oxygenSaturation) },
                      { label: 'Temp', value: `${vitals.bodyTemperature}°C`, status: getStatus('bodyTemperature', vitals.bodyTemperature) },
                    ].map((item, i) => (
                      <div key={i} className="flex justify-between items-center text-sm">
                        <span className="text-slate-500">{item.label}</span>
                        <span className={clsx("font-semibold", getStatusColor(item.status))}>
                          {item.value}
                        </span>
                      </div>
                    ))}
                    {hasWarning && (
                      <div className="mt-3 pt-3 border-t border-white/5 flex items-center gap-2 text-amber-400 text-xs font-semibold">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Abnormal readings detected
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-slate-600 italic">No vitals recorded yet</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;
