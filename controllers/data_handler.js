const User = require('../controllers/Users.js'); // Importa la clase User
const fs = require('fs');
const path = require('path');

const dataFilePathUsers = path.join(__dirname, '../data/users.json');
const dataFilePathScores = path.join(__dirname, '../data/scores.json'); 

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

function highScores(score, username) {
    // Añade la puntuación y el usuario a la lista de highscores
    scoreList.push({ score, username });
    // Ordena la lista de highscores de mayor a menor puntuación
    scoreList.sort((a, b) => b.score - a.score);
    // Mantén solo los primeros 10 highscores
    scoreList = scoreList.slice(0, 10);
    saveScores(); // Guarda los cambios en el archivo scores.json
    return true;
}

function register_user(username, password, email){
    const newUser = new User(username, password, email)
    userList.push(newUser);
    saveUsers();
}

function getUserByUsername(username){
    return userList.find(function (user){
        return user.username === username;
    });
}

module.exports = {
    userList,
    scoreList,
    loadUsers,
    saveUsers,
    loadScores,
    saveScores,
    highScores
};
