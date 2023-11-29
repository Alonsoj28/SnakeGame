const User = require('../controllers/Users.js'); // Importa la clase User
const fs = require('fs');
const path = require('path');

const dataFilePathUsers = path.join(__dirname, '../data/users.json');
const dataFilePathScores = path.join(__dirname, '../data/scoreboeard.json'); 

let userList = loadUsers();
let scoreList = loadScores();

function loadUsers() {
    try {
        const data = fs.readFileSync(dataFilePathUsers, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error al cargar los usuarios desde users.json:', error);
        return [];
    }
}

function saveUsers() {
    try {
        fs.writeFileSync(dataFilePathUsers, JSON.stringify(userList, null, 2), 'utf8');
    } catch (error) {
        console.error('Error al guardar los usuarios en users.json:', error);
    }
}

function loadScores() {
    try {
        const data = fs.readFileSync(dataFilePathScores, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error al cargar los puntajes desde scores.json:', error);
        return [];
    }
}

function saveScores() {
    try {
        fs.writeFileSync(dataFilePathScores, JSON.stringify(scoreList, null, 2), 'utf8');
    } catch (error) {
        console.error('Error al guardar los puntajes en scores.json:', error);
    }
}

function getHighScores()
{
    return scoreList;
}

function highScores(score, username) {
    // Añade la puntuación y el usuario a la lista de highscores
    scoreList.push({ score, username });
    // Ordena la lista de highscores de mayor a menor puntuación
    scoreList.sort((a, b) => b.score - a.score);
    // Mantén solo los primeros 10 highscores
    scoreList = scoreList.slice(0, 10);
    saveScores(); // Guarda los cambios en el archivo scores.json
    return scoreList;

}

function registerUser(username, password, email) {
    // Verificar si el usuario o el email ya existen
    const existingUser = getUserByUsername(username);
    const existingEmail = getUserByEmail(email);

    if (existingUser || existingEmail) {
        return { error: 'El username o email ya están en uso' };
    }

    const newUser = new User(username, password, email);
    userList.push(newUser);
    saveUsers();
    return { success: 'Usuario registrado exitosamente' };
}

function getUserByUsername(username){
    return userList.find(function (user){
        return user.username === username;
    });
}
function getUserByEmail(email){
    return userList.find(function (user){
        return user.email === email;
    });
}

function addScore(username, score) {
    const user = getUserByUsername(username);

    if (!user) {
        return { error: 'Usuario no encontrado' };
    }

    user.addToGameHistory(new Date().toISOString(), score);
    saveUsers();

    return { success: 'Puntuación registrada exitosamente' };
}
function getUserGameHistory(username) {
    const user = getUserByUsername(username);

    if (!user) {
        return { error: 'Usuario no encontrado' };
    }

    const gameHistory = user.gameHistory.sort((a, b) => b[1] - a[1]); // Ordena el historial por puntuación de mayor a menor
    return gameHistory;
}

loadUsers()
console.table(userList);
console.log(getUserByUsername("user1"));


module.exports = {
    registerUser: registerUser,
    getUserByUsername: getUserByUsername,
    highScores: highScores,
    getUserGameHistory: getUserGameHistory,
    addScore: addScore,
    getHighScores: getHighScores
};
