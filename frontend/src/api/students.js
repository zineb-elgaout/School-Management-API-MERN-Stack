import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
});

const API_KEY = import.meta.env.VITE_API_KEY || 'edunode-secret-key-2024';

const adminHeaders = {
  'x-api-key': API_KEY,
  'Content-Type': 'application/json',
};

// ─── Students ────────────────────────────────────────────
export const getStudents = (filiere = '') =>
  API.get(`/students${filiere ? `?filiere=${filiere}` : ''}`);

export const getStudentById = (id) =>
  API.get(`/students/${id}`);

export const createStudent = (data) =>
  API.post('/students', data, { headers: adminHeaders });

export const updateStudent = (id, data) =>
  API.put(`/students/${id}`, data, { headers: adminHeaders });

export const deleteStudent = (id) =>
  API.delete(`/students/${id}`, { headers: { 'x-api-key': API_KEY } });

// ─── Stats ───────────────────────────────────────────────
export const getStats = () =>
  API.get('/stats/average');

// ─── Export ──────────────────────────────────────────────
export const exportCSV = () =>
  API.get('/students/export', { responseType: 'blob' });