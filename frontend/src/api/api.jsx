import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
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
    // Only redirect to login on 401 if we have a response
    if (error.response?.status === 401) {
      console.log('Authentication error - clearing session');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Only redirect if not already on login page
      if (window.location.pathname !== '/login') {
        // For SPA, you might want to use a custom event instead
        window.dispatchEvent(new CustomEvent('auth-error'));
      }
    }
    
    // Log other errors for debugging
    if (error.response) {
      console.error('API Error:', {
        status: error.response.status,
        data: error.response.data,
        url: error.config?.url
      });
    } else if (error.request) {
      console.error('Network Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (credentials) => {
    const response = await api.post('/login', credentials);
    // Store token and user data
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    if (response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response;
  },
  
  register: async (userData) => {
    const response = await api.post('/register', userData);
    return response;
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return !!(token && user);
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
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