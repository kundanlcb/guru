/**
 * Axios HTTP Client
 * Centralized API client with request/response interceptors and AsyncStorage support
 */

import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API_CONFIG from './config';

// Create axios instance
export const apiClient = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor: Add auth token to headers
apiClient.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        // Get JWT token from AsyncStorage
        try {
            const token = await AsyncStorage.getItem('authToken');
            if (token && config.headers) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (error) {
            console.error('Error reading auth token', error);
        }

        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

// Response interceptor: Handle errors globally
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error: AxiosError) => {
        // Handle 401 Unauthorized - token expired
        if (error.response?.status === 401) {
            try {
                await AsyncStorage.multiRemove(['authToken', 'user']);
                // Navigate to login? With React Navigation, we might need a navigation ref service or event emitter
                // For now, we rely on state management (zustand) to clear user and trigger re-render
            } catch (e) {
                console.error('Error clearing auth token', e);
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;
