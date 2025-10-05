import React, { useState, useEffect } from 'react';
import AppSidebar from '../../components/AppSidebar';
import { Settings as SettingsIcon, User, Calendar, Upload, CheckCircle, XCircle } from 'lucide-react';
import { doctorsAPI } from '../../api/api';

const initialProfile = {
  name: '',
  contact: '',
  specialization: '',
  profilePic: null,
  availability: '',
  leaveDays: '',
};

const Settings = ({ user, setCurrentView, setUser, currentView, isSidebarOpen, setIsSidebarOpen, setUser: setGlobalUser }) => {
  const [profile, setProfile] = useState(initialProfile);
  const [success, setSuccess] = useState(false);
  const [picPreview, setPicPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load current user data
  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || '',
        contact: user.phone || '',
        specialization: user.occupation || '',
        profilePic: null,
        availability: user.availability || '',
        leaveDays: user.leaveDays ? user.leaveDays.join(', ') : '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profilePic' && files && files[0]) {
      setProfile({ ...profile, profilePic: files[0] });
      setPicPreview(URL.createObjectURL(files[0]));
    } else {
      setProfile({ ...profile, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const settingsData = {
      name: profile.name,
      phone: profile.contact,
      specialization: profile.specialization,  // ✅ correct field name
      availability: profile.availability,
      leaveDays: profile.leaveDays ? profile.leaveDays.split(',').map(day => day.trim()) : [],

      // Doctor-specific required fields (add input fields for these in your form too)
      experience: profile.experience || 0,
      consultation_fee: profile.consultation_fee || 0,
      available_days: profile.available_days || [],
      available_times: profile.available_times || [],
      bio: profile.bio || "",
    };

    const response = await doctorsAPI.updateSettings(settingsData);

    setGlobalUser(response.data);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);

    console.log("Submitting settingsData:", settingsData)
    
  } catch (error) {
    console.error('Error updating settings:', error.response?.data || error.message);
    alert(error.response?.data?.error || 'Failed to update settings. Please try again.');
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="flex h-screen bg-gray-50">
      <AppSidebar
        user={user}
        setCurrentView={setCurrentView}
        setUser={setUser}
        currentView={currentView}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <main className="flex-1 ml-0 p-6 overflow-auto">
        <div className="flex items-center mb-6">
          <SettingsIcon className="w-8 h-8 text-blue-600 mr-3" />
          <h1 className="text-2xl font-bold text-gray-800">Profile & Schedule Settings</h1>
        </div>
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 max-w-2xl mx-auto space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-2 flex items-center gap-2"><User className="w-5 h-5" /> Edit Profile</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input type="text" name="name" value={profile.name} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Contact</label>
                <input type="text" name="contact" value={profile.contact} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2" required />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Specialization</label>
                <input type="text" name="specialization" value={profile.specialization} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2" required />
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-2 flex items-center gap-2"><Upload className="w-5 h-5" /> Upload Profile Picture</h2>
            <div className="flex items-center gap-4">
              <input type="file" name="profilePic" accept="image/*" onChange={handleChange} className="block" />
              {picPreview && <img src={picPreview} alt="Profile Preview" className="w-16 h-16 rounded-full object-cover border" />}
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-2 flex items-center gap-2"><Calendar className="w-5 h-5" /> Update Availability</h2>
            <input type="text" name="availability" value={profile.availability} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2" placeholder="e.g. Mon-Fri, 9am-5pm" />
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-2 flex items-center gap-2"><XCircle className="w-5 h-5" /> Mark Leave Days (Optional)</h2>
            <input type="text" name="leaveDays" value={profile.leaveDays} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2" placeholder="e.g. 2024-06-10, 2024-06-15" />
          </div>
          <div className="flex justify-end">
            <button 
              type="submit" 
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 font-semibold text-base transition disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
          {success && (
            <div className="flex flex-col items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-500 mb-2" />
              <p className="text-lg font-semibold text-green-700">Profile updated successfully!</p>
            </div>
          )}
        </form>
      </main>
    </div>
  );
};

export default Settings;