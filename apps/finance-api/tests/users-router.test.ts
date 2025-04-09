import request from "supertest";
import { app, server } from "../src/index"; // Import the Express app
import {
  createUser,
  getUserByEmail,
  getUsers,
} from "../src/services/users.service";
import { User } from "@finance/types";

// Mock the services
jest.mock("../src/services/users.service");

// Mock the rate limiter middleware
jest.mock("../src/middlewares/rate-limiter.middleware", () => ({
  strictRateLimiter: (req: any, res: any, next: any) => next(),
  apiRateLimiter: (req: any, res: any, next: any) => next(),
}));

const mockUser: Partial<User> = { name: "Alice", email: "alice@example.com" };
const mockUserList = [mockUser];

const routerUrl = `${process.env.API_VERSION}/users`;

describe("User API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return a list of users without passwords", async () => {
    (getUsers as jest.Mock).mockReturnValue(mockUserList);
    const res = await request(app).get(routerUrl);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockUserList);
  });

  it("should create a user and return 201 status", async () => {
    (createUser as jest.Mock).mockReturnValue({
      name: "Adán",
      email: "adan@gmail.com",
    });
    const res = await request(app)
      .post(routerUrl)
      .send({ name: "Adán", email: "adan@gmail.com", password: "newpassword" });
    expect(res.status).toBe(201);
    expect(res.body).toEqual({ message: "User created successfully" });
  });

  it("should fails because invalid email", async () => {
    const res = await request(app)
      .post(routerUrl)
      .send({ name: "Adán", email: "adangmailcom", password: "newpassword" });
    expect(res.status).toBe(400);
    expect(JSON.stringify(res.body)).toContain("Invalid email");
  });

  it("should fails because required fields", async () => {
    const res = await request(app).post(routerUrl).send({});
    expect(res.status).toBe(400);
    expect(JSON.stringify(res.body)).toEqual(
      expect.stringContaining("Name is required")
    );
    expect(JSON.stringify(res.body)).toContain("Email is required");
    expect(JSON.stringify(res.body)).toContain("Password is required");
  });

  it("should fails because password too short", async () => {
    const res = await request(app)
      .post(routerUrl)
      .send({ name: "Adán", email: "adan@gmail.com", password: "new" });
    expect(res.status).toBe(400);
    expect(JSON.stringify(res.body)).toContain(
      "Password is required. Min lenght 6 characteres"
    );
  });

  it("should fail because email already registered", async () => {
    (createUser as jest.Mock).mockImplementation(async (user) => {
      throw new Error("EMAIL_ALREADY_REGISTERED");
    });
    const res = await request(app)
      .post(routerUrl)
      .send({ ...mockUser, password: "newpassword" });
    expect(res.status).toBe(400);
    expect(res.body.error).toContain("EMAIL_ALREADY_REGISTERED");
  });

  it("should fail because email already registered", async () => {
    (createUser as jest.Mock).mockImplementation(async (user) => {
      throw new Error("EMAIL_ALREADY_REGISTERED");
    });
    const res = await request(app)
      .post(routerUrl)
      .send({ ...mockUser, password: "newpassword" });
    expect(res.status).toBe(400);
    expect(res.body.error).toContain("EMAIL_ALREADY_REGISTERED");
  });

  it("should retrieve a user by email successfully", async () => {
    const mockUserByEmail = {
      name: "Alice",
      email: "alice@example.com",
    };
    (getUserByEmail as jest.Mock).mockReturnValue(mockUserByEmail);

    const res = await request(app).get(`${routerUrl}/alice@example.com`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockUserByEmail);
    expect(getUserByEmail).toHaveBeenCalledWith("alice@example.com");
  });

  it("should return 404 when user is not found by email", async () => {
    (getUserByEmail as jest.Mock).mockReturnValue(null);

    const res = await request(app).get(`${routerUrl}/nonexistent@example.com`);

    expect(res.status).toBe(404);
    expect(res.body.error).toContain("User not found");
    expect(getUserByEmail).toHaveBeenCalledWith("nonexistent@example.com");
  });

  it("should return 500 when an unexpected error occurs during user retrieval", async () => {
    (createUser as jest.Mock).mockImplementation(() => {
      throw new Error("Unexpected database error");
    });

    const res = await request(app)
      .post(routerUrl)
      .send({ ...mockUser, password: "newpassword" });

    expect(res.status).toBe(500);
    expect(res.body.error).toContain("Internal Server Error");
  });

  afterAll(() => {
    jest.resetAllMocks();
    server.close(); // Close the Express server after all tests
  });
});
