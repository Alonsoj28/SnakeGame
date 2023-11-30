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
    console.log("Posting user");
    const { username, password, email } = req.body;
    console.log(username, password, email);
    dataHandler.registerUser(username, password, email).then((result) => {
        console.log("Volvio de register");
        console.log(result);
        res.send(result);
    });
});

// Post New Score
router.post('/score', (req, res) => {
    const { username, score } = req.body;

    // Verificar si se proporcionó un username en la solicitud
    if (!username) {
        return res.status(400).json({ error: 'El campo "username" es requerido para registrar la puntuación' });
    }
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

router.get('/:id', (req, res) => {
  const username = req.params.id;

  if (!username) {
      return res.status(400).json({ error: 'El parámetro "username" es requerido para obtener la información del usuario' });
  }

  const user = dataHandler.getUserByUsername(username);
  res.json(user);
});


module.exports = router;
