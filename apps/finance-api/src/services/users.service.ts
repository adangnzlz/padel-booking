import bcrypt from "bcryptjs";
import { DatabaseFactory } from "../providers/database.factory";

export interface User {
  name: string;
  email: string;
  password: string;
}

const database = DatabaseFactory.get<User>("users");

async function hashPassword(password: string): Promise<string> {
  try {
    return await bcrypt.hash(password, 10);
  } catch (error) {
    throw new Error("Failed to hash password");
  }
}

export async function createUser(user: User): Promise<Omit<User, "password">> {
  const existingUser = await getUserByEmail(user.email);
  if (existingUser) throw new Error("EMAIL_ALREADY_REGISTERED");
  const hashedPassword = await hashPassword(user.password);
  await database.create({ ...user, password: hashedPassword });
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
  return await database.getByField("email", email);
}

export async function getUsers(): Promise<Omit<User, "password">[]> {
  return await database.read();
}
