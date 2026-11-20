import client from './client';

export const login = (credentials) => client.post('/auth/login', credentials);

export const getCurrentUser = () => client.get('/auth/me');

export const register = (data) => client.post('/auth/register', data);
