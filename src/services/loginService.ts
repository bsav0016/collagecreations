import { APPLICATION_JSON_HEADER, POST } from "../lib/networkRequestConstants";
import NetworkRequest from "../lib/networkClient";
import LoginDTO from "../dtos/loginDTO/loginDTO";

interface LoginCredentials {
    username: string;
    password: string;
}

interface LoginResponse {
    token: string;
}

interface LoginError {
    non_field_errors?: string[];
    [key: string]: unknown;
}

const loginService = async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
        const headers = {
            ...APPLICATION_JSON_HEADER,
        };

        const loginDTO = new LoginDTO(credentials.username, credentials.password);

        const data = await NetworkRequest({
            urlExtension: 'auth/',
            method: POST,
            headers: headers,
            body: loginDTO.jsonify(),
        });

        return data as LoginResponse;
    } catch (error) {
        const loginError = error as LoginError;
        if (loginError.non_field_errors?.[0] === 'Unable to log in with provided credentials.') {
            throw new Error('Invalid username/password');
        } else {
            throw error;
        }
    }
};

export default loginService;
