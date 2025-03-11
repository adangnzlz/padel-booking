import request from "supertest";
import { server, app } from "../src/index"; // Import the Express app
import { getUserByEmail } from "../src/services/users.service";

jest.mock("../src/services/users.service", () => ({
  getUserByEmail: jest.fn(),
}));

const routerUrl = `${process.env.API_VERSION}/transactions`;

describe("Transactions API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ✅ Test GET `/transactions` without filters
  it("should return all transactions when no filters are applied", async () => {
    const res = await request(app).get(routerUrl);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true); // Should return an array
  });

  // ✅ Test GET `/transactions` with senderEmail filter
  it("should return 400 if sender email does not exist", async () => {
    (getUserByEmail as jest.Mock).mockReturnValueOnce(null);

    const res = await request(app)
      .get(routerUrl)
      .query({ senderEmail: "unknown@example.com" });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Sender email not exists");
  });

  // ✅ Test GET `/transactions` with receiverEmail filter
  it("should return 400 if receiver email does not exist", async () => {
    (getUserByEmail as jest.Mock).mockReturnValueOnce(null);

    const res = await request(app)
      .get(routerUrl)
      .query({ receiverEmail: "unknown@example.com" });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Receiver email not exists");
  });

  // ✅ Test POST `/transactions` (Successful transaction)
  it("should create a transaction when data is valid", async () => {
    (getUserByEmail as jest.Mock).mockReturnValue(true); // ✅ Mock user existence

    const res = await request(app).post(routerUrl).send({
      senderEmail: "alice@example.com",
      receiverEmail: "bob@example.com",
      amount: 100,
    });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe("Transaction created successfully");
  });

  // ✅ Test POST `/transactions` (Invalid email format)
  it("should fail if senderEmail is invalid", async () => {
    const res = await request(app).post(routerUrl).send({
      senderEmail: "invalidemail",
      receiverEmail: "bob@example.com",
      amount: 100,
    });

    expect(res.status).toBe(400);
    expect(JSON.stringify(res.body)).toContain("Invalid sender email");
  });

  // ✅ Test POST `/transactions` (Sender and receiver emails must be different)
  it("should fail if sender and receiver emails are the same", async () => {
    const res = await request(app).post(routerUrl).send({
      senderEmail: "alice@example.com",
      receiverEmail: "alice@example.com",
      amount: 100,
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Emails should be different");
  });

  // ✅ Test POST `/transactions` (Sender does not exist)
  it("should fail if sender does not exist", async () => {
    (getUserByEmail as jest.Mock).mockImplementation((email) => undefined);

    const res = await request(app).post(routerUrl).send({
      senderEmail: "unknown@example.com",
      receiverEmail: "bob@example.com",
      amount: 100,
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Sender email not exists");
  });

  // ✅ Test POST `/transactions` (Receiver does not exist)
  it("should fail if receiver does not exist", async () => {
    (getUserByEmail as jest.Mock).mockImplementation(
      (email) => email !== "unknown@example.com"
    );

    const res = await request(app).post(routerUrl).send({
      senderEmail: "alice@example.com",
      receiverEmail: "unknown@example.com",
      amount: 100,
    });

    expect(res.status).toBe(400);
    expect(JSON.stringify(res.body)).toEqual(
      expect.stringContaining("Receiver email not exists")
    );
  });

  it("should fail if amount is zero or negative", async () => {
    const res = await request(app).post(routerUrl).send({
      senderEmail: "alice@example.com",
      receiverEmail: "bob@example.com",
      amount: -10,
    });

    expect(res.status).toBe(400);
    expect(JSON.stringify(res.body)).toEqual(
      expect.stringContaining("Positive amount required")
    );
  });
  afterAll(() => {
    server.close(); // ✅ Close the Express server after all tests
  });
});
