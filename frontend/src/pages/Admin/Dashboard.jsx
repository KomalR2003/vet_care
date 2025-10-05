import React from 'react';
import AppSidebar from '../../components/AppSidebar';
import { Users, User, PawPrint, Calendar,  TrendingUp,  CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const Dashboard = ({
  user, pets, appointments, doctors, setCurrentView, setUser, currentView, isSidebarOpen, setIsSidebarOpen
}) => {
  // Calculate statistics
  const totalUsers = (pets?.length || 0) + (doctors?.length || 0);
  const totalPets = pets?.length || 0;
  const totalAppointments = appointments?.length || 0;
  const todayAppointments = appointments?.filter(apt => {
    const today = new Date().toDateString();
    const aptDate = new Date(apt.date).toDateString();
    return aptDate === today;
  }).length || 0;
  // const upcomingAppointments = appointments?.filter(apt => apt.status === 'confirmed').length || 0;
  // const completedAppointments = appointments?.filter(apt => apt.status === 'completed').length || 0;
  
  const pendingAppointments = appointments?.filter(apt => apt.status === 'pending').length || 0;
  const confirmedAppointments = appointments?.filter(apt => apt.status === 'confirmed').length || 0;
  const cancelledAppointments = appointments?.filter(apt => apt.status === 'cancelled').length || 0;

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
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
                <p className="text-gray-600">Welcome back, {user?.name}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content - Left Side */}
            <div className="lg:col-span-2 space-y-6">
              {/* Analytics Section */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">Analytics</h2>
                 
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-blue-100 text-blue-600 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold">{totalUsers}</p>
                        <p className="text-sm opacity-90 ">Total Users</p>
                      </div>
                      <Users className="w-8 h-8" />
                    </div>
                  </div>
                  <div className="bg-purple-100 text-purple-600 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold">{totalPets}</p>
                        <p className="text-sm opacity-90">Total Pets</p>  
                      </div>
                      <PawPrint className="w-8 h-8" />
                    </div>
                  </div>
                  <div className="bg-orange-100 text-orange-600 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold">{doctors?.length || 0}</p>
                        <p className="text-sm opacity-90">Total Doctors</p>
                      </div>
                      <User className="w-8 h-8" />
                    </div>
                  </div>
                  <div className="bg-pink-100 text-pink-600 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold">{todayAppointments}</p>
                        <p className="text-sm opacity-90">Today Appointments</p>
                      </div>
                      <Calendar className="w-8 h-8" />
                    </div>
                  </div>
                  <div className="bg-green-100 text-green-600 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold">{totalAppointments}</p>
                        <p className="text-sm opacity-90">Total Appointments</p>
                      </div>
                      <TrendingUp className="w-8 h-8" />
                    </div>
                  </div>
                </div>
              </div>

             
              {/* Appointment Status Summary */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Appointment Status Summary</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center p-4 bg-yellow-50 rounded-lg">
                    <AlertCircle className="w-8 h-8 text-yellow-600 mr-3" />
                    <div>
                      <p className="text-sm text-yellow-600">Pending</p>
                      <p className="text-2xl font-bold text-yellow-600">{pendingAppointments}</p>
                    </div>
                  </div>
                  <div className="flex items-center p-4 bg-green-50 rounded-lg">
                    <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
                    <div>
                      <p className="text-sm text-green-600">Confirmed</p>
                      <p className="text-2xl font-bold text-green-600">{confirmedAppointments}</p>
                    </div>
                  </div>
                  <div className="flex items-center p-4 bg-red-50 rounded-lg">
                    <XCircle className="w-8 h-8 text-red-600 mr-3" />
                    <div>
                      <p className="text-sm text-red-600">Cancelled</p>
                      <p className="text-2xl font-bold text-red-600">{cancelledAppointments}</p>
                    </div>
                  </div>
                </div>
              </div>

            
            </div>

            {/* Right Panel - Confirmed Appointments */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Confirmed Appointments</h2>
                <input 
                  type="date" 
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  defaultValue={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {appointments && appointments.filter(apt => apt.status === 'confirmed').length > 0 ? (
                  appointments
                    .filter(apt => apt.status === 'confirmed')
                    .slice(0, 5)
                    .map((appointment, index) => (
                      <div key={appointment._id || index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                          <PawPrint className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Appointment by {appointment.ownerName || appointment.petName || 'Client'}</p>
                          <p className="text-xs text-gray-500">
                            {appointment.date || 'Today'} | {appointment.time || '09:00 AM'}
                          </p>
                          <p className="text-xs text-gray-400">ID: {appointment._id || index + 1}</p>
                        </div>
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">NEW</span>
                      </div>
                    ))
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">No confirmed appointments</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;