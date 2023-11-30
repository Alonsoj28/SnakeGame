const mongoose = require('mongoose');


let userData = "mongodb+srv://juanalonso:m47GLxAVtoBUQgwY@gamedata.vvtcdyn.mongodb.net/GameData?retryWrites=true&w=majority";
let topscoresData = mongoose.createConnection("mongodb+srv://juanalonso:m47GLxAVtoBUQgwY@gamedata.vvtcdyn.mongodb.net/TopScores?retryWrites=true&w=majority");

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
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true }
});

const topScoresSchema = new mongoose.Schema({
    username: { type: String, required: true },
    score: { type: Number, required: true }
});



const UserModel = mongoose.model('Users', userSchema);
const TopScoresModel = topscoresData.model('Scores', topScoresSchema);

module.exports = UserModel;
module.exports = TopScoresModel;
