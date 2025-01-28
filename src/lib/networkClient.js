import { BACKEND_URL } from "../utils/constants/constants";

const acceptableResponseCodes = [200, 201]

async function NetworkRequest({ urlExtension, method, headers = {}, body }) {
    try {
        //const requestBody = body ? JSON.stringify(body) : null
        
        const response = await fetch(`${BACKEND_URL}${urlExtension}`, {
            method: method,
            headers: headers,
            body: body
        });

        if (!acceptableResponseCodes.includes(response.status)) {
            console.log(response)
            let errorResponse = await response.json();
            let error = errorResponse.error;
            console.log(error)
            if (error) {
                throw(error);
            } else {
                throw(errorResponse)
            }
        }

        const data = await response.json();
        return data;
    } catch (error) {
        throw(error);
    }
}

export default NetworkRequest;