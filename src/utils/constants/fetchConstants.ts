import NetworkRequest from '../../lib/networkClient';
import { GET } from '../../lib/networkRequestConstants';
import type { Schema } from '../../api/types';
interface Constants {
    [key: string]: unknown;
}

let constantsLoaded: boolean = false;
let constants: Constants = {};

export const fetchConstants = async (): Promise<Constants> => {
    if (constantsLoaded) return constants;

    try {
        const response = await NetworkRequest<Schema<'Constants'>>({ urlExtension: 'api/get-constants/', method: GET });
        constants = response.data;
        constantsLoaded = true;
    } catch (error) {
        console.error('Failed to load constants:', error);
    }

    return constants;
};
