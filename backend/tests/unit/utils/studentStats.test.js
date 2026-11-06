const { calcMean, computeStats } = require('../../../src/utils/studentStats');

describe('studentStats utils', () => {
  describe('calcMean', () => {
    it('returns null for empty or non-array input', () => {
      expect(calcMean([])).toBeNull();
      expect(calcMean(null)).toBeNull();
      expect(calcMean(undefined)).toBeNull();
    });

    it('ignores invalid grades', () => {
      expect(calcMean([10, 'nope', NaN, 20])).toBe(15);
    });

    it('returns null when every grade is invalid', () => {
      expect(calcMean(['a', NaN])).toBeNull();
    });
  });

  describe('computeStats', () => {
    it('returns an empty summary when there are no students', () => {
      expect(computeStats([])).toEqual({
        totalStudents: 0,
        average: 0,
        byFiliere: {},
      });
    });

    it('computes the average of student averages', () => {
      const stats = computeStats([
        { filiere: 'INFO', grades: [10, 20] },
        { filiere: 'INFO', grades: [20] },
        { filiere: 'MATH', grades: [5, 5] },
      ]);

      expect(stats.totalStudents).toBe(3);
      expect(stats.average).toBe(13.33);
    });

    it('ignores students without grades in the global average', () => {
      const stats = computeStats([
        { filiere: 'INFO', grades: [10] },
        { filiere: 'MATH', grades: [] },
      ]);

      expect(stats.average).toBe(10);
    });

    it('computes per-filiere statistics and removes internal grades array', () => {
      const stats = computeStats([
        { filiere: 'INFO', grades: [10, 20] },
        { filiere: 'INFO', grades: [15] },
      ]);

      expect(stats.byFiliere.INFO).toEqual({
        students: 2,
        average: 15,
        min: 10,
        max: 20,
      });
      expect(stats.byFiliere.INFO.grades).toBeUndefined();
    });

    it('handles filiere groups without grades', () => {
      const stats = computeStats([{ filiere: 'ECO', grades: [] }]);

      expect(stats.byFiliere.ECO).toEqual({
        students: 1,
        average: 0,
        min: 0,
        max: 0,
      });
    });
  });
});
