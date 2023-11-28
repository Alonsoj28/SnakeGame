const express = require('express');
const port = 3000;

// Importa el router que configuraste en router.js
const router = require('./controllers/router.js');


router.get('/', (req, res) => {
    res.send('e-commerce app práctica 3');
  });
  

router.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});
