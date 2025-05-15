import { AdminCreateEventRequest, AdminCreateEventResponse, AdminDeleteEventResponse, AdminUpdateEventRequest, AdminUpdateEventResponse, CancelRegistrationResponse, CreateEventRequest, CreateEventResponse, GetAllEventsResponse, GetAllUsersResponse, GetEventByIdResponse, GetMeResponse, GetUserByIdResponse, LoginRequest, LoginResponse, RegisterForEventRequest, RegisterForEventResponse, RegisterRequest, RegisterResponse, UpdateEventRequest, UpdateEventResponse, UpdateUserRequest, UpdateUserResponse } from '@events-platform/shared';
import axios, { AxiosResponse } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

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
        const response = await api.post<LoginResponse, AxiosResponse<LoginResponse>, LoginRequest>('/auth/login', { email, password });
        return response.data;
    },
    register: async (name: string, email: string, password: string) => {
        const response = await api.post<RegisterResponse, AxiosResponse<RegisterResponse>, RegisterRequest>('/auth/register', { name, email, password });
        return response.data;
    },
    getCurrentUser: async () => {
        const response = await api.get<GetMeResponse>('/auth/me');
        return response.data;
    },
};

// Events API functions
export const eventsAPI = {
    getAll: async () => {
        const response = await api.get<GetAllEventsResponse>('/events');
        return response.data;
    },
    getById: async (id: string) => {
        const response = await api.get<GetEventByIdResponse>(`/events/${id}`);
        return response.data;
    },
    register: async (eventId: string, userId: string) => {
        const response = await api.post<RegisterForEventResponse, AxiosResponse<RegisterForEventResponse>, RegisterForEventRequest>(`/events/${eventId}/register`, { userId });
        return response.data;
    },
    cancelRegistration: async (eventId: string, userId: string) => {
        await api.delete<CancelRegistrationResponse>(`/events/${eventId}/register/${userId}`);
    },
};

export const adminAPI = {
    createEvent: async (eventData: AdminCreateEventRequest) => {
        // Always send date as ISO string
        const payload = { ...eventData, date: new Date(eventData.date).toISOString() };
        const response = await api.post<AdminCreateEventResponse, AxiosResponse<AdminCreateEventResponse>, AdminCreateEventRequest>('/admin/events', payload);
        return response.data;
    },
    updateEvent: async (id: string, eventData: AdminUpdateEventRequest) => {
        // Only send date as ISO string if present
        const payload = { ...eventData };
        // @ts-ignore
        if (payload.date) payload.date = new Date(payload.date).toISOString();
        const response = await api.put<AdminUpdateEventResponse, AxiosResponse<AdminUpdateEventResponse>, AdminUpdateEventRequest>(`/admin/events/${id}`, payload);
        return response.data;
    },
    deleteEvent: async (id: string) => {
        await api.delete<AdminDeleteEventResponse>(`/admin/events/${id}`);
    },
}

// Users API functions
export const usersAPI = {
    getAll: async () => {
        const response = await api.get<GetAllUsersResponse>('/users');
        return response.data;
    },
    getById: async (id: string) => {
        const response = await api.get<GetUserByIdResponse>(`/users/${id}`);
        return response.data;
    },
    update: async (id: string, userData: any) => {
        const response = await api.put<UpdateUserResponse, AxiosResponse<UpdateUserResponse>, UpdateUserRequest>(`/users/${id}`, userData);
        return response.data;
    },
    delete: async (id: string) => {
        await api.delete(`/users/${id}`);
    },
};