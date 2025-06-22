import axios from 'axios';

const API_URL = 'http://localhost:8080/api';


const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});


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

export const analyzeResume = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await axios.post(`${API_URL}/analyze`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to analyze resume');
    }
};

export const getUserAnalyses = async () => {
    try {
        const response = await axios.get(`${API_URL}/analyses`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch analyses');
    }
};

export const getAnalysis = async (id) => {
    try {
        const response = await api.get(`/analyses/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
}; 