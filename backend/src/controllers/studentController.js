const asyncHandler = require('../utils/asyncHandler');
const studentService = require('../services/studentService');

const getAllStudents = asyncHandler(async (req, res) => {
  const result = await studentService.listStudents({ filiere: req.query.filiere });
  res.json(result);
});

const exportStudents = asyncHandler(async (req, res) => {
  const csv = await studentService.exportStudentsCsv();

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename=students.csv');
  res.status(200).send(csv);
});

const getDeletedStudents = asyncHandler(async (req, res) => {
  const result = await studentService.listDeletedStudents();
  res.json(result);
});

const getStudentById = asyncHandler(async (req, res) => {
  const student = await studentService.getStudentById(req.params.id);
  res.json({ data: student });
});

const createStudent = asyncHandler(async (req, res) => {
  const { data, restored } = await studentService.createStudent(req.body);

  res.status(restored ? 200 : 201).json({
    message: restored
      ? 'Student restored and updated successfully'
      : 'Student created successfully',
    data,
  });
});

const updateStudent = asyncHandler(async (req, res) => {
  const student = await studentService.updateStudent(req.params.id, req.body);
  res.json({ message: 'Student updated successfully', data: student });
});

const deleteStudent = asyncHandler(async (req, res) => {
  const student = await studentService.deleteStudent(req.params.id);
  res.json({ message: 'Student deleted successfully (soft delete)', data: student });
});

const restoreStudent = asyncHandler(async (req, res) => {
  const student = await studentService.restoreStudent(req.params.id);
  res.json({ message: 'Student restored successfully', data: student });
});

module.exports = {
  getAllStudents,
  exportStudents,
  getDeletedStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  restoreStudent,
};
