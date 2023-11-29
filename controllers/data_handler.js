const User = require('../controllers/Users.js'); // Importa la clase User
const fs = require('fs');
const path = require('path');
const UserModel = require('../models/User');



async function registerUser(username, password, email) {
    try {
        const existingUser = await UserModel.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return { error: 'El username o email ya están en uso' };
        }

        const newUser = new UserModel({ username, password, email });
        await newUser.save();
        return { success: 'Usuario registrado exitosamente' };
    } catch (error) {
        return { error: 'Error al registrar el usuario en la base de datos' };
    }
}



async function getHighScores() {
    try {
        const allUsers = await UserModel.find({}, 'username gameHistory');
        const allScores = [];

        // Obtener todos los registros de puntuaciones de todos los usuarios
        allUsers.forEach(user => {
            user.gameHistory.forEach(score => {
                allScores.push({
                    username: user.username,
                    score: score.score
                });
            });
        });

        // Ordenar por puntaje y tomar los 10 mejores
        allScores.sort((a, b) => b.score - a.score);
        const top10Scores = allScores.slice(0, 10);

        return top10Scores;
    } catch (error) {
        return { error: 'Error al obtener los highScores' };
    }
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
            return { error: 'Usuario no encontrado' };
        }

        user.gameHistory.push({ date: new Date(), score });
        await user.save();
        return { success: 'Puntuación registrada exitosamente' };
    } catch (error) {
        return { error: 'Error al añadir la puntuación' };
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
