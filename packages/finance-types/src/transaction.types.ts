export interface TransactionFilters {
  senderemail?: string;
  receiveremail?: string;
}

export interface Transaction {
  id: string;
  amount: number;
  senderemail: string;
  receiveremail: string;
}
export interface CreateTransactionRequest {
  senderemail: string;
  receiveremail: string;
  amount: number;
}
