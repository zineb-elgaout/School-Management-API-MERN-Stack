import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
});

const API_KEY = import.meta.env.VITE_API_KEY || 'edunode-secret-key-2024';

const adminHeaders = {
  'x-api-key': API_KEY,
  'Content-Type': 'application/json',
};

export const getStudents = (filiere = '') =>
  API.get(`/students${filiere ? `?filiere=${filiere}` : ''}`);

export const getDeletedStudents = () =>
  API.get('/students/deleted', { headers: { 'x-api-key': API_KEY } });

export const getStudentById = (id) =>
  API.get(`/students/${id}`);

export const createStudent = (data) =>
  API.post('/students', data, { headers: adminHeaders });

export const updateStudent = (id, data) =>
  API.put(`/students/${id}`, data, { headers: adminHeaders });

export const deleteStudent = (id) =>
  API.delete(`/students/${id}`, { headers: { 'x-api-key': API_KEY } });

export const restoreStudent = (id) =>
  API.patch(`/students/${id}/restore`, {}, { headers: { 'x-api-key': API_KEY } });

export const getStats = () =>
  API.get('/stats/average');

export const exportCSV = () =>
  API.get('/students/export', { responseType: 'blob' });