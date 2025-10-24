import React, { useState, useEffect } from "react";
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
  TrendingUp,
  AlertCircle
} from "lucide-react";
import { reportsAPI } from "../../api/api";

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
  const [reports, setReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(true);

  // Fetch reports when component mounts
  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoadingReports(true);
      const response = await reportsAPI.getReports();
      console.log('📊 Fetched reports:', response.data);
      
      // Filter reports for this pet owner's pets
      const ownerPetIds = pets.map(pet => pet._id);
      const ownerReports = response.data.filter(report => {
        const reportPetId = report.pet?._id || report.pet;
        return ownerPetIds.includes(reportPetId);
      });
      
      setReports(ownerReports);
    } catch (error) {
      console.error('❌ Error fetching reports:', error);
      setReports([]);
    } finally {
      setLoadingReports(false);
    }
  };

  // Helper function to format date for comparison
  const formatDateForComparison = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // YYYY-MM-DD format
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // YYYY-MM-DD format
  };

  // Calculate counts based on requirements
  const totalPets = pets.length;
  
  // Filter appointments for this specific pet owner
  const ownerAppointments = appointments.filter(apt => {
    const ownerId = apt.owner?._id || apt.owner;
    return ownerId?.toString() === user._id?.toString();
  });
  
  const todayDate = getTodayDate();
  
  // Upcoming appointments: confirmed status and date is today or future
  const upcomingAppts = ownerAppointments.filter(apt => {
    const aptDate = formatDateForComparison(apt.date);
    const isConfirmed = apt.status === 'confirmed';
    const isFutureOrToday = aptDate >= todayDate;
    return isConfirmed && isFutureOrToday;
  });
  
  const pendingAppts = ownerAppointments.filter(apt => 
    apt.status === 'pending'
  );
  
  const cancelledAppts = ownerAppointments.filter(apt => 
    apt.status === 'cancelled'
  );
  
  const completedAppts = ownerAppointments.filter(apt => 
    apt.status === 'completed'
  );

  // Health Summary Calculations
  const recentReports = reports.length;
  
  // Get reports from last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const recentHealthReports = reports.filter(report => {
    const reportDate = new Date(report.date);
    return reportDate >= thirtyDaysAgo;
  });

  // Calculate pets with recent checkups (within last 90 days)
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
  
  const petsWithRecentCheckup = new Set(
    reports
      .filter(report => new Date(report.date) >= ninetyDaysAgo)
      .map(report => report.pet?._id || report.pet)
  ).size;

  // Check for pets needing attention (no checkup in 90 days)
  const petsNeedingCheckup = totalPets - petsWithRecentCheckup;

  // Calculate health status
  const getHealthStatus = () => {
    if (petsNeedingCheckup === 0) {
      return {
        status: 'Excellent',
        message: 'All pets have recent checkups',
        color: 'green',
        icon: <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
      };
    } else if (petsNeedingCheckup <= totalPets * 0.3) {
      return {
        status: 'Good',
        message: `${petsNeedingCheckup} pet(s) need checkup soon`,
        color: 'blue',
        icon: <Activity className="w-8 h-8 text-blue-600 mx-auto mb-2" />
      };
    } else {
      return {
        status: 'Needs Attention',
        message: `${petsNeedingCheckup} pet(s) need checkup`,
        color: 'yellow',
        icon: <AlertCircle className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
      };
    }
  };

  const healthStatus = getHealthStatus();

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

  // Format date for display
  const formatDisplayDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
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
                  <p className="text-sm font-medium text-gray-600">Upcoming</p>
                  <p className="text-2xl font-bold text-gray-900">{upcomingAppts.length}</p>
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
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">{pendingAppts.length}</p>
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
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">{completedAppts.length}</p>
                </div>
              </div>
            </div>

            {/* Cancelled Appointments */}
            <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center">
                <div className="p-3 bg-red-100 rounded-lg">
                  <FileText className="w-8 h-8 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Cancelled</p>
                  <p className="text-2xl font-bold text-gray-900">{cancelledAppts.length}</p>
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
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Upcoming Appointments ({upcomingAppts.length})
                </h2>
                {upcomingAppts.length > 0 ? (
                  <div className="space-y-3">
                    {upcomingAppts.slice(0, 5).map((apt) => (
                      <div 
                        key={apt._id} 
                        className="flex items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer" 
                        onClick={() => setCurrentView('my-appointments')}
                      >
                        <div className="p-2 bg-blue-100 rounded-full">
                          <Calendar className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="ml-3 flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {apt.petName || apt.pet?.name || 'Pet'}
                          </p>
                          <p className="text-xs text-gray-500">
                            Dr. {apt.doctorName || apt.doctor?.userId?.name || 'Doctor'}
                          </p>
                          <p className="text-xs text-gray-400">
                            {formatDisplayDate(apt.date)} at {apt.time || '10:00 AM'}
                          </p>
                          {apt.reason && (
                            <p className="text-xs text-gray-500 mt-1">
                              Reason: {apt.reason}
                            </p>
                          )}
                        </div>
                        <div className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                          {apt.status}
                        </div>
                      </div>
                    ))}
                    {upcomingAppts.length > 5 && (
                      <button
                        onClick={() => setCurrentView('my-appointments')}
                        className="w-full text-center text-sm text-blue-600 hover:text-blue-800 mt-2"
                      >
                        View all {upcomingAppts.length} upcoming appointments
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm mb-2">No upcoming appointments</p>
                    <p className="text-xs text-gray-400 mb-3">
                      {pendingAppts.length > 0 
                        ? `You have ${pendingAppts.length} pending appointment(s) waiting for confirmation`
                        : 'Book an appointment to get started'}
                    </p>
                    <button
                      onClick={() => setCurrentView('book-appointment')}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
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
                    <div 
                      key={pet._id} 
                      className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer" 
                      onClick={() => setCurrentView('my-pets')}
                    >
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

          {/* Health Summary - REAL-TIME DATA */}
          <div className="mt-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Health Summary</h2>
                <button
                  onClick={() => setCurrentView('medical-reports')}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View All Reports
                </button>
              </div>
              
              {loadingReports ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Overall Health Status */}
                  <div className={`text-center p-6 rounded-xl border-2 ${
                    healthStatus.color === 'green' ? 'bg-green-50 border-green-200' :
                    healthStatus.color === 'blue' ? 'bg-blue-50 border-blue-200' :
                    'bg-yellow-50 border-yellow-200'
                  }`}>
                    {healthStatus.icon}
                    <p className="text-lg font-bold text-gray-900 mb-1">{healthStatus.status}</p>
                    <p className="text-sm text-gray-600">{healthStatus.message}</p>
                    {petsNeedingCheckup > 0 && (
                      <button
                        onClick={() => setCurrentView('book-appointment')}
                        className="mt-3 text-xs bg-white px-3 py-1 rounded-full text-blue-600 hover:bg-blue-50 font-medium"
                      >
                        Book Checkup
                      </button>
                    )}
                  </div>

                  {/* Total Appointments */}
                  <div className="text-center p-6 bg-blue-50 border-2 border-blue-200 rounded-xl">
                    <Activity className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-lg font-bold text-gray-900 mb-1">
                      {ownerAppointments.length} Appointments
                    </p>
                    <p className="text-sm text-gray-600">
                      {completedAppts.length} completed • {upcomingAppts.length} upcoming
                    </p>
                    <div className="mt-3 flex justify-center space-x-2">
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                        {completedAppts.length} Done
                      </span>
                      <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                        {pendingAppts.length} Pending
                      </span>
                    </div>
                  </div>

                  {/* Medical Reports */}
                  <div className="text-center p-6 bg-purple-50 border-2 border-purple-200 rounded-xl">
                    <FileText className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <p className="text-lg font-bold text-gray-900 mb-1">
                      {recentReports} Reports
                    </p>
                    <p className="text-sm text-gray-600">
                      {recentHealthReports.length} in last 30 days
                    </p>
                    {recentReports > 0 ? (
                      <button
                        onClick={() => setCurrentView('medical-reports')}
                        className="mt-3 text-xs bg-white px-3 py-1 rounded-full text-purple-600 hover:bg-purple-100 font-medium"
                      >
                        View Reports
                      </button>
                    ) : (
                      <p className="mt-3 text-xs text-gray-500">
                        Reports will appear after appointments
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Recent Health Activity */}
              {!loadingReports && recentHealthReports.length > 0 && (
                <div className="mt-6 pt-6 border-t">
                  <h3 className="font-semibold text-gray-800 mb-4">Recent Reports Activity</h3>
                  <div className="space-y-3">
                    {recentHealthReports.slice(0, 3).map((report) => (
                      <div 
                        key={report._id}
                        className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                        onClick={() => setCurrentView('medical-reports')}
                      >
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                          <FileText className="w-5 h-5 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {report.pet?.name || 'Pet'} - {report.summary || 'Medical Report'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDisplayDate(report.date)} • Dr. {report.doctor?.userId?.name || 'Doctor'}
                          </p>
                        </div>
                        {report.medications && report.medications.length > 0 && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                            {report.medications.length} med{report.medications.length > 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetOwnerDashboard;