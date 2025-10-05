import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/login', credentials),
  register: (userData) => api.post('/register', userData),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

// Pets API
export const petsAPI = {
  // Get all pets for the logged-in user
  getPets: () => api.get('/pets'),
  
  // Get a specific pet by ID
  getPetById: (id) => api.get(`/pets/${id}`),
  
  // Create a new pet
  createPet: (petData) => api.post('/pets', petData),
  
  // Update a pet
  updatePet: (id, petData) => api.put(`/pets/${id}`, petData),
  
  // Delete a pet
  deletePet: (id) => api.delete(`/pets/${id}`),
  
  // Get pet history
  getPetHistory: (id) => api.get(`/pets/${id}/history`)
};

// Appointments API
export const appointmentsAPI = {
  // Get all appointments for the logged-in user
  getAppointments: () => api.get('/appointments'),
  
  // Get a specific appointment by ID
  getAppointmentById: (id) => api.get(`/appointments/${id}`),
  
  // Create a new appointment
  createAppointment: (appointmentData) => api.post('/appointments', appointmentData),
  
  // Update an appointment
  updateAppointment: (id, appointmentData) => api.put(`/appointments/${id}`, appointmentData),
  
  // Delete an appointment
  deleteAppointment: (id) => api.delete(`/appointments/${id}`),
  
  // Confirm an appointment
  confirmAppointment: (id) => api.post(`/appointments/${id}/confirm`),
  
  // Cancel an appointment
  cancelAppointment: (id) => api.post(`/appointments/${id}/cancel`),
  
  // Reschedule an appointment
  rescheduleAppointment: (id, rescheduleData) => api.post(`/appointments/${id}/reschedule`, rescheduleData)
};

// Doctors API
export const doctorsAPI = {
  // Get all doctors
  getDoctors: () => api.get('/doctors'),
  
  // Get a specific doctor by ID
  getDoctorById: (id) => api.get(`/doctors/${id}`),
  
  // Update doctor settings
  updateSettings: (settingsData) => api.put('/doctors/settings', settingsData)
};

// Reports API
export const reportsAPI = {
  // Get all reports
  getReports: () => api.get('/reports'),
  
  // Get a specific report by ID
  getReportById: (id) => api.get(`/reports/${id}`),
  
  // Create a new report
  createReport: (reportData) => api.post('/reports', reportData),
  
  // Update a report
  updateReport: (id, reportData) => api.put(`/reports/${id}`, reportData),
  
  // Delete a report
  deleteReport: (id) => api.delete(`/reports/${id}`)
};

export default api;