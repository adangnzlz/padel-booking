import bcrypt from "bcryptjs";

export interface User {
  name: string;
  email: string;
  password: string;
}

const users: User[] = [];

async function plainPasswordToHash(
  password: string
): Promise<string | undefined> {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
  } catch (error) {
    console.error("Error hashing password:", error);
    return; // Or throw a custom error
  }
}

export async function createUser(
  user: User
): Promise<Partial<User | undefined>> {
  try {
    const hashedPass = await plainPasswordToHash(user.password);
    if (hashedPass) {
      users.push({ ...user, password: hashedPass });
      return { ...user, password: undefined };
    } else {
      return;
    }
  } catch (error) {
    console.log(error);
    return;
  }
}

export function getUserByEmail(email: string): User | undefined {
  return users.find((x) => x.email == email);
}

export function getUsers(): User[] {
  return users;
}
