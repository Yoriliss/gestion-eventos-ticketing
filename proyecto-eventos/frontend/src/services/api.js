import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
});

// Interceptor: agrega el token JWT automaticamente si existe en localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  registrar: (nombre, email, password) => api.post('/auth/register', { nombre, email, password }),
  perfil: () => api.get('/auth/profile'),
};

export const eventoService = {
  listar: () => api.get('/eventos'),
  obtener: (id) => api.get(`/eventos/${id}`),
};

export const ticketService = {
  comprar: (evento_id) => api.post('/tickets/comprar', { evento_id }),
  misTickets: () => api.get('/tickets/mis-tickets'),
  confirmarPago: (id) => api.put(`/tickets/${id}/confirmar`),
};

export default api;
