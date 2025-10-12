import React, { useState } from 'react';
import AppSidebar from '../../../components/AppSidebar';
import { Calendar, CheckCircle, XCircle, Clock, Eye, X, User, Stethoscope, PawPrint, FileText } from 'lucide-react';

const AllAppointments = ({ user, appointments, setCurrentView, setUser, currentView, isSidebarOpen, setIsSidebarOpen }) => {
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Helper function to safely extract display names from objects
  const getDisplayName = (item) => {
    if (!item) return 'N/A';
    if (typeof item === 'string') return item;
    if (typeof item === 'object') {
      return item.name || 
             item.userId?.name || 
             item.petName || 
             item.doctorName || 
             item.ownerName ||
             item._id || 
             'Unknown';
    }
    return String(item);
  };

  // Helper function to get doctor info
  const getDoctorInfo = (doctor) => {
    if (!doctor) return 'N/A';
    if (typeof doctor === 'string') return doctor;
    if (typeof doctor === 'object') {
      const name = doctor.name || doctor.userId?.name || 'Unknown Doctor';
      const specialization = doctor.specialization ? ` (${doctor.specialization})` : '';
      return `${name}${specialization}`;
    }
    return String(doctor);
  };

  const handleViewAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedAppointment(null), 300);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
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
      <div className="flex-1 ml-0 overflow-auto">
        <div className="p-4 lg:p-6">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">All Appointments</h1>
          <p className="text-gray-600 mb-6">View and manage all appointments</p>
          
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pet Owner</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Doctor</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pet</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {appointments.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                      No appointments found
                    </td>
                  </tr>
                ) : (
                  appointments.map((apt, index) => (
                    <tr key={apt._id || apt.id || index} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        {getDisplayName(apt.petOwner || apt.owner || apt.user)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        {getDoctorInfo(apt.doctor)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        {getDisplayName(apt.pet)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        {apt.date ? new Date(apt.date).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        {apt.time || 'N/A'}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        {apt.reason || apt.description || 'N/A'}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          apt.status === 'confirmed'
                            ? 'bg-green-100 text-green-800'
                            : apt.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : apt.status === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {apt.status === 'confirmed' && <CheckCircle className="w-3 h-3 mr-1" />}
                          {apt.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                          {apt.status === 'cancelled' && <XCircle className="w-3 h-3 mr-1" />}
                          {apt.status ? apt.status.charAt(0).toUpperCase() + apt.status.slice(1) : 'Unknown'}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                        <button 
                          className="text-blue-600 hover:text-blue-900 hover:bg-blue-50 p-2 rounded-lg transition-colors" 
                          title="View Details"
                          onClick={() => handleViewAppointment(apt)}
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div 
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
              onClick={closeModal}
            ></div>

            {/* Modal panel */}
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Appointment Details</h3>
                </div>
                <button
                  onClick={closeModal}
                  className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Content */}
              {selectedAppointment && (
                <div className="px-6 py-6 space-y-6">
                  {/* Status Badge */}
                  <div className="flex justify-center">
                    <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border-2 ${getStatusColor(selectedAppointment.status)}`}>
                      {selectedAppointment.status === 'confirmed' && <CheckCircle className="w-4 h-4 mr-2" />}
                      {selectedAppointment.status === 'pending' && <Clock className="w-4 h-4 mr-2" />}
                      {selectedAppointment.status === 'cancelled' && <XCircle className="w-4 h-4 mr-2" />}
                      {selectedAppointment.status ? selectedAppointment.status.charAt(0).toUpperCase() + selectedAppointment.status.slice(1) : 'Unknown'}
                    </span>
                  </div>

                  {/* Pet Owner Info */}
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                    <div className="flex items-start space-x-3">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-gray-500 uppercase mb-1">Pet Owner</h4>
                        <p className="text-lg font-medium text-gray-900">
                          {getDisplayName(selectedAppointment.petOwner || selectedAppointment.owner || selectedAppointment.user)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Doctor Info */}
                  <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                    <div className="flex items-start space-x-3">
                      <div className="bg-green-100 p-2 rounded-lg">
                        <Stethoscope className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-gray-500 uppercase mb-1">Doctor</h4>
                        <p className="text-lg font-medium text-gray-900">
                          {getDoctorInfo(selectedAppointment.doctor)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Pet Info */}
                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                    <div className="flex items-start space-x-3">
                      <div className="bg-purple-100 p-2 rounded-lg">
                        <PawPrint className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-gray-500 uppercase mb-1">Pet</h4>
                        <p className="text-lg font-medium text-gray-900">
                          {getDisplayName(selectedAppointment.pet)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Appointment Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Date</h4>
                      <p className="text-base font-medium text-gray-900">
                        {selectedAppointment.date ? new Date(selectedAppointment.date).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        }) : 'N/A'}
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Time</h4>
                      <p className="text-base font-medium text-gray-900">
                        {selectedAppointment.time || 'N/A'}
                      </p>
                    </div>
                  </div>

                  {/* Reason */}
                  <div className="bg-orange-50 rounded-lg p-4 border border-orange-100">
                    <div className="flex items-start space-x-3">
                      <div className="bg-orange-100 p-2 rounded-lg">
                        <FileText className="w-5 h-5 text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">Reason for Visit</h4>
                        <p className="text-base text-gray-900">
                          {selectedAppointment.reason || selectedAppointment.description || 'No reason provided'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Appointment ID */}
                  {selectedAppointment._id && (
                    <div className="text-center pt-2 border-t border-gray-200">
                      <p className="text-xs text-gray-500">
                        Appointment ID: <span className="font-mono font-medium">{selectedAppointment._id}</span>
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Footer */}
              <div className="bg-gray-50 px-6 py-4 flex justify-end">
                <button
                  onClick={closeModal}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllAppointments;