const express = require('express');
const { getAverageStats } = require('../controllers/statsController');

const router = express.Router();

/**
 * @swagger
 * /stats/average:
 *   get:
 *     summary: Statistiques des étudiants actifs
 *     tags: [Stats]
 *     responses:
 *       200:
 *         description: Moyenne générale et statistiques par filière
 */
router.get('/average', getAverageStats);

module.exports = router;
