import client from './client';

export const getStudents = (filiere = '') =>
  client.get(`/students${filiere ? `?filiere=${filiere}` : ''}`);

export const getDeletedStudents = () => client.get('/students/deleted');

export const getStudentById = (id) => client.get(`/students/${id}`);

export const createStudent = (data) => client.post('/students', data);

export const updateStudent = (id, data) => client.put(`/students/${id}`, data);

export const deleteStudent = (id) => client.delete(`/students/${id}`);

export const restoreStudent = (id) => client.patch(`/students/${id}/restore`);

export const getStats = () => client.get('/stats/average');

export const exportCSV = () => client.get('/students/export', { responseType: 'blob' });
