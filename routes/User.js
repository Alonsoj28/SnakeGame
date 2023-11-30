const express = require('express');
const router = express.Router();
const dataHandler = require('../controllers/data_handler');

// Get ScoreBoard
router.get('/highScores', (req, res) => {
    dataHandler.getHighScores().then((highScores) => {
        console.log(highScores);
        res.json(highScores);
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
        if (result === true) {
            return res.send(result);
        }else{
            res.status(400).send('El username o email ya están en uso');
        }
    });
});

// Post New Score
router.post('/score', (req, res) => {
    const { username, score } = req.body;

    dataHandler.addScore(username, score)
        .then(addScoreResult => {
            console.log(addScoreResult);

            if (addScoreResult === 'Error al añadir la puntuación') {
                return res.send(addScoreResult);
            }

            console.log("Actualizar Highscores");
            dataHandler.updateHighScores(username, score)
                .then(updateHighScoresResult => {
                    console.log(updateHighScoresResult);
                    res.send(updateHighScoresResult);
                })
                .catch((error) => {
                    res.status(500).send('Error al actualizar highscores' );
                });
        })
        .catch(error => {
            res.status(500).send( 'Error al procesar la puntuación' );
        });
});



//Get GameHistory
router.get('/user_score/:id', (req, res) => {
    console.log("Getting user game history, id: " + req.params.id);
    const username = req.params.id;
    console.log(username);

    if (!username) {
        return res.status(400).json({ error: 'El parámetro "username" es requerido para obtener el historial de partidas' });
    }

    dataHandler.getUserGameHistory(username).then((userGameHistory) => {
            console.log(userGameHistory);
            res.send(userGameHistory);
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
