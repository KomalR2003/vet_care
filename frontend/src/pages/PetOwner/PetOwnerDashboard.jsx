import React from "react";
import AppSidebar from "../../components/AppSidebar";
import {  
  Heart, 
  Calendar, 
  FileText, 
  CheckCircle, 
  Clock,
  Plus,
  User,
  Activity,
  TrendingUp
} from "lucide-react";

const PetOwnerDashboard = ({ 
  user, 
  pets = [], 
  appointments = [], 
  setCurrentView, 
  setUser, 
  currentView, 
  isSidebarOpen, 
  setIsSidebarOpen 
}) => {
  // Calculate counts based on requirements
  const totalPets = pets.length;
  
  // Filter appointments for this specific pet owner
  const ownerAppointments = appointments.filter(apt => apt.owner === user._id || apt.owner?._id === user._id);
  
  const upcomingAppts = ownerAppointments.filter(apt => 
    apt.status === 'confirmed' && new Date(apt.date) > new Date()
  );
  
  const pendingAppts = ownerAppointments.filter(apt => 
    apt.status === 'pending'
  );
  
  // const completedAppts = ownerAppointments.filter(apt => 
  //   apt.status === 'completed'
  // );
  
  const cancelledAppts = ownerAppointments.filter(apt => 
    apt.status === 'cancelled'
  );
  
  const recentReports = 0; // This will come from backend reports data

  const quickActions = [
    {
      id: 1,
      title: "Add New Pet",
      icon: Plus,
      color: "blue",
      action: () => setCurrentView('add-pet')
    },
    {
      id: 2,
      title: "Book Appointment",
      icon: Calendar,
      color: "green",
      action: () => setCurrentView('book-appointment')
    },
    {
      id: 3,
      title: "View My Pets",
      icon: Heart,
      color: "purple",
      action: () => setCurrentView('my-pets')
    },
    {
      id: 4,
      title: "My Appointments",
      icon: User,
      color: "orange",
      action: () => setCurrentView('my-appointments')
    }
  ];

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
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
              Welcome back, {user?.name || 'Pet Owner'}! 
            </h1>
            <p className="text-gray-600">Here's what's happening with your pets today</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
            {/* My Pets Count */}
            <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Heart className="w-8 h-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">My Pets</p>
                  <p className="text-2xl font-bold text-gray-900">{totalPets}</p>
                </div>
              </div>
            </div>

            {/* Upcoming Appointments */}
            <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Calendar className="w-8 h-8 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Upcoming Appointments</p>
                  <p className="text-2xl font-bold text-gray-900">{upcomingAppts.length}</p>
                </div>
              </div>
            </div>

            {/* Recent Reports */}
            <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <FileText className="w-8 h-8 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Recent Reports</p>
                  <p className="text-2xl font-bold text-gray-900">{recentReports}</p>
                </div>
              </div>
            </div>

            {/* Completed Appointments */}
            <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Cancelled Appointments</p>
                  <p className="text-2xl font-bold text-gray-900">{cancelledAppts.length}</p>
                </div>
              </div>
            </div>

            {/* Pending Appointments */}
            <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Clock className="w-8 h-8 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending Appointments</p>
                  <p className="text-2xl font-bold text-gray-900">{pendingAppts.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Actions */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
                <div className="space-y-3">
                  {quickActions.map((action) => (
                    <button
                      key={action.id}
                      onClick={action.action}
                      className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 hover:scale-105 ${
                        action.color === 'blue' ? 'bg-blue-100 text-blue-600 ' :
                        action.color === 'green' ? 'bg-green-100 text-green-600' :
                        action.color === 'purple' ? 'bg-purple-100 text-purple-600' :
                        'bg-orange-100 text-orange-600'
                      }`}
                    >
                      <action.icon className="w-5 h-5 mr-3" />
                      <span className="font-medium">{action.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Upcoming Appointments */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Upcoming Appointments</h2>
                {upcomingAppts.length > 0 ? (
                  <div className="space-y-3">
                    {upcomingAppts.map((apt, index) => (
                      <div key={apt._id || index} className="flex items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer" onClick={() => setCurrentView('appointment-details')}>
                        <div className="p-2 bg-blue-100 rounded-full">
                          <Calendar className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="ml-3 flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {apt.petName || apt.pet?.name || 'Pet'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {apt.doctorName || apt.doctor?.name || 'Doctor'}
                          </p>
                          <p className="text-xs text-gray-400">
                            {apt.date || 'Today'} at {apt.time || '10:00 AM'}
                          </p>
                          {apt.reason && (
                            <p className="text-xs text-gray-500 mt-1">
                              Reason: {apt.reason}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">No upcoming appointments</p>
                    <button
                      onClick={() => setCurrentView('book-appointment')}
                      className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Book an appointment
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Pet Overview Section */}
          {pets && pets.length > 0 && (
            <div className="mt-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">Your Pets Overview</h2>
                  <button
                    onClick={() => setCurrentView('my-pets')}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    View All Pets
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pets.slice(0, 3).map((pet) => (
                    <div key={pet._id} className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer" onClick={() => setCurrentView('pet-details')}>
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                        <Heart className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{pet.name}</h3>
                        <p className="text-sm text-gray-500">{pet.breed} • {pet.age} years</p>
                        <p className="text-xs text-gray-400">{pet.species}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {pets.length > 3 && (
                  <div className="text-center mt-4">
                    <button
                      onClick={() => setCurrentView('my-pets')}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      View {pets.length - 3} more pets
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Health Summary */}
          <div className="mt-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Health Summary</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-900">All Pets Healthy</p>
                  <p className="text-xs text-gray-500">No urgent health issues</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Activity className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-900">Recent Checkups</p>
                  <p className="text-xs text-gray-500">Last: 2 weeks ago</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <FileText className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-900">Reports Available</p>
                  <p className="text-xs text-gray-500">{recentReports} new reports</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetOwnerDashboard;