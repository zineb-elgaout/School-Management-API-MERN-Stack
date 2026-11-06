const studentRepository = require('../repositories/studentRepository');
const { computeStats } = require('../utils/studentStats');

const getStats = async () => {
  const students = await studentRepository.findActive();
  return computeStats(students);
};

module.exports = { getStats };
