const users = [];

    $(document).ready(function () {
        // Función para manejar el registro
        $("#registerForm").submit(function (event) {
            event.preventDefault();

            const username = $("#registerUsername").val();
            const email = $("#registerEmail").val();
            const password = $("#registerPassword").val();
            const confirmPassword = $("#confirmPassword").val();

            // Verificar si todos los campos están completos
            if (!username || !email || !password || !confirmPassword) {
                $("#registerMessage").html('<div class="alert alert-danger" role="alert">Por favor, completa todos los campos</div>');
                return;
            }

            // Verificar si las contraseñas coinciden
            if (password !== confirmPassword) {
                $("#registerMessage").html('<div class="alert alert-danger" role="alert">Las contraseñas no coinciden</div>');
                return;
            }

            // Verificar si el usuario ya existe
            if (users.some(user => user.username === username)) {
                $("#registerMessage").html('<div class="alert alert-danger" role="alert">El usuario ya existe</div>');
                return;
            }

            // Crear un nuevo usuario y agregarlo a la base de datos
            const newUser = { username, email, password, score: 0 };
            users.push(newUser);

            // Mostrar mensaje de éxito
            $("#registerMessage").html('<div class="alert alert-success" role="alert">Usuario registrado con éxito</div>');

            // Limpiar campos del formulario
            clearRegisterForm();

            // Cerrar modal de registro después de un breve retraso (opcional)
            setTimeout(function () {
                $("#register").modal("hide");
            }, 2000);
        });

        // Función para limpiar campos del formulario de registro
        function clearRegisterForm() {
            $("#registerUsername").val('');
            $("#registerEmail").val('');
            $("#registerPassword").val('');
            $("#confirmPassword").val('');
        }

        // Función para manejar el login
        $("#loginForm").submit(function (event) {
            event.preventDefault();
            const username = $("#email").val();
            const password = $("#password").val();

            // Verificar las credenciales del usuario
            const user = users.find(user => user.username === username && user.password === password);

            if (user) {
                // Mostrar mensaje de éxito
                alert('Inicio de sesión exitoso. Puntuación actual: ' + user.score);

                // Limpiar campos del formulario
                clearLoginForm();

                // Cerrar modal de login después de un breve retraso (opcional)
                setTimeout(function () {
                    $("#login").modal("hide");
                }, 2000);
            } else {
                // Mostrar mensaje de error
                $("#loginMessage").html('<div class="alert alert-danger" role="alert">Credenciales incorrectas. Por favor, verifica tu nombre de usuario y contraseña.</div>');
            }
        });

        // Función para limpiar campos del formulario de login
        function clearLoginForm() {
            $("#email").val('');
            $("#password").val('');
        }
    });
