import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';
const CHATBOT_API_BASE_URL = 'http://127.0.0.1:8000';

// ----------------- MAIN AXIOS INSTANCE -----------------
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// Automatically attach JWT token
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
}, Promise.reject);

// Global error handler
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      // console.log('Auth error - clearing session');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.dispatchEvent(new CustomEvent('auth-error'));
      }
    }

    if (error.response) {
      console.error('API Error:', {
        status: error.response.status,
        data: error.response.data,
        url: error.config?.url,
      });
    } else if (error.request) {
      console.error('Network Error:', error.message);
    }

    return Promise.reject(error);
  }
);

// ----------------- AUTH API -----------------
export const authAPI = {
  login: async (credentials) => {
    const response = await api.post('/login', credentials);
    if (response.data?.token) sessionStorage.setItem('token', response.data.token);
    if (response.data?.user)
      sessionStorage.setItem('user', JSON.stringify(response.data.user));
    return response;
  },
  register: (userData) => api.post('/register', userData),
  logout: () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
  },
  getCurrentUser: () => {
    try {
      const userStr = sessionStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (e) {
      console.error('Error parsing user data:', e);
      return null;
    }
  },
};

// ----------------- USERS API -----------------
export const usersAPI = {
  getAllUsers: () => api.get('/users'),
};

// ----------------- PETS API -----------------
export const petsAPI = {
  getPets: () => api.get('/pets'),
  getPetById: (id) => api.get(`/pets/${id}`),
  createPet: (petData) => api.post('/pets', petData),
  updatePet: (id, petData) => api.put(`/pets/${id}`, petData),
  deletePet: (id) => api.delete(`/pets/${id}`),
  getPetHistory: (id) => api.get(`/pets/${id}/history`),
};

// ----------------- APPOINTMENTS API -----------------
export const appointmentsAPI = {
  getAppointments: () => api.get('/appointments'),
  getAppointmentById: (id) => api.get(`/appointments/${id}`),
  createAppointment: (data) => api.post('/appointments', data),
  updateAppointment: (id, data) => api.put(`/appointments/${id}`, data),
  deleteAppointment: (id) => api.delete(`/appointments/${id}`),
  confirmAppointment: (id) => api.post(`/appointments/${id}/confirm`),
  cancelAppointment: (id) => api.post(`/appointments/${id}/cancel`),
  rescheduleAppointment: (id, data) =>
    api.post(`/appointments/${id}/reschedule`, data),
  completeAppointment: (id) => api.post(`/appointments/${id}/complete`),

};

// ----------------- DOCTORS API -----------------
export const doctorsAPI = {
  getDoctors: () => api.get('/doctors'),
  getDoctorById: (id) => api.get(`/doctors/${id}`),
  updateSettings: (settingsData) => api.put('/doctors/settings', settingsData),
};

// ----------------- REPORTS API -----------------
export const reportsAPI = {
  getReports: () => api.get('/reports'),
  getPetReports: (petId) => api.get(`/reports/pet/${petId}`),
  getReportById: (id) => api.get(`/reports/${id}`),
  createReport: (data) => api.post('/reports', data),
  updateReport: (id, data) => api.put(`/reports/${id}`, data),
  deleteReport: (id) => api.delete(`/reports/${id}`),
  downloadReportPDF: async (id) => {
    try {
      const token = sessionStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/reports/${id}/pdf`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to download PDF');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `medical-report-${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      return { success: true };
    } catch (err) {
      console.error('Error downloading PDF:', err);
      throw err;
    }
  },
};

// ----------------- CHATBOT API (Port 8000) -----------------
const chatbotApi = axios.create({
  baseURL: CHATBOT_API_BASE_URL,
  timeout: 360000,
});

export const chatbotAPI = {
  testConnection: () => chatbotApi.get('/test'),
  createNewChat: (title = 'New Chat') => chatbotApi.post('/chat/new', { title }),
  getChatSessions: () => chatbotApi.get('/chat/sessions'),
  getChatSession: (id) => chatbotApi.get(`/chat/${id}`),
  deleteChatSession: (id) => chatbotApi.delete(`/chat/${id}`),
  askQuestion: (question, sessionId = null) => {
    const fd = new FormData();
    fd.append('question', question);
    if (sessionId) fd.append('session_id', sessionId);
    return chatbotApi.post('/ask/', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  uploadPDFs: (adminKey, files) => {
    const fd = new FormData();
    fd.append('admin_key', adminKey);
    files.forEach((f) => fd.append('files', f));
    return chatbotApi.post('/admin/upload_pdfs/', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getStats: (adminKey) =>
    chatbotApi.get(`/admin/stats/?admin_key=${encodeURIComponent(adminKey)}`),
  getPDFs: (adminKey) =>
    chatbotApi.get(`/admin/pdfs/?admin_key=${encodeURIComponent(adminKey)}`),
  deletePDF: (filename, adminKey) =>
    chatbotApi.delete(
      `/admin/delete_file/?filename=${encodeURIComponent(
        filename
      )}&admin_key=${encodeURIComponent(adminKey)}`
    ),
};

export default api;
