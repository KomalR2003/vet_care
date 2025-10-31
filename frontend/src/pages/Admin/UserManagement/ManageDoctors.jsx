import React, { useState } from 'react';
import AppSidebar from '../../../components/AppSidebar';
import { User, Phone, Eye, Edit, Trash2, X, Save } from 'lucide-react';

const ManageDoctors = ({ 
  user, 
  doctors, 
  setCurrentView, 
  setUser, 
  currentView, 
  isSidebarOpen, 
  setIsSidebarOpen,
  refreshDoctors 
}) => {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleViewProfile = (doctor) => {
    setSelectedDoctor(doctor);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedDoctor(null);
  };

  const handleEditDoctor = (doctor) => {
    setEditingDoctor({
      _id: doctor._id,
      userId: doctor.userId._id,
      name: doctor.userId.name || '',
      email: doctor.userId.email || '',
      phone: doctor.userId.phone || '',
      specialization: doctor.specialization || '',
      experience: doctor.experience || 0,
      consultation_fee: doctor.consultation_fee || 0,
      bio: doctor.bio || '',
      available_days: doctor.available_days || [],
      available_times: doctor.available_times || []
    });
    setShowEditModal(true);
  };

  const handleInputChange = (field, value) => {
    setEditingDoctor(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveEdit = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem('token');
      
      // Update user info
      const userResponse = await fetch(`http://localhost:5000/api/users/${editingDoctor.userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: editingDoctor.name,
          email: editingDoctor.email,
          phone: editingDoctor.phone
        })
      });

      if (!userResponse.ok) throw new Error('Failed to update user info');

      // Update doctor profile
      const doctorResponse = await fetch(`http://localhost:5000/api/doctors/${editingDoctor._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          specialization: editingDoctor.specialization,
          experience: parseInt(editingDoctor.experience),
          consultation_fee: parseFloat(editingDoctor.consultation_fee),
          bio: editingDoctor.bio,
          available_days: editingDoctor.available_days,
          available_times: editingDoctor.available_times
        })
      });

      if (!doctorResponse.ok) throw new Error('Failed to update doctor profile');

      alert('Doctor updated successfully!');
      setShowEditModal(false);
      setEditingDoctor(null);
      if (refreshDoctors) await refreshDoctors();
    } catch (error) {
      console.error('Error updating doctor:', error);
      alert('Failed to update doctor. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDoctor = async (doctor) => {
    if (!window.confirm(`Are you sure you want to delete Dr. ${doctor.userId?.name}? This action cannot be undone!`)) {
      return;
    }

    try {
      const token = sessionStorage.getItem('token');
      
      // Delete doctor profile first
      const doctorResponse = await fetch(`http://localhost:5000/api/doctors/${doctor._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!doctorResponse.ok) throw new Error('Failed to delete doctor profile');

      // Then delete user
      const userResponse = await fetch(`http://localhost:5000/api/users/${doctor.userId._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!userResponse.ok) throw new Error('Failed to delete user');

      alert('Doctor deleted successfully!');
      if (refreshDoctors) await refreshDoctors();
    } catch (error) {
      console.error('Error deleting doctor:', error);
      alert('Failed to delete doctor. Please try again.');
    }
  };

  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const EditDoctorModal = () => {
    if (!editingDoctor) return null;

    const toggleDay = (day) => {
      const days = editingDoctor.available_days || [];
      if (days.includes(day)) {
        handleInputChange('available_days', days.filter(d => d !== day));
      } else {
        handleInputChange('available_days', [...days, day]);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full my-8">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Edit Doctor Profile</h2>
              <button onClick={() => setShowEditModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                  <input
                    type="text"
                    value={editingDoctor.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    value={editingDoctor.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                  <input
                    type="tel"
                    value={editingDoctor.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Specialization *</label>
                  <input
                    type="text"
                    value={editingDoctor.specialization}
                    onChange={(e) => handleInputChange('specialization', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Experience (years) *</label>
                  <input
                    type="number"
                    value={editingDoctor.experience}
                    onChange={(e) => handleInputChange('experience', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Consultation Fee ($) *</label>
                  <input
                    type="number"
                    value={editingDoctor.consultation_fee}
                    onChange={(e) => handleInputChange('consultation_fee', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                <textarea
                  value={editingDoctor.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Brief bio about the doctor..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Available Days</label>
                <div className="flex flex-wrap gap-2">
                  {weekDays.map(day => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        editingDoctor.available_days?.includes(day)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Available Times (comma separated)</label>
                <input
                  type="text"
                  value={editingDoctor.available_times?.join(', ') || ''}
                  onChange={(e) => handleInputChange('available_times', e.target.value.split(',').map(t => t.trim()).filter(t => t))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 9:00 AM - 12:00 PM, 2:00 PM - 6:00 PM"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
              >
                <Save className="w-4 h-4 mr-2" />
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const DoctorDetailsModal = () => {
    if (!selectedDoctor) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Doctor Details</h2>
              <button onClick={handleCloseDetails} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>

            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">{selectedDoctor.userId?.name}</h3>
                  <p className="text-lg text-blue-600 font-medium">{selectedDoctor.specialization}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Contact Information</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-500">Email:</span>
                      <span className="text-gray-900">{selectedDoctor.userId?.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-900">{selectedDoctor.userId?.phone}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Professional Info</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-500">Experience:</span>
                      <span className="text-gray-900">{selectedDoctor.experience} years</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-500">Consultation Fee:</span>
                      <span className="text-gray-900">${selectedDoctor.consultation_fee}</span>
                    </div>
                  </div>
                </div>
              </div>

              {selectedDoctor.bio && (
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Bio</h4>
                  <p className="text-gray-600">{selectedDoctor.bio}</p>
                </div>
              )}

              {selectedDoctor.available_days?.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Available Days</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedDoctor.available_days.map((day, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                        {day}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedDoctor.available_times?.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Available Times</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedDoctor.available_times.map((time, index) => (
                      <span key={index} className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                        {time}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end mt-6 pt-6 border-t">
              <button onClick={handleCloseDetails} className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
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
      <div className="flex-1 ml-0 overflow-auto">
        <div className="p-4 lg:p-6">
          <div className="mb-6">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">Manage Doctors</h1>
            <p className="text-gray-600">View, edit, and manage doctor profiles</p>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Doctor</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Specialization</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Experience</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fee</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {doctors && doctors.length > 0 ? (
                    doctors.map((doctor) => (
                      <tr key={doctor._id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{doctor.userId?.name}</div>
                              {/* <div className="text-sm text-gray-500">ID: {doctor._id}</div> */}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{doctor.userId?.email}</div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <Phone className="w-3 h-3 mr-1" />
                            {doctor.userId?.phone}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{doctor.specialization}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{doctor.experience} years</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">${doctor.consultation_fee}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button 
                              onClick={() => handleViewProfile(doctor)}
                              className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded" 
                              title="View Profile"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleEditDoctor(doctor)}
                              className="text-green-600 hover:text-green-900 p-2 hover:bg-green-50 rounded" 
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteDoctor(doctor)}
                              className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded" 
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                        No doctors available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {showDetails && <DoctorDetailsModal />}
      {showEditModal && <EditDoctorModal />}
    </div>
  );
};

export default ManageDoctors;