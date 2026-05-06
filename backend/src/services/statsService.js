const Student = require('../models/Student');

const getStats = async () => {
  const students = await Student.find({ isDeleted: false });

  if (students.length === 0) {
    return { average: 0, totalStudents: 0, byFiliere: {} };
  }

  // Moyenne générale
  const allGrades = students.flatMap((s) => s.grades);
  const average = allGrades.length
    ? (allGrades.reduce((a, b) => a + b, 0) / allGrades.length).toFixed(2)
    : 0;

  // Stats par filière
  const byFiliere = {};
  students.forEach((s) => {
    if (!byFiliere[s.filiere]) {
      byFiliere[s.filiere] = { students: 0, grades: [] };
    }
    byFiliere[s.filiere].students += 1;
    byFiliere[s.filiere].grades.push(...s.grades);
  });

  Object.keys(byFiliere).forEach((filiere) => {
    const grades = byFiliere[filiere].grades;
    byFiliere[filiere].average = grades.length
      ? (grades.reduce((a, b) => a + b, 0) / grades.length).toFixed(2)
      : 0;
    byFiliere[filiere].min = grades.length ? Math.min(...grades) : 0;
    byFiliere[filiere].max = grades.length ? Math.max(...grades) : 0;
    delete byFiliere[filiere].grades;
  });

  return {
    totalStudents: students.length,
    average: parseFloat(average),
    byFiliere,
  };
};

module.exports = { getStats };