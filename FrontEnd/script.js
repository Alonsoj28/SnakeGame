// Variables para el login
var session = localStorage;
if (session.length === 0){
    var userLoggedIn = false;
    var storedUsername = null;
}else{
    var userLoggedIn = true;
    var storedUsername = session.getItem("user");
}

var currentPage = 1;


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
    loadHighScores();
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
        if (userLoggedIn){
            let xhr = new XMLHttpRequest();
            xhr.open('POST', '/snake/score');
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify({ 'username': session.getItem("user"), 'score': score }));
            xhr.onload = function() {
                console.log(xhr.response);
            }
        }
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
                if (userLoggedIn){
                    let xhr = new XMLHttpRequest();
                    xhr.open('POST', '/snake/score');
                    xhr.setRequestHeader('Content-Type', 'application/json');
                    xhr.send(JSON.stringify({ 'username': session.getItem("user"), 'score': score }));
                    xhr.onload = function() {
                        console.log(xhr.response);
                    }
                }
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

function login(gotUser, gotPass) {
    // Si se recibe un usuario y contraseña, se usa para iniciar sesión automáticamente
    var loginUsername = gotUser || document.getElementById("email").value;
    var loginPassword = gotPass ||  document.getElementById("password").value;
    if (loginUsername == "" || loginPassword == ""){
        return;
    }
    let xhr = new XMLHttpRequest();
    xhr.open('get', '/snake/user/' + loginUsername);
    xhr.send();
    xhr.onload = function() {
        document.getElementById("email").value = '';
        document.getElementById("password").value = '';
        let user = xhr.response;
        if (user == ''){
        }else {
            user = JSON.parse(user);
            if (user.username == loginUsername && user.password == loginPassword){
                userLoggedIn = true;
                session.setItem("user", loginUsername);
                checkSession();
            }
        }
    }
    }

    function checkSession(){

        let btnClose = document.getElementById("closeLogin");
            if (btnClose != null){
                btnClose.click();
            }

        if (userLoggedIn){
            var loginElements = document.querySelectorAll(".logged");
            loginElements.forEach(function(element) {
                element.style.display = "none";
                element.parentElement.append(element.cloneNode(true).innerHTML = '');
            });

            var btnUser = document.getElementById("LoginName");
            btnUser.innerHTML = '<i class="fa-solid fa-gamepad"></i> ' + session.getItem("user");
            btnUser.setAttribute("data-bs-target", "#Logout");

            

            if (score != 0){
                let xhr = new XMLHttpRequest();
                xhr.open('POST', '/snake/score');
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.send(JSON.stringify({ 'username': session.getItem("user"), 'score': score }));
                xhr.onload = function() {
                    console.log(xhr.response);
                }
            }

        }
    }

    function register() {
        let registerUsername = document.getElementById("registerUsername").value;
        let registerPassword = document.getElementById("registerPassword").value;
        let confirmPassword = document.getElementById("confirmPassword").value;
        let registerEmail = document.getElementById("registerEmail").value;
    
        if (registerPassword != confirmPassword){
            alert("Passwords don't match");
            return;
        }
        if (registerUsername == "" || registerPassword == "" || registerEmail == ""){return;}
    
        let xhr = new XMLHttpRequest();
    
        xhr.open('POST', '/snake/user/');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({ 'username': registerUsername, 'password': registerPassword, email: registerEmail }));
        xhr.onload = function() {
            document.getElementById("registerUsername").value  = "";
            document.getElementById("registerPassword").value = "";
            document.getElementById("confirmPassword").value = "";
            document.getElementById("registerEmail").value = "";
            console.log(xhr.status);
            if (xhr.status == 400){
                alert("Username or email already in use");
                return;
            }
            let btnClose = document.getElementById("closeRegister");
            if (btnClose != null){
                btnClose.click();
            }
            login(registerUsername, registerPassword);
        }
    }

function logout(){
    userLoggedIn = false;
    score = 0;
    session.clear();

    var btnUser = document.getElementById("LoginName");
    btnUser.innerHTML = '<i class="fa-solid fa-gamepad"></i> ' + " Login";
    btnUser.setAttribute("data-bs-target", "#login"); 

    var loginElements = document.querySelectorAll(".logged");
    loginElements.forEach(function(element) {
        element.style.display = "";
        element.parentElement.append(element.cloneNode(true).innerHTML = '');
    });
    changeScores(1);
    currentPage = 1;
}

