import React from 'react';
import AppSidebar from '../../../components/AppSidebar';
import { Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';

const AllAppointments = ({ user, appointments, setCurrentView, setUser, currentView, isSidebarOpen, setIsSidebarOpen }) => {
  // Helper function to safely extract display names from objects
  const getDisplayName = (item) => {
    if (!item) return 'N/A';
    if (typeof item === 'string') return item;
    if (typeof item === 'object') {
      // Try common name fields
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
                        <div className="flex space-x-2">
                          <button 
                            className="text-red-600 hover:text-red-900 p-1" 
                            title="Cancel"
                            onClick={() => console.log('Cancel appointment:', apt._id)}
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                          <button 
                            className="text-blue-600 hover:text-blue-900 p-1" 
                            title="Reschedule"
                            onClick={() => console.log('Reschedule appointment:', apt._id)}
                          >
                            <Calendar className="w-4 h-4" />
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
  );
};

export default AllAppointments;