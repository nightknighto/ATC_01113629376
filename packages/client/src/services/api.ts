import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include the auth token in requests
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

// Auth API functions
export const authAPI = {
    login: async (email: string, password: string) => {
        const response = await api.post('/auth/login', { email, password });
        return response.data;
    },
    register: async (name: string, email: string, password: string) => {
        const response = await api.post('/auth/register', { name, email, password });
        return response.data;
    },
    getCurrentUser: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    },
};

// Events API functions
export const eventsAPI = {
    getAll: async () => {
        const response = await api.get('/events');
        return response.data;
    },
    getById: async (id: string) => {
        const response = await api.get(`/events/${id}`);
        return response.data;
    },
    create: async (eventData: any) => {
        const response = await api.post('/events', eventData);
        return response.data;
    },
    update: async (id: string, eventData: any) => {
        const response = await api.put(`/events/${id}`, eventData);
        return response.data;
    },
    delete: async (id: string) => {
        await api.delete(`/events/${id}`);
    },
    register: async (eventId: string, userId: string) => {
        const response = await api.post(`/events/${eventId}/register`, { userId });
        return response.data;
    },
    cancelRegistration: async (eventId: string, userId: string) => {
        await api.delete(`/events/${eventId}/register/${userId}`);
    },
};

// Users API functions
export const usersAPI = {
    getAll: async () => {
        const response = await api.get('/users');
        return response.data;
    },
    getById: async (id: string) => {
        const response = await api.get(`/users/${id}`);
        return response.data;
    },
    update: async (id: string, userData: any) => {
        const response = await api.put(`/users/${id}`, userData);
        return response.data;
    },
    delete: async (id: string) => {
        await api.delete(`/users/${id}`);
    },
};