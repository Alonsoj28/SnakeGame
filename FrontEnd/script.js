var userLoggedIn = false;
var storedUsername = null;
// Variables antes de iniciar el juego
//Empieza en modo normal por default
var selected_difficulty = 1;

function changeDifficulty(level){
    selected_difficulty = level;
    console.log(selected_difficulty);
}

var gameStarted = 0;
var keyPressed = 0;
var scoreValues = [10, 15, 20];

var currentGame;


// Variables para el sonido

var sfx = {
    move: new Howl({
        src: ['/views/MoveSnake.mp3'],
        volume: 0.4
    }),
    food: new Howl({
        src: ['/views/FoodSound.mp3'],
        volume: 0.6
    }),
    death: new Howl({
        src: ['/views/DeathSound.mp3']
    })
}

var music = {
    bg: new Howl({
        src: ['/views/Bg-music.mp3'],
        loop: true,
        autoplay: true,
        volume: 0.60
    })

}
// Variable para apagar y prender la musica.
var musicStatus = 1;



// Variables del tablero
var blockSize = 25;
var rows = 20;
var cols = 20;
var board;
var context;
var difficulty;

// Variables de Snake
var snakeX = blockSize * 5;
var snakeY = blockSize * 5;

var velocityX = 0;
var velocityY = 0;

var snakeBody = [];

var movable = false;
var score = 0;
var bodyGradient;
var headGradient;
var difficultySpeeds;

// Variables de comida
var foodX = blockSize * 10;
var foodY = blockSize * 10;

var gameOver;

window.onload = function(){
    checkSession();
    board = document.getElementById("board");
    board.height = rows * blockSize;
    board.width = cols * blockSize;
    context = board.getContext("2d");
    bodyGradient = context.createLinearGradient(0, 0, cols * blockSize, rows * blockSize);
    bodyGradient.addColorStop(0.20, "rgba(255,45,117,1)");
    bodyGradient.addColorStop(0.47, "rgba(131,35,68,1)");
    bodyGradient.addColorStop(0.59, "rgba(33,81,91,1)");
    bodyGradient.addColorStop(0.85, "rgba(79,195,220,1)");

    headGradient = context.createLinearGradient(0, 0, cols * blockSize, rows * blockSize);
    headGradient.addColorStop(0.1, "rgba(182, 149, 192, 1)"); 
    headGradient.addColorStop(0.5, "rgba(123, 65, 168, 1)");   
    headGradient.addColorStop(0.9, "rgba(53, 0, 92, 1)");   

    /*

    Color alternativo, creo que se ve demasiado llamativo

    headGradient = context.createLinearGradient(0, 0, cols * blockSize, rows * blockSize);
    headGradient.addColorStop(0.9, "rgba(255, 0, 0, 1)");   
    headGradient.addColorStop(0.6, "rgba(255, 255, 0, 1)"); 
    headGradient.addColorStop(0.3, "rgba(0, 255, 0, 1)"); 
    headGradient.addColorStop(0.1, "rgba(0, 0, 255, 1)"); 
    */
    
    for (let i = 0; i < 3; i++) {
        snakeBody.push([snakeX - i * blockSize, snakeY]);
    }
    snakeX = snakeBody[0][0];
    snakeY = snakeBody[0][1];
    placeFood();
    update();
}

function startGame(){
    let menu = document.getElementById("difficultyScreen");
    menu.style.display = 'none';
    document.addEventListener("keyup", changeDirection);
    // Easy = 1.3, Normal = 1.0, Hard = 0.6
    difficultySpeeds = [1.3, 1.0, 0.6];
    difficulty = difficultySpeeds[selected_difficulty];
    currentGame = setInterval(update, (1000/10) * difficulty); // Se actualiza el juego cada 100 milisegundos en modo normal.
    gameStarted = 1;
}

