const CSV_HEADERS = ['id', 'name', 'email', 'filiere', 'grades', 'average', 'createdAt'];

// Formula-injection guard (OWASP CSV injection).
const DANGEROUS_PREFIX = /^[=+\-@\t\r]/;

const escapeCsvValue = (value) => {
  const raw = value === null || value === undefined ? '' : String(value);
  const safe = DANGEROUS_PREFIX.test(raw) ? `'${raw}` : raw;

  if (/[",\n\r]/.test(safe)) {
    return `"${safe.replace(/"/g, '""')}"`;
  }

  return safe;
};

const calcAverage = (grades) => {
  if (!Array.isArray(grades) || grades.length === 0) return 'N/A';
  return (grades.reduce((sum, grade) => sum + grade, 0) / grades.length).toFixed(2);
};

const studentsToCsv = (students = []) => {
  const rows = students.map((student) => {
    const grades = Array.isArray(student.grades) ? student.grades : [];
    const createdAt = student.createdAt ? new Date(student.createdAt).toISOString() : '';

    return [
      student._id,
      student.name,
      student.email,
      student.filiere,
      grades.join('|'),
      calcAverage(grades),
      createdAt,
    ]
      .map(escapeCsvValue)
      .join(',');
  });

  return [CSV_HEADERS.join(','), ...rows].join('\n');
};

module.exports = { CSV_HEADERS, escapeCsvValue, calcAverage, studentsToCsv };
