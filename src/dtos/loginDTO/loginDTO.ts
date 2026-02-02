class LoginDTO {
    username: string;
    password: string;

    constructor(username: string = "", password: string = "") {
        this.username = username;
        this.password = password;
    }

    updateField(fieldName: keyof LoginDTO, value: string): void {
        (this as Record<keyof LoginDTO, unknown>)[fieldName] = value;
    }

    jsonify(): string {
        return JSON.stringify({
            username: this.username,
            password: this.password,
        });
    }
}

export default LoginDTO;
