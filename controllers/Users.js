class User {
    static userProperties = [
        "username",
        "password",
        "email",
        "gameHistory"
    ];

    constructor(username, password, email) {
        this.username = this.validateString(username);
        this.password = this.validateString(password); 
        this.email = this.validateString(email);
        this.gameHistory = [];
    }

    static createFromJson(jsonValue){
        const data = JSON.parse(jsonValue);
        const user = new User(
            data.username,
            data.password,
            data.email
        );

        if ('gameHistory' in data) {
            user.gameHistory = data.gameHistory;
        }

        return user;
    }

    static createFromObject(obj){
        let cleanObj = User.cleanObject(obj);

        const user = new User(
            cleanObj.username,
            cleanObj.password,
            cleanObj.email
        );

        if ('gameHistory' in cleanObj) {
            user.gameHistory = cleanObj.gameHistory;
        }

        return user;
    }

    static cleanObject(obj){
        let cleanObj = {};
        for(const propertyName of User.userProperties){
            if(propertyName in obj){
                cleanObj[propertyName] = obj[propertyName];
            }else{
                throw new UserException("Al objeto le faltan propiedades para construir el usuario");
            }
        }
        return cleanObj;
    }

    validateString(value) {
        if (typeof value !== 'string' || value.trim() === '') {
            throw new UserException("Este campo no puede estar vacío o no es una cadena válida.");
        }
        return value;
    }

    setPassword(password) {
        this.password = this.validateString(password); // Idealmente, el hash de la contraseña debería realizarse aquí
    }

    setEmail(email) {
        this.email = this.validateString(email);
    }

    getUsername() {
        return this.username;
    }

    setUsername(username) {
        this.username = this.validateString(username);
    }

    getEmail() {
        return this.email;
    }

    addGameToHistory(gameDate, score) {
        this.gameHistory.push([gameDate, score]);
    }

    getGameHistory() {
        return this.gameHistory;
    }

    getInfo() {
        return `Username: ${this.username}, Email: ${this.email}`;
    }
}

class UserException {
    constructor(errorMessage) {
        this.errorMessage = errorMessage;
    }
}

module.exports = User;
