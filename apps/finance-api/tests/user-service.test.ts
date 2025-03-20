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
    const user = await getUserByEmail("adan-not-found@gmail.com");
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


  afterAll(() => {
    jest.resetAllMocks();
    const database = DatabaseFactory.get("users");
    database.clear();
    if (database.close) {
      database.close();
    }
  });
});
