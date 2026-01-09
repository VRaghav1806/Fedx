import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
});

// Add interceptor to attach token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export const authService = {
    login: (credentials) => api.post('/auth/login', credentials),
    signup: (userData) => api.post('/auth/signup', userData),
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
};

export const caseService = {
    getAll: () => api.get('/cases'),
    getMetrics: () => api.get('/cases/metrics'),
    getById: (id) => api.get(`/cases/${id}`),
    create: (data) => api.post('/cases', data),
    update: (id, data) => api.patch(`/cases/${id}`, data),
    delete: (id) => api.delete(`/cases/${id}`),
};

export default api;
