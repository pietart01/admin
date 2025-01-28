// lib/api/methods.js
import getAPIClient from './client';

/**
 * Makes a POST request to the API
 * @param {string} endpoint - The endpoint to send the request to (without the base URL)
 * @param {Object} data - The data to send in the request body
 * @param {Object} config - Optional axios config overrides
 * @returns {Promise<any>} The response data
 * @throws {APIError} If the request fails
 */
export const post = async (endpoint, data, config = {}) => {
    const api = getAPIClient();
    try {
        return await api.post(endpoint, data, config);
    } catch (error) {
        throw error;
    }
};

/**
 * Makes a GET request to the API
 * @param {string} endpoint - The endpoint to send the request to
 * @param {Object} config - Optional axios config overrides
 * @returns {Promise<any>} The response data
 */
export const get = async (endpoint, config = {}) => {
    const api = getAPIClient();
    try {
        return await api.get(endpoint, config);
    } catch (error) {
        throw error;
    }
};

// Add other HTTP methods as needed (PUT, DELETE, etc.)

export default {
    post,
    get,
};
