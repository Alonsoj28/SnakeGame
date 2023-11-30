const express = require('express');
const path = require('path');
const router = express.Router();
const UserRouter = require(__dirname+'/../routes/User');


router.use(express.static('public', { 'extensions': ['js'] }));
router.use('/snake', UserRouter)

router.get('/', (req,res)=> res.sendFile(path.resolve(__dirname + "/../FrontEnd/index.html")));



module.exports = router;
