// Variables para el sonido
var sfx = {
    move: new Howl({
        src: ['/MoveSnake.mp3'],
        volume: 0.4
    }),
    food: new Howl({
        src: ['/FoodSound.mp3'],
        volume: 0.6
    }),
    death: new Howl({
        src: ['/DeathSound.mp3']
    })
}

var music = {
    bg: new Howl({
        src: ['/Bg-music.mp3'],
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
var dificulty;

// Variables de Snake
var snakeX = blockSize * 5;
var snakeY = blockSize * 5;

var velocityX = 0;
var velocityY = 0;

var snakeBody = [];

var movable = false;
var score = 0;

// Variables de comida
var foodX = blockSize * 10;
var foodY = blockSize * 10;

var gameOver;
var gameOverScreen;

window.onload = function() {
    board = document.getElementById("board");
    board.height = rows * blockSize;
    board.width = cols * blockSize;
    context = board.getContext("2d");
    dificulty = 0.7;
    gameOverScreen = document.getElementById("gameOverScreen");

    placeFood();
    document.addEventListener("keyup", changeDirection);
    restartGame(); // Iniciar el juego al cargar la ventana
    setInterval(update, (1000 / 10) * dificulty);
}

// Función para reiniciar el juego
function restartGame() {
    // Oculta la pantalla de Game Over
    gameOverScreen.style.display = "none";

    gameOver = false;
    snakeX = blockSize * 5;
    snakeY = blockSize * 5;
    velocityX = 0;
    velocityY = 0;
    snakeBody = [];
    score = 0;
    placeFood();
}
function update(){
    if (gameOver) {
        showGameOverScreen();
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
        score += 10;
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
    
    var gradient = context.createLinearGradient(0, 0, cols * blockSize, rows * blockSize);
    gradient.addColorStop(0.20, "rgba(255,45,117,1)");
    gradient.addColorStop(0.47, "rgba(131,35,68,1)");
    gradient.addColorStop(0.59, "rgba(33,81,91,1)");
    gradient.addColorStop(0.85, "rgba(79,195,220,1)");

    context.fillStyle = gradient;
    snakeX += velocityX * blockSize;
    snakeY += velocityY * blockSize;

    // Condiciones para terminar el juego.

    // Salirse del tablero
    if (snakeX < 0 || snakeX > cols*blockSize-1 || snakeY < 0 || snakeY > rows*blockSize-1){
        gameOver = true;
        if (musicStatus == 1) sfx.death.play();
        //alert("Game Over!!");
    }

    // Chocar con su propio cuerpo.
    for(let i = 0; i < snakeBody.length; i++){
        if (snakeX == snakeBody[i][0] && snakeY == snakeBody[i][1]){
            gameOver = true;
            if (musicStatus == 1) sfx.death.play();
            //alert("Game Over!!");
        }
    }


    context.fillRect(snakeX, snakeY, blockSize, blockSize);
    for (let i = 0; i < snakeBody.length; i++){
        context.fillRect(snakeBody[i][0], snakeBody[i][1], blockSize, blockSize);
    }

    

}
function endGame() {
    gameOver = true;
    if (musicStatus == 1) sfx.death.play();
    
    // Mostrar la pantalla de "Game Over" y actualizar la puntuación final
    document.getElementById("gameOverScreen").style.display = "block";
    document.getElementById("finalScore").textContent = score;
}
function showGameOverScreen() {
    // Configura el contenido de la pantalla de Game Over
    var finalScoreElement = document.getElementById("finalScore");
    finalScoreElement.textContent = score;

    // Muestra la pantalla de Game Over
    gameOverScreen.style.display = "block";
}

function changeDirection(event){
    if (gameOver || !movable) return;
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

function restartGameFromGameOver() {
    // Oculta la pantalla de Game Over
    gameOverScreen.style.display = "none";

    // Reinicia el juego
    restartGame();
}
function placeFood(){
    foodX = Math.floor(Math.random() * cols) * blockSize;
    foodY = Math.floor(Math.random() * rows) * blockSize;
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
    function login(event) {
        event.preventDefault();
        var loginUsername = document.getElementById("loginUsername").value;
        var loginPassword = document.getElementById("loginPassword").value;
    
        if (loginUsername === "" || loginPassword === "") {
            // Mostrar un mensaje de error
            document.getElementById("loginError").textContent = "Por favor, completa ambos campos.";
        } else {
            // Aquí debes realizar la lógica de autenticación en el servidor
            // Por ejemplo, puedes enviar una solicitud AJAX al servidor
    
            // Después de la autenticación exitosa, puedes mostrar el juego
            document.getElementById("loginForm").style.display = "none";
            document.getElementById("registerForm").style.display = "none";
            board.style.display = "block";
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