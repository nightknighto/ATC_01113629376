import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '../services/api';
import { GetMeResponse } from '@events-platform/shared';

type User = GetMeResponse;

interface AuthContextType {
    user: User | null;
    token: string | null;
    loading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadUser = async () => {
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const userData = await authAPI.getCurrentUser();
                setUser(userData);
                setError(null);
            } catch (err) {
                console.error('Failed to load user:', err);
                setUser(null);
                setToken(null);
                localStorage.removeItem('token');
                setError('Session expired. Please login again.');
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, [token]);

    const login = async (email: string, password: string) => {
        try {
            setLoading(true);
            const { user: userData, token: authToken } = await authAPI.login(email, password);
            setUser(userData);
            setToken(authToken);
            localStorage.setItem('token', authToken);
            setError(null);
        } catch (err: any) {
            console.error('Login error:', err);
            setError(err.response?.data?.error || 'Failed to login. Please check your credentials.');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const register = async (name: string, email: string, password: string) => {
        try {
            setLoading(true);
            const { user: userData, token: authToken } = await authAPI.register(name, email, password);
            setUser(userData);
            setToken(authToken);
            localStorage.setItem('token', authToken);
            setError(null);
        } catch (err: any) {
            console.error('Registration error:', err);
            setError(err.response?.data?.error || 'Failed to register. Please try again.');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
    };

    const value = {
        user,
        token,
        loading,
        error,
        login,
        register,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};