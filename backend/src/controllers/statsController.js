const asyncHandler = require('../utils/asyncHandler');
const { getStats } = require('../services/statsService');

const getAverageStats = asyncHandler(async (req, res) => {
  const data = await getStats();
  res.json({ data });
});

module.exports = { getAverageStats };
