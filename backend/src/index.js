const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Charger les variables d'environnement
dotenv.config();

// Connexion à MongoDB
connectDB();

const app = express();

// ─── Middlewares globaux ───
app.use(cors());
app.use(express.json());

// ─── Route de test ───
app.get('/', (req, res) => {
  res.json({
    message: '🎓 EduNode API is running!',
    version: '1.0.0',
    status: 'OK',
  });
});

// ─── Gestion des erreurs 404 ───
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ─── Gestion globale des erreurs ───
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

// ─── Démarrage du serveur ───
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});