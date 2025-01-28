class LoginDTO {
    constructor(username = '', password = '') {
        this.username = username;
        this.password = password;
    }

    updateField(fieldName, value) {
        this[fieldName] = value;
    }

    jsonify() {
        return JSON.stringify({ 
            username: this.username, 
            password: this.password 
        })
    }
}

export default LoginDTO;