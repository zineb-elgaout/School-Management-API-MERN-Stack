const express = require('express');
const router = express.Router();
const { getStats } = require('../services/statsService');

router.get('/average', async (req, res) => {
  try {
    const stats = await getStats();
    res.json({ data: stats });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;