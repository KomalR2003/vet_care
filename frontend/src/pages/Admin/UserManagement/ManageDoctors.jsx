import React, { useState } from 'react';
import AppSidebar from '../../../components/AppSidebar';
import { User, Phone, Eye } from 'lucide-react';

const ManageDoctors = ({ 
  user, 
  doctors, 
  setCurrentView, 
  setUser, 
  currentView, 
  isSidebarOpen, 
  setIsSidebarOpen 
}) => {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const handleViewProfile = (doctor) => {
    setSelectedDoctor(doctor);
    setShowDetails(true);
  };

  // const handleEditDoctor = (doctor) => {
  //   console.log('Edit doctor:', doctor);
  // };

  // const handleDeleteDoctor = (doctor) => {
  //   if (window.confirm(`Are you sure you want to delete Dr. ${doctor.userId?.name}?`)) {
  //     console.log('Delete doctor:', doctor);
  //   }
  // }

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedDoctor(null);
  };

  // Doctor Details Modal
  const DoctorDetailsModal = () => {
    if (!selectedDoctor) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Doctor Details</h2>
              <button
                onClick={handleCloseDetails}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {/* Doctor Info */}
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">{selectedDoctor.userId?.name}</h3>
                  <p className="text-lg text-blue-600 font-medium">{selectedDoctor.specialization}</p>
                </div>
              </div>

              {/* Contact Info */}
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

              {/* Bio */}
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Bio</h4>
                <p className="text-gray-600">{selectedDoctor.bio}</p>
              </div>

              {/* Available Days */}
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Available Days</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedDoctor.available_days?.map((day, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                      {day}
                    </span>
                  ))}
                </div>
              </div>

              {/* Available Times */}
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Available Times</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedDoctor.available_times?.map((time, index) => (
                    <span key={index} className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                      {time}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
             
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
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">Manage Doctors</h1>
            <p className="text-gray-600">View and manage doctor profiles</p>
          </div>

          {/* Doctors Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialization</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experience</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fee</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
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
                              <div className="text-sm text-gray-500">ID: {doctor._id}</div>
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
                              className="text-blue-600 hover:text-blue-900 p-1" 
                              title="View Profile"
                            >
                              <Eye className="w-4 h-4" />
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

      {/* Doctor Details Modal */}
      {showDetails && <DoctorDetailsModal />}
    </div>
  );
};

export default ManageDoctors;