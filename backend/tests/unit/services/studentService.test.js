jest.mock('../../../src/repositories/studentRepository');

const studentRepository = require('../../../src/repositories/studentRepository');
const studentService = require('../../../src/services/studentService');
const AppError = require('../../../src/errors/AppError');

const VALID_ID = '507f1f77bcf86cd799439011';

describe('studentService', () => {
  describe('normalize helpers', () => {
    it('uplifts and trims a filiere', () => {
      expect(studentService.normalizeFiliere(' info ')).toBe('INFO');
    });

    it('returns undefined for an empty filiere', () => {
      expect(studentService.normalizeFiliere('')).toBeUndefined();
      expect(studentService.normalizeFiliere(null)).toBeUndefined();
    });

    it('trims and lowercases an email', () => {
      expect(studentService.normalizeEmail(' Test@EDUnode.com ')).toBe('test@edunode.com');
    });

    it('rejects a missing email', () => {
      expect(() => studentService.normalizeEmail('')).toThrow(AppError);
    });
  });

  describe('listStudents', () => {
    it('normalizes the filiere filter and returns a count', async () => {
      studentRepository.findActive.mockResolvedValue([{ name: 'A' }]);

      const result = await studentService.listStudents({ filiere: ' info ' });

      expect(studentRepository.findActive).toHaveBeenCalledWith({ filiere: 'INFO' });
      expect(result).toEqual({ count: 1, data: [{ name: 'A' }] });
    });

    it('passes an undefined filter when no filiere is provided', async () => {
      studentRepository.findActive.mockResolvedValue([]);

      await studentService.listStudents();

      expect(studentRepository.findActive).toHaveBeenCalledWith({ filiere: undefined });
    });
  });

  describe('listDeletedStudents', () => {
    it('returns deleted students with a count', async () => {
      studentRepository.findDeleted.mockResolvedValue([{ name: 'B' }]);

      const result = await studentService.listDeletedStudents();

      expect(result).toEqual({ count: 1, data: [{ name: 'B' }] });
    });
  });

  describe('getStudentById', () => {
    it('rejects an invalid ObjectId before hitting the repository', async () => {
      await expect(studentService.getStudentById('not-an-id')).rejects.toMatchObject({
        statusCode: 400,
      });
      expect(studentRepository.findActiveById).not.toHaveBeenCalled();
    });

    it('throws 404 when no active student is found', async () => {
      studentRepository.findActiveById.mockResolvedValue(null);

      await expect(studentService.getStudentById(VALID_ID)).rejects.toMatchObject({
        statusCode: 404,
      });
    });

    it('returns the student when found', async () => {
      const student = { _id: VALID_ID, name: 'A' };
      studentRepository.findActiveById.mockResolvedValue(student);

      await expect(studentService.getStudentById(VALID_ID)).resolves.toBe(student);
    });
  });

  describe('createStudent', () => {
    it('rejects a missing email', async () => {
      await expect(studentService.createStudent({ name: 'A' })).rejects.toMatchObject({
        statusCode: 400,
      });
    });

    it('restores a soft-deleted student with the same email', async () => {
      const deleted = { _id: VALID_ID };
      const restored = { _id: VALID_ID, isDeleted: false };
      studentRepository.findDeletedByEmail.mockResolvedValue(deleted);
      studentRepository.restoreAndUpdateById.mockResolvedValue(restored);

      const result = await studentService.createStudent({
        name: 'Ahmed',
        email: ' AHMED@edunode.com ',
        filiere: 'INFO',
        grades: [12],
      });

      expect(studentRepository.findDeletedByEmail).toHaveBeenCalledWith('ahmed@edunode.com');
      expect(studentRepository.restoreAndUpdateById).toHaveBeenCalledWith(VALID_ID, {
        name: 'Ahmed',
        filiere: 'INFO',
        grades: [12],
      });
      expect(result).toEqual({ data: restored, restored: true });
    });

    it('creates a new student with a normalized email', async () => {
      const created = { _id: VALID_ID };
      studentRepository.findDeletedByEmail.mockResolvedValue(null);
      studentRepository.create.mockResolvedValue(created);

      const result = await studentService.createStudent({
        name: 'Ahmed',
        email: ' Ahmed@EDUnode.com ',
        filiere: 'INFO',
        grades: [12],
      });

      expect(studentRepository.create).toHaveBeenCalledWith({
        name: 'Ahmed',
        email: 'ahmed@edunode.com',
        filiere: 'INFO',
        grades: [12],
      });
      expect(result).toEqual({ data: created, restored: false });
    });

    it('maps duplicate key errors to a 409 AppError', async () => {
      studentRepository.findDeletedByEmail.mockResolvedValue(null);
      studentRepository.create.mockRejectedValue({ code: 11000 });

      await expect(
        studentService.createStudent({ name: 'A', email: 'a@b.com' })
      ).rejects.toMatchObject({ statusCode: 409, message: 'Email already exists' });
    });
  });

  describe('updateStudent', () => {
    it('rejects an invalid id', async () => {
      await expect(studentService.updateStudent('nope', { name: 'A' })).rejects.toMatchObject({
        statusCode: 400,
      });
    });

    it('rejects payloads without allowed fields', async () => {
      await expect(
        studentService.updateStudent(VALID_ID, { isDeleted: true })
      ).rejects.toMatchObject({ statusCode: 400 });
    });

    it('only forwards allow-listed fields (prevents mass assignment)', async () => {
      const updated = { _id: VALID_ID };
      studentRepository.updateActiveById.mockResolvedValue(updated);

      const result = await studentService.updateStudent(VALID_ID, {
        name: 'New',
        email: ' New@EDUnode.com ',
        isDeleted: true,
        _id: 'hacked',
      });

      expect(studentRepository.updateActiveById).toHaveBeenCalledWith(VALID_ID, {
        name: 'New',
        email: 'new@edunode.com',
      });
      expect(result).toBe(updated);
    });

    it('throws 404 when the student does not exist', async () => {
      studentRepository.updateActiveById.mockResolvedValue(null);

      await expect(
        studentService.updateStudent(VALID_ID, { name: 'New' })
      ).rejects.toMatchObject({ statusCode: 404 });
    });

    it('maps duplicate email errors to 409', async () => {
      studentRepository.updateActiveById.mockRejectedValue({ code: 11000 });

      await expect(
        studentService.updateStudent(VALID_ID, { email: 'a@b.com' })
      ).rejects.toMatchObject({ statusCode: 409 });
    });
  });

  describe('deleteStudent', () => {
    it('throws 404 when the student is not active', async () => {
      studentRepository.softDeleteById.mockResolvedValue(null);

      await expect(studentService.deleteStudent(VALID_ID)).rejects.toMatchObject({
        statusCode: 404,
      });
    });

    it('returns the soft-deleted student', async () => {
      const deleted = { _id: VALID_ID, isDeleted: true };
      studentRepository.softDeleteById.mockResolvedValue(deleted);

      await expect(studentService.deleteStudent(VALID_ID)).resolves.toBe(deleted);
    });
  });

  describe('restoreStudent', () => {
    it('throws 404 when no deleted student matches', async () => {
      studentRepository.restoreById.mockResolvedValue(null);

      await expect(studentService.restoreStudent(VALID_ID)).rejects.toMatchObject({
        statusCode: 404,
      });
    });

    it('maps duplicate email errors to 409', async () => {
      studentRepository.restoreById.mockRejectedValue({ code: 11000 });

      await expect(studentService.restoreStudent(VALID_ID)).rejects.toMatchObject({
        statusCode: 409,
      });
    });

    it('returns the restored student', async () => {
      const restored = { _id: VALID_ID, isDeleted: false };
      studentRepository.restoreById.mockResolvedValue(restored);

      await expect(studentService.restoreStudent(VALID_ID)).resolves.toBe(restored);
    });
  });

  describe('exportStudentsCsv', () => {
    it('serializes active students to CSV', async () => {
      studentRepository.findActive.mockResolvedValue([]);

      const csv = await studentService.exportStudentsCsv();

      expect(studentRepository.findActive).toHaveBeenCalledWith();
      expect(csv).toBe('id,name,email,filiere,grades,average,createdAt');
    });
  });
});
