const express = require('express');
const path = require('path');

// Importa el router que configure en router.js
const router = require("../Proyecto_DASW/controllers/router");

const app = express();
const port = 3000;


app.use(express.json());
app.use(router);
app.use(express.static(path.join(__dirname, 'Proyecto_DASW')));
app.use('/views', express.static(path.join(__dirname, 'views')));
app.use('/FrontEnd', express.static(path.join(__dirname, 'FrontEnd')));
app.use('/controllers', express.static(path.join(__dirname, 'controllers')));





app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname + "/FrontEnd/index.html"));
  });

  app.get('/user', (req, res) => {
    res.sendFile(path.resolve(__dirname + "/FrontEnd/index.html"));
    });
  

  app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});
