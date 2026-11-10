import type { Schema } from "../../api/types";

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
        const body: Schema<"AdminLoginRequest"> = {
            username: this.username,
            password: this.password,
        };
        return JSON.stringify(body);
    }
}

export default LoginDTO;
