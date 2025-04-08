import { API_BASE_URL, commonHeaders, handleResponse } from './api-config';
import { CreateTransactionRequest, Transaction } from '@finance/types';

/**
 * Transactions service for interacting with the finance-api transactions endpoints
 */
const transactionsService = {
  /**
   * Get transactions with optional filtering by sender or receiver email
   */
  async getTransactions(senderemail?: string, receiveremail?: string): Promise<Transaction[]> {
    let url = `${API_BASE_URL}/transactions`;
    
    // Add query parameters if provided
    const params = new URLSearchParams();
    if (senderemail) params.append('senderemail', senderemail);
    if (receiveremail) params.append('receiveremail', receiveremail);
    
    const queryString = params.toString();
    if (queryString) url += `?${queryString}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: commonHeaders,
    });
    
    return handleResponse<Transaction[]>(response);
  },
  
  /**
   * Create a new transaction
   */
  async createTransaction(transactionData: CreateTransactionRequest): Promise<Transaction> {
    const response = await fetch(`${API_BASE_URL}/transactions`, {
      method: 'POST',
      headers: commonHeaders,
      body: JSON.stringify(transactionData),
    });
    
    return handleResponse<Transaction>(response);
  },
};

export default transactionsService;
