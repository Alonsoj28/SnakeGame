const User = require('../controllers/Users.js'); // Importa la clase User
const fs = require('fs');
const path = require('path');
const UserModel = require('../models/User');
const TopScoresModel = require('../models/User');

async function registerUser(username, password, email) {
    console.log("Async registering user");
    try {
        const existingUser = await UserModel.findOne({ $or: [{ username }, { email }]});
        console.log(existingUser);
        if (existingUser) {
            console.log("User already exists");
            return "El username o email ya están en uso";
        }
        console.log("Creating new user");
        const newUser = { username, password, email, gameHistory: []};
        console.log(newUser);
        const user = UserModel(newUser);
        console.log(user);
        user.save().then(() => {
            console.log("User saved");
            return 'Usuario registrado exitosamente';
        });
    } catch (error) {
        return 'Error al registrar el usuario en la base de datos';
    }
}



async function getHighScores() {
    try {
        console.log("Getting high scores");
        const data = await UserModel.find({ "Scores" : true });
        const testArr = Object.values(data);
        console.log(typeof testArr);
        console.log(testArr);
        const top10Scores = testArr[0].top10;
        console.log(top10Scores);
        return top10Scores;
    } catch (error) {
        console.log(error);
        return 'Error al obtener los highScores';
    }
}




async function getUserByUsername(username) {
    return UserModel.findOne({ username });
}
async function getUserByEmail(email) {
    return UserModel.findOne({ email });
}

async function addScore(username, score) {
    try {
        const user = await UserModel.findOne({ username });
        if (!user) {
            return 'Usuario no encontrado';
        }

        user.gameHistory.push({ date: new Date().toString(), score });
        await user.save();
        return 'Puntuación registrada exitosamente';
    } catch (error) {
        return 'Error al añadir la puntuación';
    }
}

function getUserGameHistory(username) {
    const user = getUserByUsername(username);

    if (!user) {
        return { error: 'Usuario no encontrado' };
    }

    const gameHistory = user.gameHistory.sort((a, b) => b[1] - a[1]); // Ordena el historial por puntuación de mayor a menor
    return gameHistory;
}



module.exports = {
    registerUser: registerUser,
    getUserByUsername: getUserByUsername,
    getUserGameHistory: getUserGameHistory,
    addScore: addScore,
    getHighScores: getHighScores
};
