'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export interface User {
    id: string;
    name: string;
    email: string;
    phone?: string;
    location?: string;
    avatar?: string;
    favorites?: string[];
    travelPreferences?: {
        budget?: number;
        interests?: string[];
        travelType?: string;
        preferredMonth?: string;
        setupCompleted?: boolean;
    };
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (token: string, user: User) => void;
    logout: () => void;
    updateUser: (newUser: User) => void;
    updatePreferences: (preferences: User['travelPreferences']) => Promise<void>;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Check for stored token on mount
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                // Safety check: Ensure user is an object and has required name property
                // Prevents the 'token-as-user' bug from persisting
                if (parsedUser && typeof parsedUser === 'object' && parsedUser.name) {
                    setToken(storedToken);
                    setUser(parsedUser);
                } else {
                    // State is corrupted (e.g. from the previous bug), clear it
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    setToken(null);
                    setUser(null);
                }
            } catch (err) {
                console.error("Failed to parse stored user", err);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        }
        setLoading(false);
    }, []);

    const login = (newToken: string, newUser: User) => {
        setToken(newToken);
        setUser(newUser);
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(newUser));
        // axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        router.push('/dashboard');
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // delete axios.defaults.headers.common['Authorization'];
        router.push('/');
    };

    const updateUser = (newUser: User) => {
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
    };

    const updatePreferences = async (preferences: User['travelPreferences']) => {
        try {
            if (!token) return;
            const res = await axios.put('https://dj-tours-ravels-production.up.railway.app/api/auth/preferences', preferences, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const updatedUser = { ...user, ...res.data.user, travelPreferences: preferences } as User;
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
        } catch (err) {
            console.error("Failed to update preferences", err);
            throw err;
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, updateUser, updatePreferences, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
