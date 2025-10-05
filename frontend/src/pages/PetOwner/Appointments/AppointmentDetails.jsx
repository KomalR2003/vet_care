import React from 'react';
import AppSidebar from '../../../components/AppSidebar';
import { Calendar } from 'lucide-react';

const AppointmentDetails = ({ user, appointments, setCurrentView, setUser, currentView, isSidebarOpen, setIsSidebarOpen }) => {
  const appointment = appointments && appointments.length > 0 ? appointments[0] : null;

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
          <button
            onClick={() => setCurrentView('my-appointments')}
            className="mb-4 text-blue-600 hover:underline"
          >
            &larr; Back to My Appointments
          </button>
          {appointment ? (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Appointment Details</h2>
              <div className="mb-2"><strong>Date:</strong> {appointment.date}</div>
              <div className="mb-2"><strong>Time:</strong> {appointment.time}</div>
              <div className="mb-2"><strong>Doctor:</strong> {appointment.doctorName}</div>
              <div className="mb-2"><strong>Pet:</strong> {appointment.petName}</div>
              <div className="mb-2"><strong>Status:</strong> {appointment.status}</div>
              <div className="mt-4 flex space-x-2">
                <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Cancel</button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Reschedule</button>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500">Appointment not found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetails;