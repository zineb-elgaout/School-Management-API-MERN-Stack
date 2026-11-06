const mongoose = require('mongoose');
const studentRepository = require('../repositories/studentRepository');
const AppError = require('../errors/AppError');
const { studentsToCsv } = require('../utils/csv');

const ALLOWED_UPDATE_FIELDS = ['name', 'email', 'filiere', 'grades'];

const normalizeFiliere = (filiere) => {
  if (typeof filiere !== 'string' || filiere.trim() === '') return undefined;
  return filiere.trim().toUpperCase();
};

const normalizeEmail = (email) => {
  if (typeof email !== 'string' || email.trim() === '') {
    throw new AppError(400, 'Email is required');
  }
  return email.trim().toLowerCase();
};

const assertValidObjectId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(400, 'Invalid student id');
  }
};

const toDuplicateEmailError = (error) => {
  if (error.code === 11000) {
    return new AppError(409, 'Email already exists');
  }
  return error;
};

const sanitizeUpdates = (payload = {}) => {
  const updates = {};

  ALLOWED_UPDATE_FIELDS.forEach((field) => {
    if (payload[field] !== undefined) updates[field] = payload[field];
  });

  if (updates.email !== undefined) {
    updates.email = normalizeEmail(updates.email);
  }

  if (Object.keys(updates).length === 0) {
    throw new AppError(400, 'No valid fields to update');
  }

  return updates;
};

const listStudents = async ({ filiere } = {}) => {
  const students = await studentRepository.findActive({
    filiere: normalizeFiliere(filiere),
  });

  return { count: students.length, data: students };
};

const listDeletedStudents = async () => {
  const students = await studentRepository.findDeleted();
  return { count: students.length, data: students };
};

const getStudentById = async (id) => {
  assertValidObjectId(id);

  const student = await studentRepository.findActiveById(id);
  if (!student) {
    throw new AppError(404, 'Student not found');
  }

  return student;
};

const createStudent = async ({ name, email, filiere, grades } = {}) => {
  const normalizedEmail = normalizeEmail(email);

  const deletedStudent = await studentRepository.findDeletedByEmail(normalizedEmail);

  if (deletedStudent) {
    const restored = await studentRepository.restoreAndUpdateById(deletedStudent._id, {
      name,
      filiere,
      grades,
    });

    return { data: restored, restored: true };
  }

  try {
    const student = await studentRepository.create({
      name,
      email: normalizedEmail,
      filiere,
      grades,
    });

    return { data: student, restored: false };
  } catch (error) {
    throw toDuplicateEmailError(error);
  }
};

const updateStudent = async (id, payload) => {
  assertValidObjectId(id);
  const updates = sanitizeUpdates(payload);

  try {
    const student = await studentRepository.updateActiveById(id, updates);
    if (!student) {
      throw new AppError(404, 'Student not found');
    }

    return student;
  } catch (error) {
    throw toDuplicateEmailError(error);
  }
};

const deleteStudent = async (id) => {
  assertValidObjectId(id);

  const student = await studentRepository.softDeleteById(id);
  if (!student) {
    throw new AppError(404, 'Student not found');
  }

  return student;
};

const restoreStudent = async (id) => {
  assertValidObjectId(id);

  try {
    const student = await studentRepository.restoreById(id);
    if (!student) {
      throw new AppError(404, 'Student not found or not deleted');
    }

    return student;
  } catch (error) {
    throw toDuplicateEmailError(error);
  }
};

const exportStudentsCsv = async () => {
  const students = await studentRepository.findActive();
  return studentsToCsv(students);
};

module.exports = {
  listStudents,
  listDeletedStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  restoreStudent,
  exportStudentsCsv,
  normalizeFiliere,
  normalizeEmail,
  sanitizeUpdates,
};
