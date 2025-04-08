/**
 * Tipos relacionados con usuarios
 */

/**
 * Representa un usuario completo con todos sus datos
 */
export interface User {
  id?: string;
  name: string;
  email: string;
  password?: string;
  balance?: number;
}

/**
 * Datos necesarios para crear un nuevo usuario
 */
export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
}

/**
 * Representa un usuario sin incluir datos sensibles como la contraseu00f1a
 */
export type UserResponse = Omit<User, 'password'>;
