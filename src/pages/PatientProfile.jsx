import React, { useState, useEffect } from 'react';
import { useHealth } from '../context/HealthContext';
import { User, Save, X, Phone, Calendar, Camera, Stethoscope, Check, Scale } from 'lucide-react';

const PatientProfile = ({ isOpen, onClose }) => {
  const { user, updateProfile, fetchDoctors, assignDoctor } = useHealth();
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    weight: '',
    bio: '',
    phone: '',
    profilePicture: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [previewImage, setPreviewImage] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [showDoctorList, setShowDoctorList] = useState(false);
  const [loadingDoctors, setLoadingDoctors] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        age: user.age || '',
        weight: user.weight || '',
        bio: user.bio || '',
        phone: user.phone || '',
        profilePicture: user.profilePicture || '',
      });
      setPreviewImage(user.profilePicture || '');
    }
  }, [user]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setMessage('Image size should be less than 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setFormData({ ...formData, profilePicture: base64String });
        setPreviewImage(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await updateProfile(formData);
      setMessage('Profile updated successfully!');
      setTimeout(() => onClose(), 1500);
    } catch (error) {
      setMessage('Error updating profile: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleShowDoctors = async () => {
    setShowDoctorList(true);
    setLoadingDoctors(true);
    try {
      const data = await fetchDoctors();
      setDoctors(data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setLoadingDoctors(false);
    }
  };

  const handleAssignDoctor = async (doctorId) => {
    try {
      await assignDoctor(doctorId);
      setMessage('Doctor assigned successfully!');
      setShowDoctorList(false);
    } catch (error) {
      setMessage('Error assigning doctor: ' + error.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
      <div className="glass-card rounded-3xl w-full max-w-2xl p-8 m-4 animate-scaleIn glow-teal max-h-[90vh] overflow-y-auto no-scrollbar">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-teal-500/10 rounded-xl border border-teal-500/20">
              <User className="w-5 h-5 text-teal-400" />
            </div>
            <h2 className="text-xl font-bold text-white font-display">Patient Profile</h2>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        {message && (
          <div className={`mb-4 p-3 rounded-xl text-sm ${message.includes('Error') || message.includes('size') ? 'bg-red-500/10 border border-red-500/20 text-red-400' : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'}`}>
            {message}
          </div>
        )}

        {/* Assigned Doctor Section */}
        <div className="mb-6 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
          <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <Stethoscope className="w-4 h-4 text-teal-400" />
            My Doctor
          </h3>

          {user?.assignedDoctor ? (
            <div className="flex items-center justify-between glass-light rounded-xl p-3">
              <div className="flex items-center gap-3">
                {user.assignedDoctor.profilePicture ? (
                  <img src={user.assignedDoctor.profilePicture} alt={user.assignedDoctor.name} className="w-10 h-10 rounded-full object-cover ring-1 ring-white/10" />
                ) : (
                  <div className="w-10 h-10 bg-blue-500/15 rounded-full flex items-center justify-center text-blue-400 text-xs font-bold border border-blue-500/20">Dr</div>
                )}
                <div>
                  <h4 className="font-semibold text-white text-sm">{user.assignedDoctor.name}</h4>
                  <p className="text-xs text-slate-500">{user.assignedDoctor.specialization}</p>
                </div>
              </div>
              <button onClick={handleShowDoctors} className="text-xs text-teal-400 hover:text-teal-300 font-medium px-3 py-1.5 hover:bg-teal-500/10 rounded-lg transition-colors">
                Change
              </button>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-slate-500 text-sm mb-3">No doctor assigned yet</p>
              <button onClick={handleShowDoctors} className="btn-primary text-sm px-4 py-2">
                Choose a Doctor
              </button>
            </div>
          )}

          {showDoctorList && (
            <div className="mt-4 border-t border-white/5 pt-4 animate-fadeIn">
              <h4 className="font-medium text-slate-300 text-sm mb-3">Available Doctors</h4>
              {loadingDoctors ? (
                <div className="text-center py-4">
                  <div className="w-6 h-6 border-2 border-teal-400/30 border-t-teal-400 rounded-full animate-spin mx-auto" />
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto no-scrollbar">
                  {doctors.map(doc => (
                    <div
                      key={doc._id}
                      className="flex items-center gap-3 p-3 glass-light rounded-xl cursor-pointer hover:border-teal-500/30 transition-all"
                      onClick={() => handleAssignDoctor(doc._id)}
                    >
                      {doc.profilePicture ? (
                        <img src={doc.profilePicture} alt={doc.name} className="w-9 h-9 rounded-full object-cover ring-1 ring-white/10" />
                      ) : (
                        <div className="w-9 h-9 bg-blue-500/15 rounded-full flex items-center justify-center text-blue-400 text-xs font-bold border border-blue-500/20">Dr</div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-white text-sm truncate">{doc.name}</p>
                        <p className="text-xs text-slate-500 truncate">{doc.specialization}</p>
                      </div>
                      {user?.assignedDoctor?._id === doc._id && (
                        <Check className="w-4 h-4 text-teal-400 flex-shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
              )}
              <button onClick={() => setShowDoctorList(false)} className="mt-3 text-xs text-slate-500 hover:text-slate-300 w-full text-center transition-colors">
                Cancel
              </button>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Profile Picture */}
          <div className="flex flex-col items-center mb-4">
            <div className="relative">
              <div className="w-28 h-28 rounded-full overflow-hidden bg-gradient-to-br from-teal-500/20 to-cyan-500/20 flex items-center justify-center border-2 border-teal-500/20">
                {previewImage ? (
                  <img src={previewImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-12 h-12 text-teal-400/50" />
                )}
              </div>
              <label className="absolute bottom-0 right-0 bg-gradient-to-r from-teal-500 to-cyan-600 text-white p-2 rounded-full cursor-pointer hover:shadow-lg hover:shadow-teal-500/30 transition-all">
                <Camera className="w-4 h-4" />
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            </div>
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">
              <User className="w-3 h-3" /> Full Name
            </label>
            <input type="text" name="name" required value={formData.name} onChange={handleChange} className="input-dark" placeholder="John Doe" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">
                <Calendar className="w-3 h-3" /> Age
              </label>
              <input type="number" name="age" min="0" max="120" value={formData.age} onChange={handleChange} className="input-dark" placeholder="30" />
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">
                <Scale className="w-3 h-3" /> Weight (kg)
              </label>
              <input type="number" name="weight" min="0" max="300" value={formData.weight} onChange={handleChange} className="input-dark" placeholder="70" />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider block">Bio / Medical Notes</label>
            <textarea name="bio" value={formData.bio} onChange={handleChange} rows="3" className="input-dark resize-none" placeholder="Any medical conditions or notes..." />
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">
              <Phone className="w-3 h-3" /> Phone Number
            </label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="input-dark" placeholder="+1 (555) 123-4567" />
          </div>

          <div className="flex gap-3 pt-4">
            <button type="submit" disabled={loading} className="flex-1 btn-primary py-3 flex items-center justify-center gap-2 disabled:opacity-50">
              {loading ? <div className="w-5 h-5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
              {loading ? 'Saving...' : 'Save Profile'}
            </button>
            <button type="button" onClick={onClose} className="btn-ghost px-6 py-3">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientProfile;
