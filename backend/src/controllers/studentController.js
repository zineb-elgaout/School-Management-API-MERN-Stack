const Student = require('../models/Student');

// ─── GET /students ───────────────────────────────────────
const getAllStudents = async (req, res) => {
  try {
    const filter = { isDeleted: false };

    // Filtrage par filière (query param)
    if (req.query.filiere) {
      filter.filiere = req.query.filiere.toUpperCase();
    }

    const students = await Student.find(filter).sort({ createdAt: -1 });

    res.json({
      count: students.length,
      data: students,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ─── GET /students/export ────────────────────────────────
const exportStudents = async (req, res) => {
  try {
    const students = await Student.find({ isDeleted: false });

    const headers = 'id,name,email,filiere,grades,average,createdAt\n';
    const rows = students.map((s) => {
      const avg = s.grades.length
        ? (s.grades.reduce((a, b) => a + b, 0) / s.grades.length).toFixed(2)
        : 'N/A';
      return `${s._id},${s.name},${s.email},${s.filiere},"${s.grades.join('|')}",${avg},${s.createdAt.toISOString()}`;
    });

    const csv = headers + rows.join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=students.csv');
    res.status(200).send(csv);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ─── GET /students/:id ───────────────────────────────────
const getStudentById = async (req, res) => {
  try {
    const student = await Student.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json({ data: student });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ─── POST /students ──────────────────────────────────────
const createStudent = async (req, res) => {
  try {
    const { name, email, filiere, grades } = req.body;

    const student = await Student.create({ name, email, filiere, grades });

    res.status(201).json({
      message: 'Student created successfully',
      data: student,
    });
  } catch (error) {
    // Erreur duplicate email
    if (error.code === 11000) {
      return res.status(409).json({ error: 'Email already exists' });
    }
    res.status(400).json({ error: error.message });
  }
};

// ─── PUT /students/:id ───────────────────────────────────
const updateStudent = async (req, res) => {
  try {
    const student = await Student.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      req.body,
      { new: true, runValidators: true }
    );

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json({
      message: 'Student updated successfully',
      data: student,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ─── DELETE /students/:id (soft delete) ──────────────────
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json({
      message: 'Student deleted successfully (soft delete)',
      data: student,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllStudents,
  exportStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
};