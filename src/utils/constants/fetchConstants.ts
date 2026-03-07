import { BACKEND_URL } from './constants';

interface Constants {
    [key: string]: unknown;
}

let constantsLoaded: boolean = false;
let constants: Constants = {};

export const fetchConstants = async (): Promise<Constants> => {
    if (constantsLoaded) return constants;

    try {
        const response = await fetch(`${BACKEND_URL}api/get-constants/`, {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error(`Network request failed with status ${response.status}: ${response.statusText}`);
        }

        constants = await response.json();
        constantsLoaded = true;
    } catch (error) {
        console.error('Failed to load constants:', error);
    }

    return constants;
};
