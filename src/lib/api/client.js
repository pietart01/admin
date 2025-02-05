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
const IS_LOCALHOST = true;

export const BASE_URL = `https://api.emp555.com/admin`;//process.env.PUBLIC_ADMIN_API_URL;//IS_LOCALHOST ? 'http://127.0.0.1:3010/admin' : `${process.env.PUBLIC_ADMIN_API_URL}`;//'http://127.0.0.1:3010/admin'
console.log('BASE_URL', BASE_URL);

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
