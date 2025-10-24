import React, { useState, useEffect, useMemo } from "react";
import AppSidebar from "../../components/AppSidebar";
import { Calendar, CheckCircle, AlertCircle, FileText, Eye, X } from "lucide-react";
import { appointmentsAPI, reportsAPI } from "../../api/api";

const DoctorDashboard = ({
  user,
  appointments = [],
  reports = [],
  setCurrentView,
  setUser,
  currentView,
  isSidebarOpen,
  setIsSidebarOpen,
  setAppointments,
}) => {
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [doctorAppointments, setDoctorAppointments] = useState([]);
  const [recentReports, setRecentReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(true);

  // Fetch reports when component mounts
  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoadingReports(true);
      const response = await reportsAPI.getReports();
      console.log('📊 Fetched reports:', response.data); // Debug log
      
      // Get the 3 most recent reports and sort by date
      const sortedReports = (response.data || [])
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 3);
      
      setRecentReports(sortedReports);
    } catch (error) {
      console.error('❌ Error fetching reports:', error);
      setRecentReports([]);
    } finally {
      setLoadingReports(false);
    }
  };

  // --- Date helpers ---
  const getDateOnly = (dateInput) => {
    if (!dateInput) return null;
    const d = new Date(dateInput);
    if (Number.isNaN(d.getTime())) return null;
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  };

  const getDateTimeValue = (apt) => {
    // returns epoch ms for (date + time if present) for sorting
    const base = new Date(apt.date ? apt.date : Date.now());
    const dt = new Date(base.getFullYear(), base.getMonth(), base.getDate());
    if (apt.time) {
      // try to parse HH:MM (24h) or HH:MM AM/PM basic
      const t = apt.time.trim();
      const match24 = t.match(/^(\d{1,2}):(\d{2})$/);
      const matchAMPM = t.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
      if (match24) {
        dt.setHours(Number(match24[1]), Number(match24[2]), 0, 0);
      } else if (matchAMPM) {
        let hh = Number(matchAMPM[1]);
        const mm = Number(matchAMPM[2]);
        const ampm = matchAMPM[3].toUpperCase();
        if (ampm === "PM" && hh < 12) hh += 12;
        if (ampm === "AM" && hh === 12) hh = 0;
        dt.setHours(hh, mm, 0, 0);
      }
    } else {
      // if original date contained time (ISO), use that
      const maybeFull = new Date(apt.date);
      if (!Number.isNaN(maybeFull.getTime()) && maybeFull.getHours() !== 0) {
        return maybeFull.getTime();
      }
    }
    return dt.getTime();
  };

  const todayDate = useMemo(() => {
    const t = new Date();
    return new Date(t.getFullYear(), t.getMonth(), t.getDate());
  }, []);

  // --- Doctor match helper ---
  const isDoctorMatch = (apt) => {
    if (!apt) return false;
    const doctor = apt.doctor || apt.doctorId || apt.doctorName;
    if (!doctor) return false;

    if (typeof doctor === "object") {
      return (
        doctor._id === user?._id ||
        doctor.id === user?.id ||
        doctor.name?.toLowerCase() === user?.name?.toLowerCase()
      );
    }

    return (
      doctor === user?._id ||
      doctor === user?.id ||
      (typeof doctor === "string" && doctor?.toLowerCase() === user?.name?.toLowerCase())
    );
  };

  // --- Filter doctor's appointments ---
  useEffect(() => {
    if (!user || !appointments?.length) {
      setDoctorAppointments([]);
      return;
    }
    const filtered = appointments.filter((apt) => isDoctorMatch(apt));
    setDoctorAppointments(filtered);
  }, [appointments, user]);

  // --- Categorize & sort ---
  const todayAppointments = doctorAppointments
    .filter((apt) => {
      const aptDate = getDateOnly(apt.date);
      return aptDate && aptDate.getTime() === todayDate.getTime();
    })
    .sort((a, b) => getDateTimeValue(a) - getDateTimeValue(b));

  const pendingAppointments = doctorAppointments.filter(
    (apt) => apt.status?.toLowerCase() === "pending"
  );

  const upcomingAppointments = doctorAppointments
    .filter((apt) => {
      const aptDate = getDateOnly(apt.date);
      const status = apt.status?.toLowerCase();
      return (
        aptDate &&
        aptDate.getTime() > todayDate.getTime() &&
        (status === "confirmed" || status === "pending")
      );
    })
    .sort((a, b) => getDateTimeValue(a) - getDateTimeValue(b));

  // Pet/Owner helpers
  const getPetName = (apt) =>
    apt?.pet?.name || apt?.pet?.petName || apt?.petName || "Unknown Pet";
  const getOwnerName = (apt) =>
    apt?.owner?.name || apt?.petOwner?.name || apt?.user?.name || apt?.ownerName || "Unknown Owner";

  // Actions
  const handleConfirmAppointment = async (appointmentId) => {
    try {
      await appointmentsAPI.confirmAppointment(appointmentId);
      setAppointments((prev) =>
        prev.map((apt) => (apt._id === appointmentId ? { ...apt, status: "confirmed" } : apt))
      );
      setShowDetails(false);
    } catch (err) {
      console.error(err);
      alert("Failed to confirm appointment");
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    try {
      await appointmentsAPI.cancelAppointment(appointmentId);
      setAppointments((prev) =>
        prev.map((apt) => (apt._id === appointmentId ? { ...apt, status: "cancelled" } : apt))
      );
      setShowDetails(false);
    } catch (err) {
      console.error(err);
      alert("Failed to cancel appointment");
    }
  };

  // Modal
  const AppointmentDetailsModal = () => {
    if (!selectedAppointment) return null;
    const apt = selectedAppointment;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              Appointment #{apt._id?.slice(-6) || "N/A"}
            </h2>
            <button onClick={() => setShowDetails(false)} className="text-gray-500 hover:text-gray-700 p-2">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p><b>Date:</b> {apt.date ? new Date(apt.date).toLocaleDateString("en-CA") : "N/A"}</p>
              <p><b>Time:</b> {apt.time || "N/A"}</p>
              <p><b>Reason:</b> {apt.reason || "General Checkup"}</p>
              <p><b>Status:</b> {apt.status || "Unknown"}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p><b>Pet:</b> {getPetName(apt)}</p>
              <p><b>Owner:</b> {getOwnerName(apt)}</p>
              <p><b>Phone:</b> {apt.owner?.phone || "N/A"}</p>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            {apt.status?.toLowerCase() === "pending" && (
              <>
                <button
                  onClick={() => handleConfirmAppointment(apt._id)}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Confirm
                </button>
                <button
                  onClick={() => handleCancelAppointment(apt._id)}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Cancel
                </button>
              </>
            )}
            <button
              onClick={() => setShowDetails(false)}
              className="border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-100"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Main UI
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

      <main className="flex-1 p-6 overflow-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome, Dr. {user?.name || "Doctor"}</h1>
        <p className="text-gray-500 mb-6">Specialization: {user?.specialization || "General Practice"}</p>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard icon={<Calendar />} title="Today's Appointments" count={todayAppointments.length} color="blue" />
          <StatCard icon={<AlertCircle />} title="Pending" count={pendingAppointments.length} color="yellow" />
          <StatCard icon={<CheckCircle />} title="Upcoming" count={upcomingAppointments.length} color="green" />
          <StatCard icon={<FileText />} title="Recent Reports" count={recentReports.length} color="purple" />
        </div>

        {/* Today's Appointments */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <div className="flex justify-between mb-4">
            <h2 className="text-lg font-semibold">Today's Appointments</h2>
            <button className="text-blue-600 hover:underline" onClick={() => setCurrentView("my-appointments")}>
              View All
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-gray-600 border-b">
                  <th className="p-2">Pet</th>
                  <th className="p-2">Owner</th>
                  <th className="p-2">Time</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {todayAppointments.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-6 text-gray-400">
                      No appointments for today
                    </td>
                  </tr>
                ) : (
                  todayAppointments.map((apt) => (
                    <tr key={apt._id} className="border-t hover:bg-gray-50">
                      <td className="p-2">{getPetName(apt)}</td>
                      <td className="p-2">{getOwnerName(apt)}</td>
                      <td className="p-2">{apt.time || "N/A"}</td>
                      <td className="p-2">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            apt.status === "confirmed"
                              ? "bg-green-100 text-green-700"
                              : apt.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {apt.status || "Unknown"}
                        </span>
                      </td>
                      <td className="p-2">
                        <button
                          onClick={() => {
                            setSelectedAppointment(apt);
                            setShowDetails(true);
                          }}
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 flex items-center gap-1"
                        >
                          <Eye className="w-4 h-4" /> View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Upcoming Appointments (placed below Today's) */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <div className="flex justify-between mb-4">
            <h2 className="text-lg font-semibold">Upcoming Appointments</h2>
            <button className="text-blue-600 hover:underline" onClick={() => setCurrentView("my-appointments")}>
              View All
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-gray-600 border-b">
                  <th className="p-2">Date</th>
                  <th className="p-2">Pet</th>
                  <th className="p-2">Owner</th>
                  <th className="p-2">Time</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {upcomingAppointments.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-6 text-gray-400">
                      No upcoming appointments
                    </td>
                  </tr>
                ) : (
                  upcomingAppointments.map((apt) => (
                    <tr key={apt._id} className="border-t hover:bg-gray-50">
                      <td className="p-2">{apt.date ? new Date(apt.date).toLocaleDateString("en-CA") : "N/A"}</td>
                      <td className="p-2">{getPetName(apt)}</td>
                      <td className="p-2">{getOwnerName(apt)}</td>
                      <td className="p-2">{apt.time || "N/A"}</td>
                      <td className="p-2">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            apt.status === "confirmed"
                              ? "bg-green-100 text-green-700"
                              : apt.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {apt.status || "Unknown"}
                        </span>
                      </td>
                      <td className="p-2">
                        <button
                          onClick={() => {
                            setSelectedAppointment(apt);
                            setShowDetails(true);
                          }}
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 flex items-center gap-1"
                        >
                          <Eye className="w-4 h-4" /> View
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
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Reports</h2>
            <button className="text-blue-600 hover:underline" onClick={() => setCurrentView("reports")}>
              View All
            </button>
          </div>
          
          {loadingReports ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : recentReports.length === 0 ? (
            <p className="text-gray-400 text-center py-6">No recent reports</p>
          ) : (
            <ul className="space-y-3">
              {recentReports.map((r, i) => (
                <li key={r._id || i} className="border-b pb-3 last:border-b-0 hover:bg-gray-50 p-2 rounded transition">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">
                        {r.pet?.name || r.petName || "Unknown Pet"}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {r.summary || r.diagnosis || "No summary"}
                      </p>
                      {r.owner?.name && (
                        <p className="text-xs text-gray-500 mt-1">
                          Owner: {r.owner.name}
                        </p>
                      )}
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
                      {r.date ? new Date(r.date).toLocaleDateString("en-US", {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      }) : ""}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>

      {showDetails && <AppointmentDetailsModal />}
    </div>
  );
};

// Small Stat Card
const StatCard = ({ icon, title, count, color }) => {
  const colorMap = {
    blue: "bg-blue-100 text-blue-700",
    green: "bg-green-100 text-green-700",
    yellow: "bg-yellow-100 text-yellow-700",
    purple: "bg-purple-100 text-purple-700",
  };
  return (
    <div className={`p-4 rounded-lg flex items-center ${colorMap[color] || colorMap.blue}`}>
      <div className="mr-3">{icon}</div>
      <div>
        <p className="text-2xl font-bold">{count}</p>
        <p className="text-sm">{title}</p>
      </div>
    </div>
  );
};

export default DoctorDashboard;