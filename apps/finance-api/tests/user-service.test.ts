import { DatabaseFactory } from "../src/providers/database.factory";
import {
  createUser,
  getUserByEmail,
  getUsers,
  User,
} from "../src/services/users.service";
import bcrypt from "bcryptjs";

jest.mock("bcryptjs"); // ✅ Mock bcrypt to avoid real hashing

describe("User Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    const database = DatabaseFactory.get("users");
    database.clear();
  });

  it("Should return undefined if user not found", async () => {
    const user = await getUserByEmail("adan@gmail.com");
    expect(user).toBeUndefined();
  });

  it("Should create a user and return it without password", async () => {
    (bcrypt.hash as jest.Mock).mockReturnValue("verysecurepassword");

    const user = await createUser({
      name: "Adán",
      email: "adan@gmail.com",
      password: "newpassword",
    });
    expect(user).toEqual({ name: "Adán", email: "adan@gmail.com" });
  });
  it("Should fails when hashing password return undefined", async () => {
    (bcrypt.hash as jest.Mock).mockReturnValue(undefined);

    await expect(
      createUser({
        name: "Adán",
        email: "Adán@gmail.com",
        password: "newpassword",
      })
    ).rejects.toThrow("FAILED_TO_HASH_PASSWORD");
  });

  it("Should retreive users created", async () => {
    (bcrypt.hash as jest.Mock).mockReturnValue("verysecurepassword");
    await createUser({
      name: "Adán",
      email: "Adán@gmail.com",
      password: "newpassword",
    });
    await createUser({
      name: "Adán2",
      email: "Adán2@gmail.com",
      password: "newpassword2",
    });

    const users = await getUsers();
    expect(users.length).toEqual(2);
  });

  it("Should fails trying to create an already existing user", async () => {
    (bcrypt.hash as jest.Mock).mockReturnValue("verysecurepassword");
    await createUser({
      name: "Adán",
      email: "adan@gmail.com",
      password: "newpassword",
    });
    await expect(
      createUser({
        name: "Adán",
        email: "adan@gmail.com",
        password: "newpassword",
      })
    ).rejects.toThrow("EMAIL_ALREADY_REGISTERED");
  });

  it("Should fail if hashing fails", async () => {
    (bcrypt.hash as jest.Mock).mockImplementation(() => {
      throw new Error("Error during hashing");
    });
    await expect(
      createUser({
        name: "Adán",
        email: "Adán@gmail.com",
        password: "newpassword",
      })
    ).rejects.toThrow("Failed to hash password");
  });

  afterAll(() => {
    jest.resetAllMocks();
    const database = DatabaseFactory.get("users");
    database.clear();
    if (database.close) {
      database.close();
    }
  });
});
