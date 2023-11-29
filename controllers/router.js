const express = require('express');
const path = require('path');
const router = express();

router.use(express.json());
router.use(express.static(path.join(__dirname, 'Proyecto_DASW')));
router.use('/views', express.static(path.join(__dirname, 'views')));
router.use('/controllers', express.static(path.join(__dirname, 'controllers')));


/*
const UserRouter = require('../routes/users');
const LeaderboardRouter = require('../routes/leaderboard');


router.use(express.static('public', { 'extensions': ['js'] }));

*/
router.get('/', (req,res)=> res.sendFile(path.resolve(__dirname + "/../FrontEnd/index.html")));

module.exports = router;
