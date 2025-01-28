import { BACKEND_URL } from './constants';

let constantsLoaded = false;
let constants = {};

export const fetchConstants = async () => {
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