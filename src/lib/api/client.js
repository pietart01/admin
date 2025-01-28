// lib/api/client.js
import axios from 'axios';

export class APIError extends Error {
    constructor(message, status, data) {
        super(message);
        this.name = 'APIError';
        this.status = status;
        this.data = data;
    }
}

export const BASE_URL = 'http://178.128.17.145:3010/admin';

let apiInstance = null;

export const createAPIClient = (config = {}) => {
    const client = axios.create({
        baseURL: BASE_URL,
        headers: {
            'Content-Type': 'application/json',
            ...config.headers,
        },
        ...config,
    });

    // Add response interceptor to handle errors consistently
    client.interceptors.response.use(
        (response) => response.data,
        (error) => {
            const message = error.response?.data?.message || error.message;
            const status = error.response?.status || 500;
            const data = error.response?.data;

            throw new APIError(message, status, data);
        }
    );

    // Add request interceptor to handle auth token
    client.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem('adminToken');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    return client;
};

// Singleton instance getter
export const getAPIClient = () => {
    if (!apiInstance) {
        apiInstance = createAPIClient();
    }
    return apiInstance;
};

// Reset client instance (useful for testing or changing configurations)
export const resetAPIClient = () => {
    apiInstance = null;
};

export default getAPIClient;
