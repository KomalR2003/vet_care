import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';
const CHATBOT_API_BASE_URL = 'http://127.0.0.1:8000'; 

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

// ========================================
// 🤖 Chatbot API (FastAPI - Port 8000)
// ========================================

const chatbotApi = axios.create({
  baseURL: CHATBOT_API_BASE_URL,
  timeout: 360000, // Longer timeout for AI responses
});

// Chatbot request interceptor
chatbotApi.interceptors.request.use(
  (config) => {
    console.log(`Chatbot: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Chatbot request error:', error);
    return Promise.reject(error);
  }
);

// Chatbot response interceptor
chatbotApi.interceptors.response.use(
  (response) => {
    console.log(`Chatbot response:`, response.status);
    return response;
  },
  (error) => {
    console.error('Chatbot response error:', error.response?.data || error.message);
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

// ========================================
// 🤖 CHATBOT API (FastAPI - Port 8000)
// ========================================

export const chatbotAPI = {
  // Test connection
  testConnection: () => chatbotApi.get('/test'),

  // Chat session management
  createNewChat: async (title = "New Chat") => {
    return chatbotApi.post('/chat/new', { title });
  },

  getChatSessions: async () => {
    return chatbotApi.get('/chat/sessions');
  },

  getChatSession: async (sessionId) => {
    return chatbotApi.get(`/chat/${sessionId}`);
  },

  deleteChatSession: async (sessionId) => {
    if (!sessionId) throw new Error("Session ID is missing");
    return chatbotApi.delete(`/chat/${sessionId}`);
  },

  // Ask question
  askQuestion: async (question, sessionId = null) => {
    const formData = new FormData();
    formData.append('question', question);
    if (sessionId) {
      formData.append('session_id', sessionId);
    }

    return chatbotApi.post('/ask/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Admin panel - Upload PDFs
  uploadPDFs: async (adminKey, files) => {
    const formData = new FormData();
    formData.append('admin_key', adminKey);
    files.forEach((file) => {
      formData.append('files', file);
    });

    return chatbotApi.post('/admin/upload_pdfs/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Admin panel - Get stats
  getStats: (adminKey) => {
    return chatbotApi.get(`/admin/stats/?admin_key=${encodeURIComponent(adminKey)}`);
  },

  // Admin panel - Get PDFs
  getPDFs: (adminKey) => {
    return chatbotApi.get(`/admin/pdfs/?admin_key=${encodeURIComponent(adminKey)}`);
  },

  // Admin panel - Delete PDF
  deletePDF: (filename, adminKey) => {
    return chatbotApi.delete(
      `/admin/delete_file/?filename=${encodeURIComponent(filename)}&admin_key=${encodeURIComponent(adminKey)}`
    );
  }
};

export default api;