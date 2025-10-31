import React, { useState, useEffect } from 'react';
import { petsAPI, appointmentsAPI, doctorsAPI } from './api/api';

// Auth Components
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';

// Admin Components
import AdminDashboard from './pages/Admin/Dashboard';
import ManagePetOwners from './pages/Admin/UserManagement/ManagePetOwners';
import ManageDoctors from './pages/Admin/UserManagement/ManageDoctors';
import AllAppointments from './pages/Admin/AppointmentOversight/AllAppointments';
import AllPets from './pages/Admin/PetManagement/AllPets';
import MedicalHistory from './pages/Admin/PetManagement/MedicalHistory';
import AdminReports from './pages/Admin/Reports/AdminReports';
import ChatbotAdminPanel from './pages/Admin/ChatbotAdmin/ChatbotAdminPanel';

// Pet Owner Components
import PetOwnerDashboard from './pages/PetOwner/PetOwnerDashboard';
import MyPets from './pages/PetOwner/MyPets';
import MyAppointments from './pages/PetOwner/Appointments/MyAppointments';
import AddPetForm from './components/AddPetForm';
import BookAppointmentForm from './components/BookAppointmentForm';
import ChatbotApp from './pages/PetOwner/Chatbot/ChatbotPage';
import MedicalReports from './pages/PetOwner/MedicalReports';

// Doctor Components
import DoctorDashboard from './pages/Doctor/DoctorDashboard';
import MyAppointmentsDoctor from './pages/Doctor/MyAppointments';
import PatientHistory from './pages/Doctor/PatientHistory';
import Reports from './pages/Doctor/Reports';
import Settings from './pages/Doctor/Settings';

function App() {
  const [currentView, setCurrentView] = useState('login');
  const [user, setUser] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [pets, setPets] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);


  

  // Fetch data when user logs in
  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  // Function to refresh all data
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (user.role === 'pet owner') {
        const [petsResponse, appointmentsResponse, doctorsResponse] = await Promise.all([
          petsAPI.getPets(),
          appointmentsAPI.getAppointments(),
          doctorsAPI.getDoctors()
        ]);
        setPets(petsResponse.data);
        setAppointments(appointmentsResponse.data);
        setDoctors(doctorsResponse.data);
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

  
  // Refresh functions for specific data
  const refreshPets = async () => {
    try {
      const response = await petsAPI.getPets();
      setPets(response.data);
    } catch (error) {
      console.error('Error refreshing pets:', error);
    }
  };

  const refreshAppointments = async () => {
    try {
      const response = await appointmentsAPI.getAppointments();
      setAppointments(response.data);
    } catch (error) {
      console.error('Error refreshing appointments:', error);
    }
  };

  const refreshDoctors = async () => {
    try {
      const response = await doctorsAPI.getDoctors();
      setDoctors(response.data);
    } catch (error) {
      console.error('Error refreshing doctors:', error);
    }
  };

  // Common props for all components
  const adminProps = {
    user,
    pets,
    appointments,
    doctors,
    setCurrentView,
    setUser,
    currentView,
    isSidebarOpen,
    setIsSidebarOpen,
    refreshPets,
    refreshAppointments,
    refreshDoctors
  };

  const commonProps = {
    user,
    setCurrentView,
    setUser,
    currentView,
    isSidebarOpen,
    setIsSidebarOpen
  };

  // Show login/register if no user
  if (!user) {
    return currentView === 'register'
      ? <Register setCurrentView={setCurrentView} />
      : <Login onLogin={setUser} setCurrentView={setCurrentView} />;
  }

  // Admin Routes
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
      case 'admin-reports':
        return <AdminReports {...adminProps} />;
      case 'chatbot-admin':  
        return <ChatbotAdminPanel {...adminProps} />;   
      default:
        return <AdminDashboard {...adminProps} />;
    }
  }

  // Doctor Routes
  if (user.role === 'doctor') {
    switch (currentView) {
      case 'dashboard':
        return <DoctorDashboard 
          {...commonProps} 
          appointments={appointments} 
          setAppointments={setAppointments}
          reports={[]}
        />;
      case 'my-appointments':
        return <MyAppointmentsDoctor 
          {...commonProps} 
          appointments={appointments} 
          setAppointments={setAppointments}
          refreshAppointments={refreshAppointments}
        />;
      case 'patient-history':
        return <PatientHistory 
          {...commonProps} 
          appointments={appointments} 
          pets={pets} 
        />;
      case 'reports':
        return <Reports 
          {...commonProps} 
          reports={[]} 
        />;
      case 'settings':
        return <Settings {...commonProps} />;
      default:
        return <DoctorDashboard 
          {...commonProps} 
          appointments={appointments} 
          setAppointments={setAppointments}
          reports={[]}
        />;
    }
  }

  // Pet Owner Routes
  if (user.role === 'pet owner') {
    switch (currentView) {
      case 'dashboard':
        return <PetOwnerDashboard 
          {...commonProps} 
          pets={pets} 
          appointments={appointments} 
        />;
      case 'my-pets':
        return <MyPets 
          {...commonProps} 
          pets={pets} 
          setPets={setPets}
          refreshPets={refreshPets}
        />;
      case 'add-pet':
        return <AddPetForm 
          pets={pets} 
          setPets={setPets} 
          setCurrentView={setCurrentView}
          refreshPets={refreshPets}
        />;
      case 'my-appointments':
        return <MyAppointments 
          {...commonProps} 
          appointments={appointments} 
          setAppointments={setAppointments}
          refreshAppointments={refreshAppointments}
        />;
      case 'book-appointment':
        return <BookAppointmentForm 
          pets={pets} 
          doctors={doctors}
          appointments={appointments} 
          setAppointments={setAppointments} 
          setCurrentView={setCurrentView}
          refreshAppointments={refreshAppointments}
        />;
      case 'medical-reports':
        return <MedicalReports {...commonProps} />;  
     
      case 'pet-details':
        return <MyPets 
          {...commonProps} 
          pets={pets} 
          setPets={setPets}
          refreshPets={refreshPets}
        />;
      case 'edit-pet':
        return <MyPets 
          {...commonProps} 
          pets={pets} 
          setPets={setPets}
          refreshPets={refreshPets}
        />;
      case 'edit-appointment':
        return <MyAppointments 
          {...commonProps} 
          appointments={appointments} 
          setAppointments={setAppointments}
          refreshAppointments={refreshAppointments}
        />;
      case 'chatbot':
        return <ChatbotApp setCurrentView={setCurrentView} />;
      default:
        return <PetOwnerDashboard 
          {...commonProps} 
          pets={pets} 
          appointments={appointments} 
        />;
    }
  }

  // Fallback to login
  return <Login onLogin={setUser} setCurrentView={setCurrentView} />;
}

export default App;