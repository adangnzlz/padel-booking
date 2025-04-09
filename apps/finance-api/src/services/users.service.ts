import bcrypt from "bcryptjs";
import { DatabaseFactory } from "../providers/database.factory";
import { CreateUserRequest, User } from "@finance/types";

const database = DatabaseFactory.get<User>("users");

async function hashPassword(password: string): Promise<string> {
  try {
    return await bcrypt.hash(password, 10);
  } catch (error) {
    throw new Error("Failed to hash password");
  }
}

export async function createUser(
  user: CreateUserRequest
): Promise<Omit<User, "password">> {
  const existingUser = await getUserByEmail(user.email);
  if (existingUser) throw new Error("EMAIL_ALREADY_REGISTERED");
  const hashedPassword = await hashPassword(user.password);
  const { password, ...newUser } = await database.create({ ...user, password: hashedPassword });
  return newUser;
}

export async function getUserByEmail(
  email: string
): Promise<Omit<User, "password"> | undefined> {
  const user = (await database.getByFields({ email }))[0];
  if (user) {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  return undefined;
}

export async function getUsers(): Promise<Omit<User, "password">[]> {
  return (await database.read()).map(({ password, ...user }) => user);
}

export async function deleteUser(email: string): Promise<void> {
  await database.deleteByField("email", email);
}
