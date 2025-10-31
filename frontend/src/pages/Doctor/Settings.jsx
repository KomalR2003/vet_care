import React, { useState, useEffect } from "react";
import AppSidebar from "../../components/AppSidebar";
import {
  Settings as SettingsIcon,
  User,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { doctorsAPI } from "../../api/api";

const Settings = ({
  user,
  setCurrentView,
  setUser,
  currentView,
  isSidebarOpen,
  setIsSidebarOpen,
}) => {
  const [profile, setProfile] = useState({
    name: "",
    phone: "",
    specialization: "",
    experience: 0,
    consultation_fee: 0,
    bio: "",
    availability: "",
    leaveDays: "",
    available_days: [],
    available_times: [],
  });

  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  const weekDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  // Load current user data
  useEffect(() => {
    const loadDoctorData = async () => {
      try {
        setLoadingData(true);
        const response = await doctorsAPI.getDoctors();
        const currentDoctor = response.data.find(
          (doc) => doc.userId._id === user._id
        );

        if (currentDoctor) {
          setProfile({
            name: user.name || "",
            phone: user.phone || "",
            specialization: currentDoctor.specialization || "",
            experience: currentDoctor.experience || 0,
            consultation_fee: currentDoctor.consultation_fee || 0,
            bio: currentDoctor.bio || "",
            availability: user.availability || "",
            leaveDays: user.leaveDays ? user.leaveDays.join(", ") : "",
            available_days: currentDoctor.available_days || [],
            available_times: currentDoctor.available_times || [],
          });
        } else {
          setProfile({
            name: user.name || "",
            phone: user.phone || "",
            specialization: user.occupation || "",
            experience: 0,
            consultation_fee: 0,
            bio: "",
            availability: user.availability || "",
            leaveDays: user.leaveDays ? user.leaveDays.join(", ") : "",
            available_days: [],
            available_times: [],
          });
        }
      } catch (error) {
        console.error("Error loading doctor data:", error);
        setErrorMessage("Failed to load profile. Please try again later.");
      } finally {
        setLoadingData(false);
      }
    };

    if (user) loadDoctorData();
  }, [user]);

  const handleChange = (field, value) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const toggleDay = (day) => {
    const days = profile.available_days || [];
    if (days.includes(day)) {
      handleChange(
        "available_days",
        days.filter((d) => d !== day)
      );
    } else {
      handleChange("available_days", [...days, day]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setErrorMessage("");

    try {
      const settingsData = {
        name: profile.name,
        phone: profile.phone,
        specialization: profile.specialization,
        experience: parseInt(profile.experience) || 0,
        consultation_fee: parseFloat(profile.consultation_fee) || 0,
        bio: profile.bio,
        availability: profile.availability,
        leaveDays: profile.leaveDays
          ? profile.leaveDays.split(",").map((day) => day.trim())
          : [],
        available_days: profile.available_days || [],
        available_times: profile.available_times || [],
      };

      const response = await doctorsAPI.updateSettings(settingsData);

      if (setUser) setUser(response.data);

      // ✅ Show success message
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (error) {
      console.error("Error updating settings:", error);
      const msg =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to update settings. Please try again.";
      setErrorMessage(msg);
      setTimeout(() => setErrorMessage(""), 5000);
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
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
        <main className="flex-1 ml-0 p-6 overflow-auto flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </main>
      </div>
    );
  }

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
        <div className="flex items-center mb-6">
          <SettingsIcon className="w-8 h-8 text-blue-600 mr-3" />
          <h1 className="text-2xl font-bold text-gray-800">
            Profile & Schedule Settings
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow p-6 max-w-4xl mx-auto space-y-6"
        >
          {/* Personal Info */}
          <div>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <User className="w-5 h-5" /> Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone *
                </label>
                <input
                  type="text"
                  value={profile.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  required
                />
              </div>
            </div>
          </div>

          {/* Professional Info */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Professional Info</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Specialization *
                </label>
                <input
                  type="text"
                  value={profile.specialization}
                  onChange={(e) =>
                    handleChange("specialization", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Experience (years) *
                </label>
                <input
                  type="number"
                  value={profile.experience}
                  onChange={(e) => handleChange("experience", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Consultation Fee (₹) *
                </label>
                <input
                  type="number"
                  value={profile.consultation_fee}
                  onChange={(e) =>
                    handleChange("consultation_fee", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  required
                />
              </div>
            </div>
          </div>

          {/* Bio Section */}
          <div>
            <h2 className="text-lg font-semibold mb-4">About Me</h2>
            <textarea
              value={profile.bio}
              onChange={(e) => handleChange("bio", e.target.value)}
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              placeholder="Tell us about yourself and your expertise..."
            />
          </div>

          {/* Availability */}
          <div>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5" /> Availability & Schedule
            </h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                General Availability
              </label>
              <input
                type="text"
                value={profile.availability}
                onChange={(e) => handleChange("availability", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                placeholder="e.g. Mon-Fri, 9am-5pm"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available Days
              </label>
              <div className="flex flex-wrap gap-2">
                {weekDays.map((day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      profile.available_days?.includes(day)
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Leave Days */}
          <div>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <XCircle className="w-5 h-5" /> Leave Days (Optional)
            </h2>
            <input
              type="text"
              value={profile.leaveDays}
              onChange={(e) => handleChange("leaveDays", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              placeholder="e.g. Sunday, Wednesday"
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 font-semibold text-base transition disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>

          {/* ✅ Success Message */}
          {success && (
            <div className="flex flex-col items-center justify-center mt-4 p-4 bg-green-50 rounded-lg border border-green-300 animate-fadeIn">
              <CheckCircle className="w-8 h-8 text-green-500 mb-2" />
              <p className="text-lg font-semibold text-green-700">
                Profile updated successfully!
              </p>
            </div>
          )}

          {/*  Error Message */}
          {errorMessage && (
            <div className="flex flex-col items-center justify-center mt-4 p-4 bg-red-50 rounded-lg border border-red-300 animate-fadeIn">
              <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
              <p className="text-lg font-semibold text-red-700">
                {errorMessage}
              </p>
            </div>
          )}
        </form>
      </main>
    </div>
  );
};

export default Settings;
