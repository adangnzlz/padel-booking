import bcrypt from "bcryptjs";
import { DatabaseFactory } from "../providers/database.factory";

export interface User {
  name: string;
  email: string;
  password: string;
}

const database = DatabaseFactory.get<User>("users");

export async function createUser(user: User): Promise<Omit<User, "password">> {
  const existingUser = await getUserByEmail(user.email);
  if (existingUser) throw new Error("EMAIL_ALREADY_REGISTERED");
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(user.password, 10);
  } catch (error) {
    throw new Error("Failed to hash password");
  }
  if (!hashedPassword) throw new Error("FAILED_TO_HASH_PASSWORD");
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
