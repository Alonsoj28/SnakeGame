const express = require('express');
const router = express.Router();
const dataHandler = require('../controllers/data_handler');

// Get ScoreBoard
router.get('/highScores', (req, res) => {
    const highScores = dataHandler.getHighScores();
    res.json(highScores);
});

// Post New User
router.post('/user', (req, res) => {
    const { username, password, email } = req.body;
    const result = dataHandler.registerUser(username, password, email);
    res.json(result);
});

// Post New Score
router.post('/score', (req, res) => {
    const { username, score } = req.body;

    // Verificar si se proporcionó un username en la solicitud
    if (!username) {
        return res.status(400).json({ error: 'El campo "username" es requerido para registrar la puntuación' });
    }
    dataHandler.highScores(score, username)
    const result = dataHandler.addScore(username, score);
    res.json(result);
});

//Get GameHistory
router.get('/user_score', (req, res) => {
  const { username } = req.query;

  if (!username) {
      return res.status(400).json({ error: 'El parámetro "username" es requerido para obtener el historial de partidas' });
  }

  const userGameHistory = dataHandler.getUserGameHistory(username);
  res.json(userGameHistory);
});



module.exports = router;
