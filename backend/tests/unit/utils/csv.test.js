const {
  CSV_HEADERS,
  escapeCsvValue,
  calcAverage,
  studentsToCsv,
} = require('../../../src/utils/csv');

describe('csv utils', () => {
  describe('escapeCsvValue', () => {
    it('returns an empty string for null and undefined', () => {
      expect(escapeCsvValue(null)).toBe('');
      expect(escapeCsvValue(undefined)).toBe('');
    });

    it('leaves simple values untouched', () => {
      expect(escapeCsvValue('Ahmed')).toBe('Ahmed');
      expect(escapeCsvValue(42)).toBe('42');
    });

    it('wraps values containing commas, quotes or newlines', () => {
      expect(escapeCsvValue('Benali, Ahmed')).toBe('"Benali, Ahmed"');
      expect(escapeCsvValue('Ahmed "The Boss"')).toBe('"Ahmed ""The Boss"""');
      expect(escapeCsvValue('line1\nline2')).toBe('"line1\nline2"');
    });

    it('neutralizes CSV formula injection', () => {
      expect(escapeCsvValue('=SUM(A1:A2)')).toBe("'=SUM(A1:A2)");
      expect(escapeCsvValue('+123')).toBe("'+123");
      expect(escapeCsvValue('-123')).toBe("'-123");
      expect(escapeCsvValue('@cmd')).toBe("'@cmd");
    });
  });

  describe('calcAverage', () => {
    it('returns N/A when there are no grades', () => {
      expect(calcAverage([])).toBe('N/A');
      expect(calcAverage(null)).toBe('N/A');
    });

    it('formats the average with two decimals', () => {
      expect(calcAverage([10, 15, 20])).toBe('15.00');
      expect(calcAverage([14.5, 16])).toBe('15.25');
    });
  });

  describe('studentsToCsv', () => {
    it('returns only the header row when there are no students', () => {
      expect(studentsToCsv([])).toBe(CSV_HEADERS.join(','));
    });

    it('serializes students with escaped values', () => {
      const csv = studentsToCsv([
        {
          _id: 'abc',
          name: 'Benali, Ahmed',
          email: 'ahmed@edunode.com',
          filiere: 'INFO',
          grades: [14, 16],
          createdAt: '2026-04-28T10:00:00.000Z',
        },
      ]);

      const lines = csv.split('\n');
      expect(lines[0]).toBe(CSV_HEADERS.join(','));
      expect(lines[1]).toBe(
        'abc,"Benali, Ahmed",ahmed@edunode.com,INFO,14|16,15.00,2026-04-28T10:00:00.000Z'
      );
    });

    it('uses N/A when a student has no grades', () => {
      const csv = studentsToCsv([
        {
          _id: 'abc',
          name: 'Sara',
          email: 'sara@edunode.com',
          filiere: 'MATH',
          grades: [],
          createdAt: '2026-04-28T10:00:00.000Z',
        },
      ]);

      expect(csv).toContain('MATH,,N/A,');
    });
  });
});
