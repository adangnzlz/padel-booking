import { DatabaseFactory } from "../src/providers/database.factory";
import {
  createUser,
  getUserByEmail,
  getUsers,
  deleteUser,
} from "../src/services/users.service";
import bcrypt from "bcryptjs";
jest.mock("bcryptjs"); // Mock bcrypt to avoid real hashing

describe("User Service", () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    const database = DatabaseFactory.get("users");
    await database.clear();
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
    expect(user.name).toEqual("Adán");
    expect(user.email).toEqual("adan@gmail.com");
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

  it("Should throw an error when bcrypt hash fails", async () => {
    // Mock bcrypt to throw an error
    (bcrypt.hash as jest.Mock).mockRejectedValue(new Error("Bcrypt error"));
    
    // Attempt to create a user which will trigger the hashPassword error
    await expect(
      createUser({
        name: "Error User",
        email: "error@example.com",
        password: "password",
      })
    ).rejects.toThrow("Failed to hash password");
  });

  it("Should delete a user successfully", async () => {
    // Create a user first
    (bcrypt.hash as jest.Mock).mockReturnValue("verysecurepassword");
    await createUser({
      name: "Delete Me",
      email: "delete@example.com",
      password: "password",
    });
    
    // Verify user exists
    let user = await getUserByEmail("delete@example.com");
    expect(user).toBeDefined();
    
    // Delete the user
    await deleteUser("delete@example.com");
    
    // Verify user no longer exists
    user = await getUserByEmail("delete@example.com");
    expect(user).toBeUndefined();
  });

  afterAll(async () => {
    jest.resetAllMocks();
    const database = DatabaseFactory.get("users");
    await database.clear();
    if (database.close) {
      await database.close();
    }
  });
});
