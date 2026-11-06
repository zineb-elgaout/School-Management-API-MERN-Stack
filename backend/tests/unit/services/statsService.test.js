jest.mock('../../../src/repositories/studentRepository');

const studentRepository = require('../../../src/repositories/studentRepository');
const { getStats } = require('../../../src/services/statsService');

describe('statsService', () => {
  it('computes statistics from active students', async () => {
    studentRepository.findActive.mockResolvedValue([
      { filiere: 'INFO', grades: [10, 20] },
      { filiere: 'INFO', grades: [20] },
    ]);

    const stats = await getStats();

    expect(studentRepository.findActive).toHaveBeenCalledWith();
    expect(stats).toEqual({
      totalStudents: 2,
      average: 17.5,
      byFiliere: {
        INFO: { students: 2, average: 16.67, min: 10, max: 20 },
      },
    });
  });

  it('returns an empty summary when there are no active students', async () => {
    studentRepository.findActive.mockResolvedValue([]);

    await expect(getStats()).resolves.toEqual({
      totalStudents: 0,
      average: 0,
      byFiliere: {},
    });
  });

  it('propagates repository errors', async () => {
    studentRepository.findActive.mockRejectedValue(new Error('db down'));

    await expect(getStats()).rejects.toThrow('db down');
  });
});
