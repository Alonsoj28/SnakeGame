const express = require('express');
const bcrytp = require('bcrypt');
const path = require('path');
const router = express();

router.use(express.json());

const productRouter = require('../routes/products');
const adminProductRouter = require('../routes/admin_products');

// Middleware de autenticación de administrador
const validateAdmin = (req, res, next) => {
    const headerValue = req.headers['x-auth'];
  
    let hash = bcrytp.hashSync(headerValue, 10)
    let correct_pass = bcrytp.compareSync("contrasenia", hash);
    console.log(hash)
    console.log(correct_pass)
    if (!correct_pass) {
      return res.status(403).json({ error: 'Acceso no autorizado, no se cuenta con privilegios de administrador' });
    }
    next();
  };
  
  module.exports = validateAdmin;



router.use(express.static('public', { 'extensions': ['js'] }));

router.use('/products', productRouter);
router.use('/admin', validateAdmin, adminProductRouter);


router.get('/', (req,res)=> res.sendFile(path.resolve(__dirname + "/../views/Home.html")));
router.get('/home', (req,res)=> res.sendFile(path.resolve(__dirname + "/../views/Home.html")));
router.get('/shopping_cart', (req,res)=> res.sendFile(path.resolve(__dirname + "/../views/shopping_cart.html")));



module.exports = router;
