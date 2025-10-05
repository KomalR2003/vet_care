import React, { useState } from 'react';
import AppSidebar from '../../components/AppSidebar';
import { CheckCircle, XCircle, Clock, Eye } from 'lucide-react';
import { appointmentsAPI } from '../../api/api';

const MyAppointments = ({ user, appointments, setCurrentView, setUser, currentView, isSidebarOpen, setIsSidebarOpen, setAppointments }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [localAppointments, setLocalAppointments] = useState(appointments || []);

  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedAppointment(null);
  };

  // Update appointment status in local state for UI feedback
  const updateAppointmentStatus = (id, newStatus) => {
    setLocalAppointments(prev => prev.map(apt =>
      apt._id === id ? { ...apt, status: newStatus } : apt
    ));
    setSelectedAppointment(prev => prev ? { ...prev, status: newStatus } : prev);
  };

  const handleConfirm = async () => {
    if (selectedAppointment) {
      try {
        await appointmentsAPI.confirmAppointment(selectedAppointment._id);
        updateAppointmentStatus(selectedAppointment._id, 'confirmed');
        // Update global state
        const updatedAppointments = appointments.map(apt =>
          apt._id === selectedAppointment._id ? { ...apt, status: 'confirmed' } : apt
        );
        setAppointments(updatedAppointments);
        closeModal();
      } catch (error) {
        console.error('Error confirming appointment:', error);
        alert('Failed to confirm appointment. Please try again.');
      }
    }
  };

  const handleCancel = async () => {
    if (selectedAppointment) {
      try {
        await appointmentsAPI.cancelAppointment(selectedAppointment._id);
        updateAppointmentStatus(selectedAppointment._id, 'cancelled');
        // Update global state
        const updatedAppointments = appointments.map(apt =>
          apt._id === selectedAppointment._id ? { ...apt, status: 'cancelled' } : apt
        );
        setAppointments(updatedAppointments);
        closeModal();
      } catch (error) {
        console.error('Error cancelling appointment:', error);
        alert('Failed to cancel appointment. Please try again.');
      }
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
      <div className="flex-1 ml-0  overflow-auto">
        <div className="p-4 lg:p-6">
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">My Appointments</h1>
          </div>
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pet</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pet Owner</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {localAppointments && localAppointments.length > 0 ? (
                  localAppointments.map((apt) => (
                    <tr key={apt._id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap">{apt.date}</td>
                      <td className="px-4 py-4 whitespace-nowrap">{apt.time}</td>
                      <td className="px-4 py-4 whitespace-nowrap">{apt.pet?.name || 'N/A'}</td>
                      <td className="px-4 py-4 whitespace-nowrap">{apt.owner?.name || 'N/A'}</td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${apt.status === 'confirmed'
                          ? 'bg-green-100 text-green-800'
                          : apt.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                          }`}>
                          {apt.status === 'confirmed' && <CheckCircle className="w-3 h-3 mr-1" />}
                          {apt.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                          {apt.status === 'cancelled' && <XCircle className="w-3 h-3 mr-1" />}
                          {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
                        <button
                          onClick={() => handleViewDetails(apt)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded-full border border-blue-100 bg-blue-50 shadow-sm transition"
                          title="View Appointment Details"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center text-gray-500 py-8">No appointments found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        {/* Popup Modal for Appointment Details */}
        {showModal && selectedAppointment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl p-8 relative min-h-[340px] border-2 border-blue-200">
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                onClick={closeModal}
                title="Close"
              >
                <XCircle className="w-7 h-7" />
              </button>
              <h2 className="text-2xl font-bold mb-2 text-blue-700 flex items-center gap-2">
                Appointment Details
                {selectedAppointment.status === 'confirmed' && <CheckCircle className="w-6 h-6 text-green-500" />}
                {selectedAppointment.status === 'pending' && <Clock className="w-6 h-6 text-yellow-500" />}
                {selectedAppointment.status === 'cancelled' && <XCircle className="w-6 h-6 text-red-500" />}
              </h2>
              <div className="mb-2 text-gray-700 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                <div><span className="font-semibold">Pet Name:</span> {selectedAppointment.pet?.name}</div>
                <div><span className="font-semibold">Owner Name:</span> {selectedAppointment.owner?.name}</div>
                <div><span className="font-semibold">Doctor:</span> {selectedAppointment.doctor?.specialization}</div>
                <div><span className="font-semibold">Date:</span> {selectedAppointment.date}</div>
                <div><span className="font-semibold">Time:</span> {selectedAppointment.time}</div>
                <div><span className="font-semibold">Status:</span> {selectedAppointment.status}</div>
                {selectedAppointment.reason && (
                  <div className="md:col-span-2"><span className="font-semibold">Reason:</span> {selectedAppointment.reason}</div>
                )}
              </div>
              <div className="flex flex-wrap gap-4 mt-8 justify-end">
                {selectedAppointment.status === 'pending' && (
                  <>
                    <button
                      onClick={handleConfirm}
                      className="flex items-center gap-2 bg-gradient-to-r from-green-400 to-green-600 text-white px-6 py-2 rounded-lg shadow hover:from-green-500 hover:to-green-700 font-semibold text-base transition"
                    >
                      <CheckCircle className="w-5 h-5" /> Confirm Appointment
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex items-center gap-2 bg-gradient-to-r from-red-400 to-red-600 text-white px-6 py-2 rounded-lg shadow hover:from-red-500 hover:to-red-700 font-semibold text-base transition"
                    >
                      <XCircle className="w-5 h-5" /> Cancel Appointment
                    </button>
                  </>
                )}
                {selectedAppointment.status === 'confirmed' && (
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-2 bg-gradient-to-r from-red-400 to-red-600 text-white px-6 py-2 rounded-lg shadow hover:from-red-500 hover:to-red-700 font-semibold text-base transition"
                  >
                    <XCircle className="w-5 h-5" /> Cancel Appointment
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAppointments;