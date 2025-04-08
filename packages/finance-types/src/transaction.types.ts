/**
 * Tipos relacionados con transacciones financieras
 */

/**
 * Representa una transacción financiera completa
 */
export interface Transaction {
  id: string;
  amount: number;
  senderemail: string;
  receiveremail: string;
  timestamp: string;
}

/**
 * Datos necesarios para crear una nueva transacción
 */
export interface CreateTransactionRequest {
  senderemail: string;
  receiveremail: string;
  amount: number;
}
