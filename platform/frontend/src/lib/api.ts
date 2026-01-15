import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para adicionar token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Interceptor para tratar erros
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expirado ou inválido
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;

// Auth
export const auth = {
    signup: (data: any) => api.post('/auth/signup', data),
    login: (data: any) => api.post('/auth/login', data),
    me: () => api.get('/auth/me'),
};

// Ciclos
export const ciclos = {
    list: () => api.get('/ciclos'),
    get: (id: string) => api.get(`/ciclos/${id}`),
    inscrever: (id: string) => api.post(`/ciclos/${id}/inscrever`),
};

// Módulos
export const modulos = {
    get: (id: string) => api.get(`/modulos/${id}`),
    getAula: (moduloId: string, aulaId: string) =>
        api.get(`/modulos/${moduloId}/aulas/${aulaId}`),
};

// Progresso
export const progresso = {
    getMeu: () => api.get('/progresso'),
    getModulo: (moduloId: string) => api.get(`/progresso/modulo/${moduloId}`),
};

// Entregas
export const entregas = {
    create: (data: any) => api.post('/entregas', data),
    list: () => api.get('/entregas'),
    get: (id: string) => api.get(`/entregas/${id}`),
};

// IA
export const ia = {
    chat: (data: any) => api.post('/ia/chat', data),
};
