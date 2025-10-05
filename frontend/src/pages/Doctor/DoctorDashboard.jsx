import React, { useState } from "react";
import AppSidebar from "../../components/AppSidebar";
import { Calendar, CheckCircle, AlertCircle, FileText,  Eye,} from "lucide-react";
import { appointmentsAPI } from "../../api/api";

const DoctorDashboard = ({
  user,
  appointments = [],
  reports = [],
  notifications = [],
  setCurrentView,
  setUser,
  currentView,
  isSidebarOpen,
  setIsSidebarOpen,
  setAppointments,
}) => {
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  // Filter appointments for this specific doctor
  const doctorAppointments = appointments.filter(apt => apt.doctor === user._id || apt.doctor?._id === user._id);
  const todayAppointments = doctorAppointments.filter(a => a.date === new Date().toISOString().split('T')[0]) || [];
  const pendingAppointments = doctorAppointments.filter(a => a.status === "pending") || [];
  const upcomingAppointments = doctorAppointments.filter(a => a.status === "confirmed") || [];
  const recentReports = reports?.slice(0, 3) || [];

  const handleViewAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setShowDetails(true);
  };

  const handleConfirmAppointment = async (appointmentId) => {
    try {
      await appointmentsAPI.confirmAppointment(appointmentId);
      // Update local state
      const updatedAppointments = appointments.map(apt => 
        apt._id === appointmentId ? { ...apt, status: 'confirmed' } : apt
      );
      setAppointments(updatedAppointments);
      setShowDetails(false);
    } catch (error) {
      console.error('Error confirming appointment:', error);
      alert('Failed to confirm appointment. Please try again.');
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    try {
      await appointmentsAPI.cancelAppointment(appointmentId);
      // Update local state
      const updatedAppointments = appointments.map(apt => 
        apt._id === appointmentId ? { ...apt, status: 'cancelled' } : apt
      );
      setAppointments(updatedAppointments);
      setShowDetails(false);
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      alert('Failed to cancel appointment. Please try again.');
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
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    selectedAppointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                    selectedAppointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
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
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-700 mb-3">Pet & Owner Information</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Pet:</span>
                      <span className="text-gray-900">{selectedAppointment.pet?.name || selectedAppointment.petName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Species:</span>
                      <span className="text-gray-900">{selectedAppointment.pet?.species || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Owner:</span>
                      <span className="text-gray-900">{selectedAppointment.owner?.name || selectedAppointment.ownerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Owner Phone:</span>
                      <span className="text-gray-900">{selectedAppointment.owner?.phone || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
              {selectedAppointment.status === 'pending' && (
                <>
                  <button
                    onClick={() => handleConfirmAppointment(selectedAppointment._id)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Confirm Appointment
                  </button>
                  <button
                    onClick={() => handleCancelAppointment(selectedAppointment._id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Cancel Appointment
                  </button>
                </>
              )}
              {selectedAppointment.status === 'confirmed' && (
                <button
                  onClick={() => handleCancelAppointment(selectedAppointment._id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Cancel Appointment
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
      <main className="flex-1 ml-0 p-6 overflow-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Welcome, Dr. {user?.name}</h1>
            <p className="text-gray-500">Specialization: {user?.occupation}</p>
          </div>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700" onClick={() => setCurrentView("my-appointments")}>
              <Calendar className="inline w-5 h-5 mr-2" /> My Appointments
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-100 rounded-lg p-4 flex items-center">
            <Calendar className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <p className="text-2xl font-bold">{todayAppointments.length}</p>
              <p className="text-gray-600 text-sm">Today's Appointments</p>
            </div>
          </div>
          <div className="bg-yellow-100 rounded-lg p-4 flex items-center">
            <AlertCircle className="w-8 h-8 text-yellow-600 mr-3" />
            <div>
              <p className="text-2xl font-bold">{pendingAppointments.length}</p>
              <p className="text-gray-600 text-sm">Pending Confirmations</p>
            </div>
          </div>
          <div className="bg-green-100 rounded-lg p-4 flex items-center">
            <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
            <div>
              <p className="text-2xl font-bold">{upcomingAppointments.length}</p>
              <p className="text-gray-600 text-sm">Upcoming Appointments</p>
            </div>
          </div>
          <div className="bg-purple-100 rounded-lg p-4 flex items-center">
            <FileText className="w-8 h-8 text-purple-600 mr-3" />
            <div>
              <p className="text-2xl font-bold">{recentReports.length}</p>
              <p className="text-gray-600 text-sm">Recent Reports</p>
            </div>
          </div>
        </div>

       

        {/* Today's Appointments Table */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Today's Appointments</h2>
            <button className="text-blue-600 hover:underline" onClick={() => setCurrentView("my-appointments")}>View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-gray-600">
                  <th className="py-2">Pet</th>
                  <th className="py-2">Owner</th>
                  <th className="py-2">Time</th>
                  <th className="py-2">Status</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {todayAppointments.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-4 text-gray-400">No appointments today</td>
                  </tr>
                ) : (
                  todayAppointments.map((apt) => (
                    <tr key={apt._id} className="border-t">
                      <td className="py-2">{apt.petName}</td>
                      <td className="py-2">{apt.ownerName}</td>
                      <td className="py-2">{apt.time}</td>
                      <td className="py-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          apt.status === "confirmed" ? "bg-green-100 text-green-700" :
                          apt.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                          apt.status === "cancelled" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"
                        }`}>
                          {apt.status}
                        </span>
                      </td>
                      <td className="py-2 flex gap-2">
                        <button 
                          onClick={() => handleViewAppointment(apt)}
                          className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600" 
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Reports */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Recent Reports</h2>
          <ul>
            {recentReports.length === 0 ? (
              <li className="text-gray-400">No recent reports</li>
            ) : (
              recentReports.map((report, idx) => (
                <li key={idx} className="mb-2">
                  <span className="font-medium">{report.petName}</span> - {report.summary} <span className="text-gray-500 text-xs">({report.date})</span>
                </li>
              ))
            )}
          </ul>
        </div>

      </main>

      {/* Appointment Details Modal */}
      {showDetails && <AppointmentDetailsModal />}
    </div>
  );
};

export default DoctorDashboard;