import { BACKEND_URL } from "../utils/constants/constants";

const acceptableResponseCodes = [200, 201];

interface NetworkRequestParams {
    urlExtension: string;
    method: string;
    headers?: HeadersInit;
    body?: BodyInit | null;
}

async function NetworkRequest<T>({
    urlExtension,
    method,
    headers = {},
    body,
}: NetworkRequestParams): Promise<T> {
    try {
        const response = await fetch(`${BACKEND_URL}${urlExtension}`, {
            method: method,
            headers: headers,
            body: body,
        });

        if (!acceptableResponseCodes.includes(response.status)) {
            const errorResponse = await response.json();
            const error = errorResponse.error;
            console.error(error);
            if (error) {
                throw error;
            } else {
                throw errorResponse;
            }
        }

        const data: T = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
}

export default NetworkRequest;
