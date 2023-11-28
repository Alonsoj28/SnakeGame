const express = require('express');
const path = require('path');
const router = express();

router.use(express.json());

const UserRouter = require('../routes/users');
const LeaderboardRouter = require('../routes/leaderboard');


router.use(express.static('public', { 'extensions': ['js'] }));

router.use('/products', productRouter);
router.use('/admin', validateAdmin, adminProductRouter);


router.get('/', (req,res)=> res.sendFile(path.resolve(__dirname + "/../FrontEnd/index.html")));

module.exports = router;
