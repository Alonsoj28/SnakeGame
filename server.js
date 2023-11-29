const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


const users = [];

    //$(document).ready(function () {
        // Función para manejar el registro
       // $("#registerForm").submit(function (event) {
         //   event.preventDefault();

           // const username = $("#registerUsername").val();
            //const email = $("#registerEmail").val();
            //const password = $("#registerPassword").val();
            //const confirmPassword = $("#confirmPassword").val();

            // Verificar si todos los campos están completos
            //if (!username || !email || !password || !confirmPassword) {
              //  $("#registerMessage").html('<div class="alert alert-danger" role="alert">Por favor, completa todos los campos</div>');
                //return;
//            }

            // Verificar si las contraseñas coinciden
  //          if (password !== confirmPassword) {
    //            $("#registerMessage").html('<div class="alert alert-danger" role="alert">Las contraseñas no coinciden</div>');
      //          return;
        //    }

            // Verificar si el usuario ya existe
          //  if (users.some(user => user.username === username)) {
            //    $("#registerMessage").html('<div class="alert alert-danger" role="alert">El usuario ya existe</div>');
              //  return;
           // }
            //$.post('/api/register', { username: username, email: email, password: password }, function (response) {
              //  if (response.success) {
                //    // Registro exitoso
                  //  $("#registerMessage").html('<div class="alert alert-success" role="alert">Usuario registrado con éxito</div>');
                 //   clearRegisterForm();
               // } else {
                    // Error en el registro
                 //   $("#registerMessage").html('<div class="alert alert-danger" role="alert">' + response.message + '</div>');
              //  }
           // });
           // });

            // Crear un nuevo usuario y agregarlo a la base de datos
           // const newUser = { username, email, password, score: 0 };
            //users.push(newUser);

            // Mostrar mensaje de éxito
           // $("#registerMessage").html('<div class="alert alert-success" role="alert">Usuario registrado con éxito</div>');

            app.post('/api/register', (req, res) => {
                const { username, email, password } = req.body;
            
                // Verificar si el usuario ya existe
                if (users.some(user => user.username === username)) {
                    return res.json({ success: false, message: 'El usuario ya existe' });
                }
            
                // Crear un nuevo usuario y agregarlo a la base de datos
                const newUser = { username, email, password, score: 0 };
                users.push(newUser);
            
                // Enviar respuesta de éxito
                res.json({ success: true, message: 'Usuario registrado con éxito' });
            });

            // Limpiar campos del formulario
           // clearRegisterForm();

            // Cerrar modal de registro después de un breve retraso (opcional)
            //setTimeout(function () {
              //  $("#register").modal("hide");
            //}, 2000);
        
        

        // Función para limpiar campos del formulario de registro
     //   function clearRegisterForm() {
       //     $("#registerUsername").val('');
         //   $("#registerEmail").val('');
           // $("#registerPassword").val('');
           // $("#confirmPassword").val('');
       // }

    // Función para manejar el login
    //$("#loginForm").submit(function (event) {
    //event.preventDefault();
    //const username = $("#email").val();
    //const password = $("#password").val();
    //app.post('/api/login', (req, res) => {
      //  const { username, password } = req.body;
    
        // Verificar las credenciales del usuario
        //const user = users.find(user => user.username === username && user.password === password);
    
        //if (user) {
            // Inicio de sesión exitoso
       //     return res.json({ success: true, message: 'Inicio de sesión exitoso', user: { score: user.score } });
        //} else {
            // Error en el inicio de sesión
         //   return res.json({ success: false, message: 'Credenciales incorrectas. Por favor, verifica tu nombre de usuario y contraseña.' });
       // }
    //});
    
    app.post('/api/login', (req, res) => {
        const { username, password } = req.body;
    
        // Verificar las credenciales del usuario
        const user = users.find(user => user.username === username && user.password === password);
    
        if (user) {
            // Inicio de sesión exitoso
            return res.json({ success: true, message: 'Inicio de sesión exitoso', user: { score: user.score } });
        } else {
            // Error en el inicio de sesión
            return res.json({ success: false, message: 'Credenciales incorrectas. Por favor, verifica tu nombre de usuario y contraseña.' });
        }
    });
    
    app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
    });

// Función para limpiar campos del formulario de login
//function clearLoginForm() {
  //  $("#email").val('');
    //$("#password").val('');
//}