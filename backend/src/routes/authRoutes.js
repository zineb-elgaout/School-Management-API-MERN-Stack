const express = require('express');

const { login, register, me } = require('../controllers/authController');
const { authenticate } = require('../middlewares/auth');
const { loginLimiter } = require('../middlewares/rateLimiter');
const jsonValidator = require('../middlewares/jsonValidator');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentification et gestion de session
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Se connecter et obtenir un jeton JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Jeton et utilisateur authentifie
 *       401:
 *         description: Identifiants invalides
 *       429:
 *         description: Trop de tentatives de connexion
 */
router.post('/login', loginLimiter, jsonValidator, login);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Recuperer l'utilisateur authentifie
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Utilisateur courant
 *       401:
 *         description: Jeton manquant ou invalide
 */
router.get('/me', authenticate, me);

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Creer un compte utilisateur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: Compte utilisateur cree
 *       409:
 *         description: Email deja utilise
 */
router.post('/register', jsonValidator, register);

module.exports = router;