// Función para reiniciar el juego
function restartGame() {
    let gameoverScreen = document.getElementById("gameOver");
    gameoverScreen.style.display = 'none';
    let scoreLabel = document.querySelector(".scoreLabel");
    scoreLabel.textContent = "Score: 0";
    difficulty = difficultySpeeds[selected_difficulty];
    gameOver = false;
    snakeX = blockSize * 5;
    snakeY = blockSize * 5;
    velocityX = 0;
    velocityY = 0;
    snakeBody = [];
    score = 0;
    for (let i = 0; i < 3; i++) {
        snakeBody.push([snakeX - i * blockSize, snakeY]);
    }
    snakeX = snakeBody[0][0];
    snakeY = snakeBody[0][1];
    gameStarted = 1;
    keyPressed = 0;
    placeFood();
    clearInterval(currentGame);
    console.log(difficulty);
    currentGame = setInterval(update, (1000/10) * difficulty);
}


function update(){
    if (gameOver) {
        return;
    }

    movable = true;
    let currentSquare = 0;
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            if (currentSquare === 0) {
                context.fillStyle = 'black';
                context.fillRect(i * blockSize, j * blockSize, blockSize, blockSize);
                currentSquare = 1;
            } else {
                context.fillStyle = 'RGB(12, 12, 12)';
                context.fillRect(i * blockSize, j * blockSize, blockSize, blockSize);
                currentSquare = 0;
            }
        }
        currentSquare = (cols % 2 === 0) ? 1 - currentSquare : currentSquare;
    }
    
    context.fillStyle = 'red';
    context.fillRect(foodX, foodY, blockSize, blockSize);


    // Añadir puntuacion y reproducir sonido al agarrar la manzana.
    if(snakeX == foodX && snakeY == foodY){
        snakeBody.push([foodX, foodY]);
        if (musicStatus == 1) sfx.food.play();
        score += scoreValues[selected_difficulty];
        let scoreLabel = document.querySelector(".scoreLabel");
        scoreLabel.textContent = "Score: " + score;
        placeFood();
    }

    for (let i = snakeBody.length-1; i > 0; i--){
        snakeBody[i] = snakeBody[i-1];
    }
    if (snakeBody.length) {
        snakeBody[0] = [snakeX, snakeY];
    }
    
    snakeX += velocityX * blockSize;
    snakeY += velocityY * blockSize;

    // Condiciones para terminar el juego.

    // Salirse del tablero
    if (snakeX < 0 || snakeX > cols*blockSize-1 || snakeY < 0 || snakeY > rows*blockSize-1){
        gameOver = true;
        if (musicStatus == 1) sfx.death.play();
        if (selected_difficulty === 0){
            document.getElementById("easy-end").checked = true
        }else if(selected_difficulty === 1){
            document.getElementById("normal-end").checked = true
        }else{
            document.getElementById("hard-end").checked = true
        }
        let gameoverScreen = document.getElementById("gameOver");
        let endScore = document.getElementById("finalScore");
        endScore.innerHTML = "Max score: " + score;
        gameStarted = 0;
        keyPressed = 0;
        gameoverScreen.style.display = '';
    }

    // Chocar con su propio cuerpo.
    if (gameStarted == 1 && keyPressed == 1){
        for(let i = 0; i < snakeBody.length; i++){
            if (snakeX == snakeBody[i][0] && snakeY == snakeBody[i][1]){
                gameOver = true;
                if (musicStatus == 1) sfx.death.play();
                if (selected_difficulty === 0){
                    document.getElementById("easy-end").checked = true
                }else if(selected_difficulty === 1){
                    document.getElementById("normal-end").checked = true
                }else{
                    document.getElementById("hard-end").checked = true
                }     
                let gameoverScreen = document.getElementById("gameOver");
                let endScore = document.getElementById("finalScore");
                endScore.innerHTML = "Max score: " + score;
                gameStarted = 0;
                keyPressed = 0;
                gameoverScreen.style.display = '';
            }
        }
    }
    


    // Llenar cabeza
    context.fillStyle = headGradient;
    context.fillRect(snakeX, snakeY, blockSize, blockSize);

    // Llenar resto del cuerpo
    context.fillStyle = bodyGradient;
    for (let i = 0; i < snakeBody.length; i++){
        context.fillRect(snakeBody[i][0], snakeBody[i][1], blockSize, blockSize);
    }

    

}

