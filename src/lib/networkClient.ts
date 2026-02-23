import { BACKEND_URL } from "../utils/constants/constants";

const acceptableResponseCodes = [200, 201, 202];

interface NetworkRequestParams {
    urlExtension: string;
    method: string;
    headers?: HeadersInit;
    body?: BodyInit | null;
}

export interface NetworkResponse<T> {
    status: number;
    data: T;
}

async function NetworkRequest<T>({
    urlExtension,
    method,
    headers = {},
    body,
}: NetworkRequestParams): Promise<NetworkResponse<T>> {
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
        return { status: response.status, data };
    } catch (error) {
        throw error;
    }
}

export default NetworkRequest;
