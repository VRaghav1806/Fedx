import axios from 'axios';

const API_BASE_URL = '/api/';

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

// Add interceptor to handle common errors (like 401 Unauthorized)
api.interceptors.response.use((response) => {
    return response;
}, (error) => {
    if (error.response?.status === 401) {
        console.warn('Authentication session expired or invalid. Clearing tokens.');
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        // Optionally redirect to login page if window is available
        if (typeof window !== 'undefined') {
            window.location.href = '/login';
        }
    }
    return Promise.reject(error);
});

export const authService = {
    login: (credentials) => api.post('/auth/login', credentials),
    signup: (userData) => api.post('/auth/signup', userData),
    updateProfile: (data) => api.patch('/auth/profile', data),
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
