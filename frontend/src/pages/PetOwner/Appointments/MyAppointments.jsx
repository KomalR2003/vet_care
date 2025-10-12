import React, { useState } from 'react';
import AppSidebar from '../../../components/AppSidebar';
import { Calendar, Eye, Edit, Trash2, User, Heart, CheckCircle, XCircle, Clock } from 'lucide-react';
import { appointmentsAPI } from '../../../api/api';

const MyAppointments = ({ 
  user, 
  appointments = [], 
  setAppointments, 
  setCurrentView, 
  setUser, 
  currentView, 
  isSidebarOpen, 
  setIsSidebarOpen 
}) => {
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const handleViewAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setShowDetails(true);
  };

  const handleEditAppointment = (appointment) => {
    // Navigate to edit appointment page
    setCurrentView('edit-appointment');
  };

  const handleDeleteAppointment = async (appointmentId) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await appointmentsAPI.deleteAppointment(appointmentId);
        // Remove appointment from local state
        setAppointments(appointments.filter(apt => apt._id !== appointmentId));
      } catch (error) {
        console.error('Error deleting appointment:', error);
        alert('Failed to cancel appointment. Please try again.');
      }
    }
  };

  const handleBookAppointment = () => {
    setCurrentView('book-appointment');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-3 h-3 mr-1" />;
      case 'pending':
        return <Clock className="w-3 h-3 mr-1" />;
      case 'cancelled':
        return <XCircle className="w-3 h-3 mr-1" />;
      case 'completed':
        return <CheckCircle className="w-3 h-3 mr-1" />;
      default:
        return <Clock className="w-3 h-3 mr-1" />;
    }
  };

  // Appointment Details Modal
  const AppointmentDetailsModal = () => {
    if (!selectedAppointment) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Appointment Details</h2>
              <button
                onClick={() => setShowDetails(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {/* Appointment Info */}
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    Appointment #{selectedAppointment._id}
                  </h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedAppointment.status)}`}>
                    {getStatusIcon(selectedAppointment.status)}
                    {selectedAppointment.status.charAt(0).toUpperCase() + selectedAppointment.status.slice(1)}
                  </span>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-700 mb-3">Appointment Information</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Date:</span>
                      <span className="text-gray-900">{selectedAppointment.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Time:</span>
                      <span className="text-gray-900">{selectedAppointment.time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Reason:</span>
                      <span className="text-gray-900">{selectedAppointment.reason || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Notes:</span>
                      <span className="text-gray-900">{selectedAppointment.notes || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-700 mb-3">Pet & Doctor Information</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Pet:</span>
                      <span className="text-gray-900">{selectedAppointment.petName || selectedAppointment.pet?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Doctor:</span>
                      <span className="text-gray-900">{selectedAppointment.doctorName || selectedAppointment.doctor?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Specialization:</span>
                      <span className="text-gray-900">{selectedAppointment.doctor?.specialization || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              {selectedAppointment.notes && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-700 mb-3">Additional Notes</h4>
                  <p className="text-gray-900">{selectedAppointment.notes}</p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
              {selectedAppointment.status === 'pending' && (
                <button
                  onClick={() => {
                    setShowDetails(false);
                    handleEditAppointment(selectedAppointment);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Edit Appointment
                </button>
              )}
              <button
                onClick={() => setShowDetails(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
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
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">My Appointments</h1>
              <p className="text-gray-600">View and manage your appointments</p>
            </div>
            <button
              onClick={handleBookAppointment}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Book Appointment
            </button>
          </div>

          {/* Appointments Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pet</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {appointments.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                        <div className="flex flex-col items-center">
                          <Calendar className="w-12 h-12 text-gray-400 mb-2" />
                          <p>No appointments found</p>
                          <button
                            onClick={handleBookAppointment}
                            className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            Book your first appointment
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    appointments.map((appointment) => (
                      <tr key={appointment._id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <Heart className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {appointment.petName || appointment.pet?.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {appointment.pet?.species || 'N/A'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                              <User className="w-4 h-4 text-green-600" />
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">
                                {appointment.doctorName || appointment.doctor?.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {appointment.doctor?.specialization || 'N/A'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{appointment.date}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{appointment.time}</td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                            {getStatusIcon(appointment.status)}
                            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleViewAppointment(appointment)}
                              className="text-blue-600 hover:text-blue-900 p-1" 
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            {appointment.status === 'pending' && (
                              <button 
                                onClick={() => handleEditAppointment(appointment)}
                                className="text-green-600 hover:text-green-900 p-1" 
                                title="Edit Appointment"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                            )}
                            <button 
                              onClick={() => handleDeleteAppointment(appointment._id)}
                              className="text-red-600 hover:text-red-900 p-1" 
                              title="Cancel Appointment"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Appointment Details Modal */}
      {showDetails && <AppointmentDetailsModal />}
    </div>
  );
};

export default MyAppointments;
