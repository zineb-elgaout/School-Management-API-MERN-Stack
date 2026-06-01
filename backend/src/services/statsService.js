const Student = require('../models/Student');

// Calcule la moyenne d'un tableau de notes
const calcMean = (grades) => {
  if (!grades || grades.length === 0) return null;
  return grades.reduce((a, b) => a + b, 0) / grades.length;
};

const getStats = async () => {
  try {
    const students = await Student.find({ isDeleted: false });

    if (students.length === 0) {
      return { average: 0, totalStudents: 0, byFiliere: {} };
    }

    // Moyenne des moyennes individuelles
    const studentAverages = students
      .map((s) => calcMean(s.grades))
      .filter((avg) => avg !== null); // ignore les étudiants sans notes

    const average = studentAverages.length
      ? parseFloat(
          (studentAverages.reduce((a, b) => a + b, 0) / studentAverages.length).toFixed(2)
        )
      : 0;

    // Stats par filière
    const byFiliere = {};
    students.forEach((s) => {
      if (!byFiliere[s.filiere]) {
        byFiliere[s.filiere] = { students: 0, grades: [] };
      }
      byFiliere[s.filiere].students += 1;
      byFiliere[s.filiere].grades.push(...(s.grades || []));
    });

    Object.keys(byFiliere).forEach((filiere) => {
      const grades = byFiliere[filiere].grades;
      byFiliere[filiere].average = grades.length
        ? parseFloat(
            (grades.reduce((a, b) => a + b, 0) / grades.length).toFixed(2)
          )
        : 0;
      byFiliere[filiere].min = grades.length ? Math.min(...grades) : 0;
      byFiliere[filiere].max = grades.length ? Math.max(...grades) : 0;
      delete byFiliere[filiere].grades;
    });

    return {
      totalStudents: students.length,
      average,
      byFiliere,
    };

  } catch (error) {
    console.error('Stats error:', error.message);
    throw error;
  }
};

module.exports = { getStats };