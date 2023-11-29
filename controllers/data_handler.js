const Users = require('../controllers/Users.js')
const fs = require('fs');
const path = require('path')
const dataFilePathUsers = path.join(__dirname, '../data/users.json');
const dataFilePathScoreBoard = path.join(__dirname, '../data/users.json');

let user_lsit = loadUsers();
let score_list = loadaScores();

function loadaUsers() {
    try {
        const data = fs.readFileSync(dataFilePathUsers, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error al cargar los productos desde users.json:', error);
        return [];
    }
}

function saveUsers() {
    try {
        fs.writeFileSync(dataFilePath, JSON.stringify(productsList, null, 2), 'utf8');
    } catch (error) {
        console.error('Error al guardar los productos en users.json:', error);
    }
}

function loadaScores() {
    try {
        const data = fs.readFileSync(dataFilePathScoreBoard, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error al cargar los productos desde scores.json:', error);
        return [];
    }
}

function saveScores() {
    try {
        fs.writeFileSync(dataFilePathScoreBoard, JSON.stringify(productsList, null, 2), 'utf8');
    } catch (error) {
        console.error('Error al guardar los productos en scores.json:', error);
    }
}