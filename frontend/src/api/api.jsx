import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
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
      console.log('Authentication error - clearing session');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      if (window.location.pathname !== '/login') {
        window.dispatchEvent(new CustomEvent('auth-error'));
      }
    }
    
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

  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return !!(token && user);
  },

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
  getPets: () => api.get('/pets'),
  getPetById: (id) => api.get(`/pets/${id}`),
  createPet: (petData) => api.post('/pets', petData),
  updatePet: (id, petData) => api.put(`/pets/${id}`, petData),
  deletePet: (id) => api.delete(`/pets/${id}`),
  getPetHistory: (id) => api.get(`/pets/${id}/history`)
};

// Appointments API
export const appointmentsAPI = {
  getAppointments: () => api.get('/appointments'),
  getAppointmentById: (id) => api.get(`/appointments/${id}`),
  createAppointment: (appointmentData) => api.post('/appointments', appointmentData),
  updateAppointment: (id, appointmentData) => api.put(`/appointments/${id}`, appointmentData),
  deleteAppointment: (id) => api.delete(`/appointments/${id}`),
  confirmAppointment: (id) => api.post(`/appointments/${id}/confirm`),
  cancelAppointment: (id) => api.post(`/appointments/${id}/cancel`),
  rescheduleAppointment: (id, rescheduleData) => api.post(`/appointments/${id}/reschedule`, rescheduleData)
};

// Doctors API
export const doctorsAPI = {
  getDoctors: () => api.get('/doctors'),
  getDoctorById: (id) => api.get(`/doctors/${id}`),
  updateSettings: (settingsData) => api.put('/doctors/settings', settingsData)
};

// Reports API
export const reportsAPI = {
  // Get all reports (filtered by user role on backend)
  getReports: () => api.get('/reports'),
  
  // Get reports for a specific pet
  getPetReports: (petId) => api.get(`/reports/pet/${petId}`),
  
  // Get a specific report by ID
  getReportById: (id) => api.get(`/reports/${id}`),
  
  // Create a new report
  createReport: (reportData) => api.post('/reports', reportData),
  
  // Update a report
  updateReport: (id, reportData) => api.put(`/reports/${id}`, reportData),
  
  // Delete a report
  deleteReport: (id) => api.delete(`/reports/${id}`),
  
  // Download report as PDF
  downloadReportPDF: async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/reports/${id}/pdf`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to download PDF');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `medical-report-${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      return { success: true };
    } catch (error) {
      console.error('Error downloading PDF:', error);
      throw error;
    }
  }
};

export default api;