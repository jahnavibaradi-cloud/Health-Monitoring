import React, { useState } from 'react';
import { useHealth } from '../context/HealthContext';
import { PlusCircle, Save, X, Heart, Activity, Droplets, Thermometer } from 'lucide-react';

const InputForm = () => {
  const { addReading } = useHealth();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    heartRate: '',
    bloodPressureSys: '',
    bloodPressureDia: '',
    oxygenSaturation: '',
    bodyTemperature: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addReading({
      heartRate: Number(formData.heartRate),
      bloodPressureSys: Number(formData.bloodPressureSys),
      bloodPressureDia: Number(formData.bloodPressureDia),
      oxygenSaturation: Number(formData.oxygenSaturation),
      bodyTemperature: Number(formData.bodyTemperature),
    });
    setIsOpen(false);
    setFormData({
      heartRate: '',
      bloodPressureSys: '',
      bloodPressureDia: '',
      oxygenSaturation: '',
      bodyTemperature: '',
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 btn-primary px-6 py-4 rounded-2xl shadow-2xl shadow-teal-500/20 hover:shadow-teal-500/30 flex items-center gap-2.5 z-50 group"
      >
        <PlusCircle className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
        <span className="font-bold">Add Vitals</span>
      </button>
    );
  }

  const fields = [
    { name: 'heartRate', label: 'Heart Rate', unit: 'BPM', icon: Heart, min: 30, max: 250, placeholder: '72', color: 'rose' },
    { name: 'oxygenSaturation', label: 'O₂ Saturation', unit: '%', icon: Droplets, min: 50, max: 100, placeholder: '98', color: 'cyan' },
    { name: 'bloodPressureSys', label: 'BP Systolic', unit: 'mmHg', icon: Activity, min: 50, max: 250, placeholder: '120', color: 'blue' },
    { name: 'bloodPressureDia', label: 'BP Diastolic', unit: 'mmHg', icon: Activity, min: 30, max: 150, placeholder: '80', color: 'indigo' },
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
      <div className="glass-card rounded-3xl w-full max-w-lg p-8 m-4 animate-scaleIn glow-teal">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-white font-display">Record Vitals</h2>
            <p className="text-sm text-slate-400 mt-0.5">Enter your current health readings</p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {fields.map((field) => (
              <div key={field.name}>
                <label className="flex items-center gap-1.5 text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">
                  <field.icon className="w-3 h-3" />
                  {field.label}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name={field.name}
                    required
                    min={field.min}
                    max={field.max}
                    value={formData[field.name]}
                    onChange={handleChange}
                    className="input-dark pr-14"
                    placeholder={field.placeholder}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">
                    {field.unit}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">
              <Thermometer className="w-3 h-3" />
              Body Temperature
            </label>
            <div className="relative">
              <input
                type="number"
                name="bodyTemperature"
                required
                step="0.1"
                min="30"
                max="45"
                value={formData.bodyTemperature}
                onChange={handleChange}
                className="input-dark pr-14"
                placeholder="36.6"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">°C</span>
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary w-full py-3.5 mt-4 flex items-center justify-center gap-2 text-base"
          >
            <Save className="w-5 h-5" />
            Save Reading
          </button>
        </form>
      </div>
    </div>
  );
};

export default InputForm;
