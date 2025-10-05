import React from 'react';
import AppSidebar from '../../../components/AppSidebar';
import { Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';

const MyAppointments = ({ user, appointments, setCurrentView, setUser, currentView, isSidebarOpen, setIsSidebarOpen }) => (
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
          <button
            onClick={() => setCurrentView('book-appointment')}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Calendar className="w-5 h-5 mr-2" />
            Book Appointment
          </button>
        </div>
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Doctor</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pet</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {appointments && appointments.length > 0 ? (
                appointments.map((apt) => (
                  <tr key={apt._id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap">{apt.date}</td>
                    <td className="px-4 py-4 whitespace-nowrap">{apt.time}</td>
                    <td className="px-4 py-4 whitespace-nowrap">{apt.doctorName}</td>
                    <td className="px-4 py-4 whitespace-nowrap">{apt.petName}</td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        apt.status === 'confirmed'
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
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => setCurrentView('appointment-details')}
                        className="text-blue-600 hover:text-blue-900 p-1"
                        title="View Details"
                      >
                        <Calendar className="w-4 h-4" />
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
    </div>
  </div>
);

export default MyAppointments;