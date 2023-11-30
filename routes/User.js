const express = require('express');
const router = express.Router();
const dataHandler = require('../controllers/data_handler');

// Get ScoreBoard
router.get('/highScores', (req, res) => {
    dataHandler.getHighScores().then((highScores) => {
        console.log(highScores);
        res.send(highScores);
    });
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

    dataHandler.addScore(username, score).then((result) => {
        console.log(result);
        dataHandler.updateHighScores().then((result) => {
            res.send(result);
        });
        
        
    });
});

//Get GameHistory
router.get('/user_score', (req, res) => {
  const { username } = req.query;

  if (!username) {
      return res.status(400).json({ error: 'El parámetro "username" es requerido para obtener el historial de partidas' });
  }

  dataHandler.getUserGameHistory(username).then((userGameHistory) => {
        console.log(userGameHistory);
        res.json(userGameHistory);
  });
});

router.get('/user/:id', (req, res) => {
    console.log("Getting user, id: " + req.params.id);
    const username = req.params.id;
    dataHandler.getUserByUsername(username).then((user) => {
        console.log(user);
        res.send(user);
    });
});


module.exports = router;
