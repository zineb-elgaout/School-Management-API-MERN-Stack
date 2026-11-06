jest.mock('../../../src/services/studentService');

const studentService = require('../../../src/services/studentService');
const controller = require('../../../src/controllers/studentController');
const AppError = require('../../../src/errors/AppError');

const makeRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  res.setHeader = jest.fn().mockReturnValue(res);
  return res;
};

describe('studentController', () => {
  it('getAllStudents returns the service payload', async () => {
    const payload = { count: 1, data: [{ name: 'A' }] };
    studentService.listStudents.mockResolvedValue(payload);
    const req = { query: { filiere: 'INFO' } };
    const res = makeRes();

    await controller.getAllStudents(req, res, jest.fn());

    expect(studentService.listStudents).toHaveBeenCalledWith({ filiere: 'INFO' });
    expect(res.json).toHaveBeenCalledWith(payload);
  });

  it('exportStudents sends CSV headers and body', async () => {
    studentService.exportStudentsCsv.mockResolvedValue('id,name\n1,A');
    const res = makeRes();

    await controller.exportStudents({ query: {} }, res, jest.fn());

    expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'text/csv; charset=utf-8');
    expect(res.setHeader).toHaveBeenCalledWith(
      'Content-Disposition',
      'attachment; filename=students.csv'
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith('id,name\n1,A');
  });

  it('getDeletedStudents returns the service payload', async () => {
    const payload = { count: 0, data: [] };
    studentService.listDeletedStudents.mockResolvedValue(payload);
    const res = makeRes();

    await controller.getDeletedStudents({}, res, jest.fn());

    expect(res.json).toHaveBeenCalledWith(payload);
  });

  it('getStudentById wraps the student in a data object', async () => {
    const student = { _id: '1', name: 'A' };
    studentService.getStudentById.mockResolvedValue(student);
    const req = { params: { id: '1' } };
    const res = makeRes();

    await controller.getStudentById(req, res, jest.fn());

    expect(studentService.getStudentById).toHaveBeenCalledWith('1');
    expect(res.json).toHaveBeenCalledWith({ data: student });
  });

  it('createStudent responds with 201 for a new student', async () => {
    const data = { _id: '1' };
    studentService.createStudent.mockResolvedValue({ data, restored: false });
    const res = makeRes();

    await controller.createStudent({ body: { name: 'A' } }, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Student created successfully',
      data,
    });
  });

  it('createStudent responds with 200 for a restored student', async () => {
    const data = { _id: '1' };
    studentService.createStudent.mockResolvedValue({ data, restored: true });
    const res = makeRes();

    await controller.createStudent({ body: { name: 'A' } }, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Student restored and updated successfully',
      data,
    });
  });

  it('updateStudent returns the updated student', async () => {
    const student = { _id: '1', name: 'B' };
    studentService.updateStudent.mockResolvedValue(student);
    const req = { params: { id: '1' }, body: { name: 'B' } };
    const res = makeRes();

    await controller.updateStudent(req, res, jest.fn());

    expect(res.json).toHaveBeenCalledWith({
      message: 'Student updated successfully',
      data: student,
    });
  });

  it('deleteStudent returns the soft-deleted student', async () => {
    const student = { _id: '1', isDeleted: true };
    studentService.deleteStudent.mockResolvedValue(student);
    const res = makeRes();

    await controller.deleteStudent({ params: { id: '1' } }, res, jest.fn());

    expect(res.json).toHaveBeenCalledWith({
      message: 'Student deleted successfully (soft delete)',
      data: student,
    });
  });

  it('restoreStudent returns the restored student', async () => {
    const student = { _id: '1', isDeleted: false };
    studentService.restoreStudent.mockResolvedValue(student);
    const res = makeRes();

    await controller.restoreStudent({ params: { id: '1' } }, res, jest.fn());

    expect(res.json).toHaveBeenCalledWith({
      message: 'Student restored successfully',
      data: student,
    });
  });

  it('forwards service errors to next()', async () => {
    const error = new AppError(404, 'Student not found');
    studentService.getStudentById.mockRejectedValue(error);
    const res = makeRes();
    const next = jest.fn();

    await controller.getStudentById({ params: { id: '1' } }, res, next);

    expect(next).toHaveBeenCalledWith(error);
    expect(res.json).not.toHaveBeenCalled();
  });
});