function changeDirection(event){
    if (!movable) return;
    keyPressed = 1;
    if (event.code == 'ArrowUp' && velocityY != 1){
        movable = false
        if (velocityY != -1 && musicStatus == 1)  sfx.move.play();
        velocityX = 0;
        velocityY = -1;
        
    }else if (event.code == 'ArrowDown' && velocityY != -1){
        movable = false
        if (velocityY != 1 && musicStatus == 1) sfx.move.play();
        velocityX = 0;
        velocityY = 1;
    }else if (event.code == 'ArrowLeft' && velocityX != 1){
        movable = false
        if (velocityX != -1 && musicStatus == 1) sfx.move.play();
        velocityX = -1;
        velocityY = 0;
    }else if (event.code == 'ArrowRight' && velocityX != -1){
        movable = false
        if (velocityX != 1 && musicStatus == 1) sfx.move.play();
        velocityX = 1;
        velocityY = 0;
    }
}

function placeFood(){
    let testX = Math.floor(Math.random() * cols) * blockSize;
    let testY = Math.floor(Math.random() * rows) * blockSize;
    let noCollision = false; let cleanPlace = true;
    while (!noCollision){
        for(let i = 0; i < snakeBody.length; i++){
            if (testX == snakeBody[i][0] && testY == snakeBody[i][1]){
                cleanPlace = false;
            }
        }
        if(cleanPlace) noCollision = true
        else{
            cleanPlace = true
            console.log("detected food collision @ (" + testX + " ," + testY + "), changing places");
            testX = Math.floor(Math.random() * cols) * blockSize;
            testY = Math.floor(Math.random() * rows) * blockSize;
        } 
    }
    foodX = testX;
    foodY = testY;
}

function changeMusic(){
    if (musicStatus === 1){
        music.bg.pause();
        document.querySelector(".sound").innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
        musicStatus = 0;
    }else{
        music.bg.play();
        document.querySelector(".sound").innerHTML = '<i class="fa-solid fa-volume-high"></i>';
        musicStatus = 1;
    }

    }


function findHighScores(){
    //Hacer un get de usuarios con sus scores, ver que que lugar quedo el score actual. Si es mayor al ultimo Agregar Score con el usuario
}


function login () {
    var loginUsername = document.getElementById("email").value;
    var loginPassword = document.getElementById("password").value;
    let xhr = new XMLHttpRequest();
    xhr.open('get', '/snake/user/' + loginUsername);
    xhr.send();
    xhr.onload = function() {
        let user = xhr.response;
        if (user == ''){
            console.log("Usuario no existe");
        }else {
            user = JSON.parse(user);
            if (user.username == loginUsername && user.password == loginPassword){
                console.log("Login exitoso");
                userLoggedIn = true;
                storedUsername = loginUsername;
                checkSession();
            }else{
                console.log("Contraseña o usuario incorrecto");
            }
        }
    }
    }

    function checkSession(){
        if (userLoggedIn){
            var loginElements = document.querySelectorAll(".login_user");
            loginElements.forEach(function(element) {
                element.style.display = "none";
            });

            var btnUser = document.getElementById("LoginName");
            btnUser.textContent = storedUsername;
        }
    }

function register(event) {
    event.preventDefault();
    var registerUsername = document.getElementById("registerUsername").value;
    var registerPassword = document.getElementById("registerPassword").value;

    // Aquí debes realizar la lógica de registro en el servidor
    // Por ejemplo, puedes enviar una solicitud AJAX al servidor

    // Después del registro exitoso, puedes mostrar el juego
    document.getElementById("loginForm").style.display = "none";
    document.getElementById("registerForm").style.display = "none";
    board.style.display = "block";
}