function loadPersonalScores(){
    console.log("Loading personal scores inside function");
    let xhr = new XMLHttpRequest();
        xhr.open('GET', '/snake/user_score/' + session.getItem("user"));

        xhr.onload = function(){
            let data = xhr.response;
            let scores = JSON.parse(data);
            let scoreList = document.getElementById("leaderboardScores");
            scoreList.innerHTML = "";
            let newScore = document.createElement("li");
            newScore.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");
    
            let spanRank = document.createElement("span");
            spanRank.classList.add("fw-bold");
            spanRank.textContent = "Date Played";
            newScore.appendChild(spanRank);
    
            let spanScore = document.createElement("span");
            spanScore.classList.add("fw-bold");
            spanScore.textContent = "Score";
            newScore.appendChild(spanScore);
    
            scoreList.appendChild(newScore);
    
            for (let i = 0; i < scores.length; i++) {
                let newScore = document.createElement("li");
                newScore.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");
            
                let spanDate = document.createElement("span");
                spanDate.textContent = scores[i].date.split(" ").splice(1, 3).join("/");
                newScore.appendChild(spanDate);
            
                let spanScore = document.createElement("span");
                spanScore.classList.add("badge", "rounded-pill", "personal-badge");
                spanScore.textContent = scores[i].score;
                newScore.appendChild(spanScore);
            
                scoreList.appendChild(newScore);
            }
        }
        xhr.send();
}


function loadHighScores(){
    console.log("Loading high scores inside function");
    let xhr = new XMLHttpRequest();
    xhr.open('GET', '/snake/highScores');

    xhr.onload = function(){
        let data = xhr.response;
        let scores = JSON.parse(data);
        let scoreList = document.getElementById("leaderboardScores");
        scoreList.innerHTML = "";
        let newScore = document.createElement("li");
        newScore.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");

        let spanRank = document.createElement("span");
        spanRank.classList.add("fw-bold");
        spanRank.textContent = "Rank";
        newScore.appendChild(spanRank);

        let spanPlayer = document.createElement("span");
        spanPlayer.classList.add("fw-bold");
        spanPlayer.textContent = "Player";
        newScore.appendChild(spanPlayer);

        let spanScore = document.createElement("span");
        spanScore.classList.add("fw-bold");
        spanScore.textContent = "Score";
        newScore.appendChild(spanScore);

        scoreList.appendChild(newScore);

        for (let i = 0; i < scores.length; i++) {
            if (i === 0){
                let newScore = document.createElement("li");
                newScore.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");
            
                let spanRank = document.createElement("span");
                spanRank.innerHTML = '<i class="fa-solid fa-crown"></i>'; // Corona para el No.1 
                newScore.appendChild(spanRank);
            
                let spanPlayer = document.createElement("span");
                spanPlayer.textContent = scores[i].username; 
                newScore.appendChild(spanPlayer);
            
                let spanScore = document.createElement("span");
                spanScore.classList.add("badge", "rounded-pill", "first-place-badge"); // Badge para el No.1
                spanScore.textContent = scores[i].score; 
                newScore.appendChild(spanScore);
            
                scoreList.appendChild(newScore);
                continue;
            }

            let newScore = document.createElement("li");
            newScore.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");
        
            let spanRank = document.createElement("span");
            spanRank.textContent = i + 1; 
            newScore.appendChild(spanRank);
        
            let spanPlayer = document.createElement("span");
            spanPlayer.textContent = scores[i].username;
            newScore.appendChild(spanPlayer);
        
            let spanScore = document.createElement("span");
            spanScore.classList.add("badge", "rounded-pill", "custom-badge");
            spanScore.textContent = scores[i].score;
            newScore.appendChild(spanScore);
        
            scoreList.appendChild(newScore);
        }
    }
    xhr.send();
}


function changeScores(page){
    if (page === currentPage) return;
    else if (page === 1){
        let pagination = document.getElementById("selectorScores");
        pagination.children[1].classList.remove("active");
        pagination.children[0].classList.add("active");
        loadHighScores();
        currentPage = 1;
    }else{
        if (!userLoggedIn) return;
        let pagination = document.getElementById("selectorScores");
        pagination.children[1].classList.add("active");
        pagination.children[0].classList.remove("active");
        loadPersonalScores();
        currentPage = 2;
    }
}

function updateCurrentValues(){
    if (currentPage === 2) {
        console.log("Loading personal scores");
        loadPersonalScores();
    }
    else {
        console.log("Loading high scores");
        loadHighScores();
    }
}