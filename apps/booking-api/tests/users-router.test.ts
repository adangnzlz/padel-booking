import request from "supertest";
import { server } from "../src/index";

describe("Users Router", () => {
  const routerUrl = "/api/v1/users";

  it("should return a hello world message for GET /users", async () => {
    const response = await request(server).get(routerUrl);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "Hello from Users API!",
      timestamp: expect.any(String),
    });
  });
  afterAll(async () => {
    await server.close();
  });
});
