import React, { useState, useEffect } from 'react';
import { useHealth } from '../context/HealthContext';
import { User, Save, X, Stethoscope, Phone, Award, Calendar, Camera } from 'lucide-react';

const DoctorProfile = ({ isOpen, onClose }) => {
  const { user, updateProfile } = useHealth();
  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    bio: '',
    phone: '',
    licenseNumber: '',
    yearsOfExperience: '',
    profilePicture: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [previewImage, setPreviewImage] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        specialization: user.specialization || '',
        bio: user.bio || '',
        phone: user.phone || '',
        licenseNumber: user.licenseNumber || '',
        yearsOfExperience: user.yearsOfExperience || '',
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
      <div className="glass-card rounded-3xl w-full max-w-2xl p-8 m-4 animate-scaleIn glow-blue max-h-[90vh] overflow-y-auto no-scrollbar">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-500/10 rounded-xl border border-blue-500/20">
              <User className="w-5 h-5 text-blue-400" />
            </div>
            <h2 className="text-xl font-bold text-white font-display">Doctor Profile</h2>
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

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Profile Picture */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative">
              <div className="w-28 h-28 rounded-full overflow-hidden bg-gradient-to-br from-blue-500/20 to-indigo-500/20 flex items-center justify-center border-2 border-blue-500/20">
                {previewImage ? (
                  <img src={previewImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-12 h-12 text-blue-400/50" />
                )}
              </div>
              <label className="absolute bottom-0 right-0 bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-2 rounded-full cursor-pointer hover:shadow-lg hover:shadow-blue-500/30 transition-all">
                <Camera className="w-4 h-4" />
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            </div>
            <p className="text-xs text-slate-500 mt-2">Max 2MB</p>
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">
              <User className="w-3 h-3" /> Full Name
            </label>
            <input type="text" name="name" required value={formData.name} onChange={handleChange} className="input-dark" placeholder="Dr. John Doe" />
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">
              <Stethoscope className="w-3 h-3" /> Specialization
            </label>
            <input type="text" name="specialization" value={formData.specialization} onChange={handleChange} className="input-dark" placeholder="e.g., Cardiology" />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider block">Bio</label>
            <textarea name="bio" value={formData.bio} onChange={handleChange} rows="3" className="input-dark resize-none" placeholder="Brief description about your practice..." />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">
                <Phone className="w-3 h-3" /> Phone
              </label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="input-dark" placeholder="+1 (555) 123-4567" />
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">
                <Award className="w-3 h-3" /> License
              </label>
              <input type="text" name="licenseNumber" value={formData.licenseNumber} onChange={handleChange} className="input-dark" placeholder="MD-123456" />
            </div>
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">
              <Calendar className="w-3 h-3" /> Years of Experience
            </label>
            <input type="number" name="yearsOfExperience" min="0" max="70" value={formData.yearsOfExperience} onChange={handleChange} className="input-dark" placeholder="10" />
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

export default DoctorProfile;
