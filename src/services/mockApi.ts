import { API_DELAY } from '@/constants';

// Simulate network delay
const delay = () => {
  const ms = Math.random() * (API_DELAY.MAX - API_DELAY.MIN) + API_DELAY.MIN;
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// Simulate occasional errors (10% chance)
const shouldError = () => Math.random() < 0.1;

export const mockApiCall = async <T>(
  dataFn: () => T,
  errorMessage = 'An error occurred'
): Promise<T> => {
  await delay();
  
  if (shouldError()) {
    throw new Error(errorMessage);
  }
  
  return dataFn();
};

// Generic CRUD operations
export const mockFetch = async <T>(data: T): Promise<T> => {
  return mockApiCall(() => data, 'Failed to fetch data');
};

export const mockCreate = async <T>(data: T): Promise<T> => {
  return mockApiCall(() => data, 'Failed to create resource');
};

export const mockUpdate = async <T>(data: T): Promise<T> => {
  return mockApiCall(() => data, 'Failed to update resource');
};

export const mockDelete = async (id: string): Promise<{ id: string }> => {
  return mockApiCall(() => ({ id }), 'Failed to delete resource');
};
