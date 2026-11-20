const express = require('express');
const router = express.Router();

const {
  getAllStudents,
  exportStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  getDeletedStudents,
  restoreStudent,
} = require('../controllers/studentController');

const { authenticate, authorize } = require('../middlewares/auth');
const { studentWriteLimiter } = require('../middlewares/rateLimiter');
const jsonValidator = require('../middlewares/jsonValidator');

const adminOnly = [authenticate, authorize('admin')];

/**
 * @swagger
 * tags:
 *   name: Students
 *   description: Gestion des étudiants
 */

// ─── Routes GET fixes (AVANT /:id) ───────────────────────

/**
 * @swagger
 * /students:
 *   get:
 *     summary: Lister tous les étudiants actifs
 *     tags: [Students]
 *     parameters:
 *       - in: query
 *         name: filiere
 *         schema:
 *           type: string
 *         description: Filtrer par filière (INFO, MATH, ECO...)
 *     responses:
 *       200:
 *         description: Liste des étudiants
 */
router.get('/', getAllStudents);

/**
 * @swagger
 * /students/export:
 *   get:
 *     summary: Exporter les étudiants en CSV
 *     tags: [Students]
 *     responses:
 *       200:
 *         description: Fichier CSV téléchargé
 */
router.get('/export', exportStudents);

/**
 * @swagger
 * /students/deleted:
 *   get:
 *     summary: Lister les étudiants supprimés (corbeille)
 *     tags: [Students]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des étudiants supprimés
 */
router.get('/deleted', ...adminOnly, getDeletedStudents);

// ─── Route dynamique (APRÈS les routes fixes) ────────────

/**
 * @swagger
 * /students/{id}:
 *   get:
 *     summary: Récupérer un étudiant par ID
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Étudiant trouvé
 *       404:
 *         description: Étudiant non trouvé
 */
router.get('/:id', getStudentById);

// ─── Routes admin ─────────────────────────────────────────

/**
 * @swagger
 * /students:
 *   post:
 *     summary: Créer un nouvel étudiant
 *     tags: [Students]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Student'
 *     responses:
 *       201:
 *         description: Étudiant créé
 *       401:
 *         description: Jeton manquant ou invalide
 *       403:
 *         description: Rôle insuffisant
 *       429:
 *         description: Trop de requêtes
 */
router.post('/', studentWriteLimiter, jsonValidator, ...adminOnly, createStudent);

/**
 * @swagger
 * /students/{id}:
 *   put:
 *     summary: Modifier un étudiant
 *     tags: [Students]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Student'
 *     responses:
 *       200:
 *         description: Étudiant modifié
 *       404:
 *         description: Étudiant non trouvé
 */
router.put('/:id', jsonValidator, ...adminOnly, updateStudent);

/**
 * @swagger
 * /students/{id}/restore:
 *   patch:
 *     summary: Restaurer un étudiant supprimé
 *     tags: [Students]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Étudiant restauré
 *       404:
 *         description: Étudiant non trouvé
 */
router.patch('/:id/restore', ...adminOnly, restoreStudent);

/**
 * @swagger
 * /students/{id}:
 *   delete:
 *     summary: Supprimer un étudiant (soft delete)
 *     tags: [Students]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Étudiant supprimé (soft delete)
 *       404:
 *         description: Étudiant non trouvé
 */
router.delete('/:id', ...adminOnly, deleteStudent);

module.exports = router;