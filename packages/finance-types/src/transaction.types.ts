/**
 * Tipos relacionados con transacciones financieras
 */

/**
 * Representa una transacción financiera completa
 */
export interface Transaction {
  id: string;
  amount: number;
  senderEmail: string;
  receiverEmail: string;
  timestamp: string;
}

/**
 * Datos necesarios para crear una nueva transacción
 */
export interface CreateTransactionRequest {
  senderEmail: string;
  receiverEmail: string;
  amount: number;
}
