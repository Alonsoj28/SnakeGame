const mongoose = require('mongoose');


let userData = "mongodb+srv://juanalonso:m47GLxAVtoBUQgwY@gamedata.ctzfv08.mongodb.net/";

let db = mongoose.connection;

db.on("connecting", () => {
    console.log("Conectando...");
    console.log(mongoose.connection.readyState); // State 2: Connecting...
});
db.on("connected", () => {
    console.log("Conexion exitosa!");
    console.log(mongoose.connection.readyState); // State 1: Connected...
});

mongoose.connect(userData);


const userSchema = new mongoose.Schema({
    Scores: { type: Boolean},
    top10: { type: Array},
    username: { type: String},
    password: { type: String},
    email: { type: String },
    gameHistory: [{
        date: { type: String},
        score: { type: Number},
    }]
});


const UserModel = mongoose.model('Users', userSchema);

module.exports = UserModel;
