const Users = require('../controllers/Users.js')
const fs = require('fs');
const path = require('path')
const dataFilePath = path.join(__dirname, '../data/users.json');

let user_lsit = loadUsers();

function loadProducts() {
    try {
        const data = fs.readFileSync(dataFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error al cargar los productos desde products.json:', error);
        return [];
    }
}