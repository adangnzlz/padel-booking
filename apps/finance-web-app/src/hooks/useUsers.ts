import { useEffect, useState } from 'react';
import { User } from '@finance/types';
import usersService from '../services/users.service';

// Cache to store the users data
let usersCache: {
  data: User[] | null;
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
 * Custom hook to fetch and cache users data
 * @param forceRefresh - Optional parameter to force a refresh of the data
 * @returns Object containing users data, loading state, and error state
 */
const useUsers = (forceRefresh = false) => {
  const [users, setUsers] = useState<User[]>(usersCache.data || []);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchUsers = async () => {
    // Don't fetch if already loading
    if (usersCache.loading) return;
    
    try {
      setLoading(true);
      usersCache.loading = true;
      
      const data = await usersService.getUsers();
      
      // Update the cache
      usersCache = {
        data,
        timestamp: Date.now(),
        loading: false,
        error: null,
      };
      
      setUsers(data);
      setError(null);
    } catch (err) {
      const fetchError = err instanceof Error ? err : new Error('Failed to fetch users');
      usersCache.error = fetchError;
      setError(fetchError);
    } finally {
      setLoading(false);
      usersCache.loading = false;
    }
  };

  useEffect(() => {
    const now = Date.now();
    const isExpired = now - usersCache.timestamp > CACHE_EXPIRATION;
    
    // Fetch data if:
    // 1. Cache is empty, or
    // 2. Cache is expired, or
    // 3. Force refresh is requested
    if (!usersCache.data || isExpired || forceRefresh) {
      fetchUsers();
    } else {
      // Use cached data
      setUsers(usersCache.data);
    }
  }, [forceRefresh]);

  return { users, loading, error, refetch: fetchUsers };
};

export default useUsers;
