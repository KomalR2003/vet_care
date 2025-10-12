import React, { useMemo } from "react";
import {
  Users,
  User,
  PawPrint,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  Star,
  Activity,
  TrendingUp,
} from "lucide-react";

import AppSidebar from "../../components/AppSidebar";

const DoctorDashboard = ({
  user,
  doctors = [],
  pets = [],
  appointments = [],
  setCurrentView,
  setUser,
  currentView,
  isSidebarOpen,
  setIsSidebarOpen,
}) => {
  //  Stats
  const totalDoctors = doctors.length;
  const totalPets = pets.length;
  const totalAppointments = appointments.length;
  const pendingAppointments = appointments.filter(
    (a) => a.status === "pending"
  ).length;
  const confirmedAppointments = appointments.filter(
    (a) => a.status === "confirmed"
  ).length;
  const cancelledAppointments = appointments.filter(
    (a) => a.status === "cancelled"
  ).length;

  //  All confirmed appointments
  const allConfirmedAppointments = appointments.filter(
    (apt) => apt.status === "confirmed"
  );

  //  Top Doctors (by appointment count)
  const topDoctors = useMemo(() => {
    const stats = {};
    appointments.forEach((apt) => {
      if (apt.doctorName) {
        stats[apt.doctorName] = (stats[apt.doctorName] || 0) + 1;
      }
    });
    return Object.entries(stats)
      .map(([name, count]) => ({ name, appointments: count }))
      .sort((a, b) => b.appointments - a.appointments)
      .slice(0, 5);
  }, [appointments]);

  // Recent activity feed
  const recentActivities = appointments
    .slice(-6)
    .reverse()
    .map((a) => ({
      id: a._id,
      pet: a.pet?.name || "Unknown Pet",
      owner: a.owner?.name || "Unknown Owner",
      status: a.status,
      date: a.date,
    }));

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

      <div className="flex-1 p-6 overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Doctor Dashboard
            </h1>
            <p className="text-gray-600">
              Welcome back, {user?.name || "Doctor"}
            </p>
          </div>
        </div>

        {/* Analytics Section */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Analytics</h2>
          <div className="grid grid-cols-5 gap-4 mb-6">
            <StatCard
              title="Total Doctors"
              value={totalDoctors}
              icon={<User className="w-6 h-6" />}
              bgColor="bg-orange-100"
              textColor="text-orange-600"
              iconColor="text-orange-600"
            />
            <StatCard
              title="Total Pets"
              value={totalPets}
              icon={<PawPrint className="w-6 h-6" />}
              bgColor="bg-purple-100"
              textColor="text-purple-600"
              iconColor="text-purple-600"
            />
            <StatCard
              title="Total Appointments"
              value={totalAppointments}
              icon={<TrendingUp className="w-6 h-6" />}
              bgColor="bg-green-100"
              textColor="text-green-600"
              iconColor="text-green-600"
            />
            <StatCard
              title="Pending Appointments"
              value={pendingAppointments}
              icon={<AlertCircle className="w-6 h-6" />}
              bgColor="bg-yellow-100"
              textColor="text-yellow-600"
              iconColor="text-yellow-600"
            />
            <StatCard
              title="Today Appointments"
              value={0}
              icon={<Calendar className="w-6 h-6" />}
              bgColor="bg-pink-100"
              textColor="text-pink-600"
              iconColor="text-pink-600"
            />
          </div>
        </div>

        {/* Appointment Status Summary */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Appointment Status Summary
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatusSummaryCard
              title="Pending"
              value={pendingAppointments}
              icon={<AlertCircle className="w-8 h-8" />}
              bgColor="bg-yellow-50"
              iconBgColor="bg-yellow-100"
              textColor="text-yellow-600"
            />
            <StatusSummaryCard
              title="Confirmed"
              value={confirmedAppointments}
              icon={<CheckCircle className="w-8 h-8" />}
              bgColor="bg-green-50"
              iconBgColor="bg-green-100"
              textColor="text-green-600"
            />
            <StatusSummaryCard
              title="Cancelled"
              value={cancelledAppointments}
              icon={<XCircle className="w-8 h-8" />}
              bgColor="bg-red-50"
              iconBgColor="bg-red-100"
              textColor="text-red-600"
            />
          </div>
        </div>

        {/* Middle Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* ✅ Doctor Leaderboard */}
          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" /> Top Performing Doctors
            </h2>
            {topDoctors.length > 0 ? (
              <ul className="divide-y divide-gray-100">
                {topDoctors.map((doc, i) => (
                  <li
                    key={i}
                    className="flex justify-between items-center py-3 hover:bg-gray-50 px-2 rounded-lg transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="text-blue-600 w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{doc.name}</p>
                        <p className="text-xs text-gray-500">
                          {doc.appointments} Appointments
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400 text-center py-10">
                No doctor data available
              </p>
            )}
          </div>

          {/* ✅ All Confirmed Appointments */}
          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" /> Confirmed Appointments
            </h2>
            {allConfirmedAppointments.length > 0 ? (
              <ul className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
                {allConfirmedAppointments.map((a, i) => (
                  <li
                    key={i}
                    className="flex justify-between items-center py-3 hover:bg-gray-50 px-2 rounded-lg transition"
                  >
                    <div>
                      <p className="font-medium text-gray-800">
                        Booked by {a.doctorName || "Unknown Doctor"} for {a.pet?.name || "Unknown Pet"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(a.date).toLocaleDateString()} at{" "}
                        {new Date(a.date).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                      Confirmed
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400 text-center py-10">
                No confirmed appointments
              </p>
            )}
          </div>
        </div>

        {/* Bottom Section - Recent Activities */}
        <div className="mt-6 bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-500" /> Recent Activities
          </h2>
          {recentActivities.length > 0 ? (
            <div className="space-y-3 max-h-72 overflow-y-auto">
              {recentActivities.map((a, i) => (
                <div
                  key={i}
                  className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition border border-gray-100"
                >
                  <p className="text-sm text-gray-700">
                    <b>{a.owner}</b> booked appointment for{" "}
                    <b>{a.pet}</b> -{" "}
                    <span className="capitalize font-medium">{a.status}</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(a.date).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-6">No recent activities</p>
          )}
        </div>
      </div>
    </div>
  );
};

// ✅ Reusable Components
const StatCard = ({ title, value, icon, bgColor, textColor, iconColor }) => (
  <div className={`${bgColor} rounded-xl shadow-sm p-4 flex items-center justify-between hover:shadow-md transition`}>
    <div>
      <p className={`text-2xl font-bold ${textColor}`}>{value}</p>
      <p className="text-xs text-gray-600 mt-1">{title}</p>
    </div>
    <div className={`${iconColor} opacity-80`}>{icon}</div>
  </div>
);

const StatusSummaryCard = ({ title, value, icon, bgColor, iconBgColor, textColor }) => (
  <div className={`${bgColor} rounded-xl shadow-sm p-4 hover:shadow-md transition`}>
    <div className="flex items-center gap-3">
      <div className={`${iconBgColor} p-2 rounded-full ${textColor}`}>
        {icon}
      </div>
      <div>
        <p className={`text-xs font-medium ${textColor}`}>{title}</p>
        <p className={`text-2xl font-bold ${textColor} mt-1`}>{value}</p>
      </div>
    </div>
  </div>
);

export default DoctorDashboard;