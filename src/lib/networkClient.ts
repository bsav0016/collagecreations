import { BACKEND_URL } from "../utils/constants/constants";
import { parseRetryAfter, RequestRefusedError, SERVICE_BUSY, TOO_MANY_REQUESTS } from "./requestRefused";

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
            // A request refused for now (too many, or busy) is not a mistake in the request: say how long to wait.
            if (response.status === TOO_MANY_REQUESTS || response.status === SERVICE_BUSY) {
                throw new RequestRefusedError(
                    response.status,
                    parseRetryAfter(response.headers.get("Retry-After"), errorResponse),
                );
            }
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

/** For endpoints that answer with a file instead of JSON (a purchased image). Throws if the answer is not a success. */
export async function NetworkFileRequest(urlExtension: string): Promise<Blob> {
    const response = await fetch(`${BACKEND_URL}${urlExtension}`);
    if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
    }
    return response.blob();
}

export default NetworkRequest;
