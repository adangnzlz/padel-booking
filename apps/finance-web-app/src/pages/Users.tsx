import React from 'react'
import useUsers from '../hooks/useUsers';
import { RefreshCw } from 'react-feather';

const Users: React.FC = () => {
  const { users, loading, error, refetch } = useUsers();

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Users</h1>
        <button
          onClick={() => refetch()}
          className="flex items-center px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
          disabled={loading}
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </button>
      </div>
      {loading && <p>Loading users...</p>}
      {error && <p className="text-red-500">Error: {error.message}</p>}
      {!loading && !error && (
        <ul className="space-y-2">
          {users.map((user) => (
            <li key={user.id} className="p-2 border rounded hover:bg-gray-50">
              {user.name} - {user.email}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Users;
