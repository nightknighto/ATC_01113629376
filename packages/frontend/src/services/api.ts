import type {
    AdminCreateEventRequest,
    AdminCreateEventResponse,
    AdminDeleteEventResponse,
    AdminGetAllEventsResponse,
    AdminUpdateEventRequest,
    AdminUpdateEventResponse,
    CancelRegistrationResponse,
    GetAllEventsResponse,
    GetEventByIdResponse,
    GetEventRegistrationsResponse,
    GetMeResponse,
    LoginRequest,
    LoginResponse,
    RegisterForEventResponse,
    RegisterRequest,
    RegisterResponse,
} from '@events-platform/shared';
import axios, { type AxiosResponse } from 'axios';

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
    },
);

// Auth API functions
export const authAPI = {
    login: async (email: string, password: string) => {
        const response = await api.post<LoginResponse, AxiosResponse<LoginResponse>, LoginRequest>(
            '/auth/login',
            { email, password },
        );
        return response.data;
    },
    register: async (name: string, email: string, password: string) => {
        const response = await api.post<
            RegisterResponse,
            AxiosResponse<RegisterResponse>,
            RegisterRequest
        >('/auth/register', { name, email, password });
        return response.data;
    },
    getCurrentUser: async () => {
        const response = await api.get<GetMeResponse>('/auth/me');
        return response.data;
    },
};

// Events API functions
export const eventsAPI = {
    getAll: async (page = 1, limit = 10, search?: string) => {
        const params = new URLSearchParams();
        params.set('page', String(page));
        params.set('limit', String(limit));
        if (search) params.set('search', search);
        const response = await api.get<GetAllEventsResponse>(`/events?${params.toString()}`);
        return response.data;
    },
    getById: async (id: string) => {
        const response = await api.get<GetEventByIdResponse>(`/events/${id}`);
        return response.data;
    },
    register: async (eventId: string, userId: string) => {
        const response = await api.post<RegisterForEventResponse>(`/events/${eventId}/register`);
        return response.data;
    },
    cancelRegistration: async (eventId: string, userId: string) => {
        await api.delete<CancelRegistrationResponse>(`/events/${eventId}/register`);
    },
    getEventRegistrations: async (eventId: string, page = 1, limit = 10) => {
        const response = await api.get<GetEventRegistrationsResponse>(
            `/events/${eventId}/registrations?page=${page}&limit=${limit}`,
        );
        return response.data;
    },
};

export const adminAPI = {
    createEvent: async (eventData: AdminCreateEventRequest) => {
        // Always send JSON for event creation (no image)
        const payload = {
            ...eventData,
            date: new Date(eventData.date).toISOString(),
        };
        const response = await api.post<
            AdminCreateEventResponse,
            AxiosResponse<AdminCreateEventResponse>,
            AdminCreateEventRequest
        >('/admin/events', payload);
        return response.data;
    },
    updateEvent: async (id: string, eventData: AdminUpdateEventRequest) => {
        // Only send date as ISO string if present
        const payload = { ...eventData };
        // @ts-ignore
        if (payload.date) payload.date = new Date(payload.date).toISOString();
        const response = await api.put<
            AdminUpdateEventResponse,
            AxiosResponse<AdminUpdateEventResponse>,
            AdminUpdateEventRequest
        >(`/admin/events/${id}`, payload);
        return response.data;
    },
    deleteEvent: async (id: string) => {
        await api.delete<AdminDeleteEventResponse>(`/admin/events/${id}`);
    },
    uploadEventImage: async (eventId: string, imageFile: File) => {
        const formData = new FormData();
        formData.append('image', imageFile);
        const response = await api.post<{ image: string }>(
            `/admin/events/${eventId}/image`,
            formData,
            {
                headers: { 'Content-Type': 'multipart/form-data' },
            },
        );
        return response.data;
    },
    getAll: async (page = 1, limit = 10, search?: string) => {
        const params = new URLSearchParams();
        params.set('page', String(page));
        params.set('limit', String(limit));
        if (search) params.set('search', search);
        const response = await api.get<AdminGetAllEventsResponse>(
            `/admin/events?${params.toString()}`,
        );
        return response.data;
    },
};
