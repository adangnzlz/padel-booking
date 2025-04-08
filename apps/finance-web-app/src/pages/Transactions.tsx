import React from 'react'
import useTransactions from '../hooks/useTransactions'
import { Transaction } from '@finance/types'

const Transactions: React.FC = () => {
  const { transactions, loading, error, refetch } = useTransactions()

  if (loading) return <div>Loading transactions...</div>
  if (error) return <div>Error loading transactions: {error.message}</div>

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Transactions</h1>
        <button 
          onClick={refetch} 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Refresh
        </button>
      </div>

      {transactions.length === 0 ? (
        <p className="text-gray-500">No transactions found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">Sender</th>
                <th className="px-4 py-2 text-left">Receiver</th>
                <th className="px-4 py-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction: Transaction) => (
                <tr key={transaction.senderemail + transaction.receiveremail + transaction.amount} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{transaction.senderemail}</td>
                  <td className="px-4 py-2">{transaction.receiveremail}</td>
                  <td className="px-4 py-2 text-right">${transaction.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default Transactions
