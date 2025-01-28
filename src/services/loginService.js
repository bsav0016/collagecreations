import { APPLICATION_JSON_HEADER, POST } from "../lib/networkRequestConstants";
import NetworkRequest from "../lib/networkClient";

const loginService = async (loginData) => {
    try {
        const headers = {
            ...APPLICATION_JSON_HEADER,
        };

        const data = await NetworkRequest({
            urlExtension: 'auth/',
            method: POST,
            headers: headers,
            body: loginData.jsonify(),
        });

        return data;
    } catch (error) {
        console.log(error)
        if (error.non_field_errors[0] === 'Unable to log in with provided credentials.') {
            throw(new Error('Invalid username/password'));
        }
        else {
            throw(error);
        }
    }
}

export default loginService;