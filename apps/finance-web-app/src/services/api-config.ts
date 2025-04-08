// API configuration settings
export const API_BASE_URL = 'http://localhost:3000/api/v1';

// Common headers for API requests
export const commonHeaders = {
  'Content-Type': 'application/json',
};

// Helper function to handle API responses
export async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API error: ${response.status}`);
  }
  return response.json() as Promise<T>;
}
