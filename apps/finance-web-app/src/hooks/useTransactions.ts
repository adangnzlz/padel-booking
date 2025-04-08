import { useEffect, useState } from 'react';
import { Transaction } from '@finance/types';
import transactionsService from '../services/transactions.service';

// Cache to store the transactions data
let transactionsCache: {
  data: Transaction[] | null;
  timestamp: number;
  loading: boolean;
  error: Error | null;
} = {
  data: null,
  timestamp: 0,
  loading: false,
  error: null,
};

// Cache expiration time in milliseconds (e.g., 5 minutes)
const CACHE_EXPIRATION = 5 * 60 * 1000;

/**
 * Custom hook to fetch and cache transactions data
 * @param forceRefresh - Optional parameter to force a refresh of the data
 * @returns Object containing transactions data, loading state, and error state
 */
const useTransactions = (forceRefresh = false) => {
  const [transactions, setTransactions] = useState<Transaction[]>(transactionsCache.data || []);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchTransactions = async () => {
    // Don't fetch if already loading
    if (transactionsCache.loading) return;
    
    try {
      setLoading(true);
      transactionsCache.loading = true;
      
      const data = await transactionsService.getTransactions();
      
      // Update the cache
      transactionsCache = {
        data,
        timestamp: Date.now(),
        loading: false,
        error: null,
      };
      
      setTransactions(data);
      setError(null);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch transactions');
      
      // Update the cache with error
      transactionsCache = {
        ...transactionsCache,
        loading: false,
        error,
      };
      
      setError(error);
    } finally {
      setLoading(false);
      transactionsCache.loading = false;
    }
  };

  useEffect(() => {
    // Fetch if no cached data, cache is expired, or force refresh is true
    const shouldFetch = 
      !transactionsCache.data || 
      (Date.now() - transactionsCache.timestamp > CACHE_EXPIRATION) || 
      forceRefresh;

    if (shouldFetch) {
      fetchTransactions();
    }
  }, [forceRefresh]);

  return { transactions, loading, error, refetch: fetchTransactions };
};

export default useTransactions;
