import { API_BASE_URL, commonHeaders, handleResponse } from './api-config';
import { CreateUserRequest, User } from '@finance/types';

/**
 * Users service for interacting with the finance-api users endpoints
 */
const usersService = {
  /**
   * Get all users
   */
  async getUsers(): Promise<User[]> {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'GET',
      headers: commonHeaders,
    });
    
    return handleResponse<User[]>(response);
  },
  
  /**
   * Create a new user
   */
  async createUser(userData: CreateUserRequest): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: commonHeaders,
      body: JSON.stringify(userData),
    });
    
    return handleResponse<User>(response);
  },
};

export default usersService;
