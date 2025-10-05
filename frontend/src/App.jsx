import React, { useState, useEffect } from 'react';
import { petsAPI, appointmentsAPI, doctorsAPI  } from './api/api';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import AdminDashboard from './pages/Admin/Dashboard';
import ManagePetOwners from './pages/Admin/UserManagement/ManagePetOwners';
import ManageDoctors from './pages/Admin/UserManagement/ManageDoctors';
import AllAppointments from './pages/Admin/AppointmentOversight/AllAppointments';
import AllPets from './pages/Admin/PetManagement/AllPets';
import MedicalHistory from './pages/Admin/PetManagement/MedicalHistory';
import DiseaseAnalysis from './pages/Admin/ReportsAnalytics/DiseaseAnalysis';
import PetOwnerDashboard from './pages/PetOwner/PetOwnerDashboard';
import DoctorDashboard from './pages/Doctor/DoctorDashboard';

import AddPetForm from './components/AddPetForm';
import BookAppointmentForm from './components/BookAppointmentForm';

import MyPets from './pages/PetOwner/MyPets';
import MyAppointments from './pages/PetOwner/MyAppointments';

import PatientHistory from './pages/Doctor/PatientHistory';
import Reports from './pages/Doctor/Reports';
import MyAppointmentsDoctor from './pages/Doctor/MyAppointments';
import Settings from './pages/Doctor/Settings';

function App() {
  const [currentView, setCurrentView] = useState('login');
  const [user, setUser] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [pets, setPets] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // const [formErrors, setFormErrors] = useState({});

  // Fetch data from backend when user is logged in
  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch pets, appointments, doctors based on user role
      if (user.role === 'pet owner') {
        const [petsResponse, appointmentsResponse] = await Promise.all([
          petsAPI.getPets(),
          appointmentsAPI.getAppointments()
        ]);
        setPets(petsResponse.data);
        setAppointments(appointmentsResponse.data);
      } else if (user.role === 'doctor') {
        const [appointmentsResponse, petsResponse] = await Promise.all([
          appointmentsAPI.getAppointments(),
          petsAPI.getPets()
        ]);
        setAppointments(appointmentsResponse.data);
        setPets(petsResponse.data);
      } else if (user.role === 'admin') {
        const [petsResponse, appointmentsResponse, doctorsResponse] = await Promise.all([
          petsAPI.getPets(),
          appointmentsAPI.getAppointments(),
          doctorsAPI.getDoctors()
        ]);
        setPets(petsResponse.data);
        setAppointments(appointmentsResponse.data);
        setDoctors(doctorsResponse.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch data from server');
    } finally {
      setLoading(false);
    }
  };

  // Common props for admin pages
  const adminProps = {
    user,
    pets,
    appointments,
    doctors,
    setCurrentView,
    setUser,
    currentView,
    isSidebarOpen,
    setIsSidebarOpen
  };

  // Common props for other pages
  const commonProps = {
    user,
    setCurrentView,
    setUser,
    currentView,
    isSidebarOpen,
    setIsSidebarOpen
  };

  // Main render logic
  if (!user) {
    return currentView === 'register'
      ? <Register setCurrentView={setCurrentView} />
      : <Login setUser={setUser} setCurrentView={setCurrentView} />;
  }

  // Role-based dashboard rendering
  if (user.role === 'admin') {
    switch (currentView) {
      case 'dashboard':
        return <AdminDashboard {...adminProps} />;
      case 'manage-pet-owners':
        return <ManagePetOwners {...adminProps} />;
      case 'manage-doctors':
        return <ManageDoctors {...adminProps} />;
      case 'appointment-oversight':
        return <AllAppointments {...adminProps} />;
      case 'all-pets':
        return <AllPets {...adminProps} />;
      case 'medical-history':
        return <MedicalHistory {...adminProps} />;
      case 'reports-analytics':
        return <DiseaseAnalysis {...adminProps} />;    
      default:
        return <AdminDashboard {...adminProps} />;
    }
  }

  if (user.role === 'doctor') {
  switch (currentView) {
    case 'dashboard':
      return <DoctorDashboard {...commonProps} appointments={appointments} setAppointments={setAppointments} />;
    case 'my-appointments':
      return <MyAppointmentsDoctor {...commonProps} appointments={appointments} setAppointments={setAppointments} />;
    case 'patient-history':
      return <PatientHistory {...commonProps} appointments={appointments} pets={pets} />;
    case 'reports':
      return <Reports {...commonProps} reports={[]} />;
    case 'settings':
      return <Settings {...commonProps} />;
    default:
      return <DoctorDashboard {...commonProps} appointments={appointments} setAppointments={setAppointments} />;
  }
}

  if (user.role === 'pet owner') {
    switch (currentView) {
      case 'dashboard':
        return <PetOwnerDashboard {...commonProps} pets={pets} appointments={appointments} />;
      case 'my-pets':
        return <MyPets {...commonProps} pets={pets} setPets={setPets} />;
      case 'add-pet':
        return <AddPetForm pets={pets} setPets={setPets} setCurrentView={setCurrentView} />;
      case 'my-appointments':
        return <MyAppointments {...commonProps} appointments={appointments} setAppointments={setAppointments} />;
      case 'book-appointment':
        return <BookAppointmentForm pets={pets} doctors={doctors} appointments={appointments} setAppointments={setAppointments} setCurrentView={setCurrentView} />;
      case 'pet-details':
        return <MyPets {...commonProps} pets={pets} setPets={setPets} />;
      case 'edit-pet':
        return <MyPets {...commonProps} pets={pets} setPets={setPets} />;
      case 'edit-appointment':
        return <MyAppointments {...commonProps} appointments={appointments} setAppointments={setAppointments} />;
      default:
        return <PetOwnerDashboard {...commonProps} pets={pets} appointments={appointments} />;
    }
  }

  // Fallback
  return <Login setUser={setUser} setCurrentView={setCurrentView} />;
}

export default App;