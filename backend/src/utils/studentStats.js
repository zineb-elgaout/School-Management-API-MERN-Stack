const round2 = (value) => Number.parseFloat(value.toFixed(2));

const calcMean = (grades) => {
  if (!Array.isArray(grades) || grades.length === 0) return null;

  const validGrades = grades.filter(
    (grade) => typeof grade === 'number' && Number.isFinite(grade)
  );

  if (validGrades.length === 0) return null;

  return validGrades.reduce((sum, grade) => sum + grade, 0) / validGrades.length;
};

const computeStats = (students = []) => {
  if (students.length === 0) {
    return { totalStudents: 0, average: 0, byFiliere: {} };
  }

  const studentAverages = students
    .map((student) => calcMean(student.grades))
    .filter((average) => average !== null);

  const average = studentAverages.length
    ? round2(
        studentAverages.reduce((sum, value) => sum + value, 0) / studentAverages.length
      )
    : 0;

  const byFiliere = {};

  students.forEach((student) => {
    if (!byFiliere[student.filiere]) {
      byFiliere[student.filiere] = { students: 0, grades: [] };
    }
    byFiliere[student.filiere].students += 1;
    byFiliere[student.filiere].grades.push(
      ...(Array.isArray(student.grades) ? student.grades : [])
    );
  });

  Object.keys(byFiliere).forEach((filiere) => {
    const { grades } = byFiliere[filiere];
    byFiliere[filiere].average = grades.length
      ? round2(grades.reduce((sum, grade) => sum + grade, 0) / grades.length)
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
};

module.exports = { calcMean, computeStats };
