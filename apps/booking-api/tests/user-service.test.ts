import { getUsers } from "../src/services/users.service";

describe("Users Service", () => {
  it("should return a hello world message for all users", async () => {
    const result = await getUsers();
    expect(result).toEqual({
      message: "Hello from Users API!",
      timestamp: expect.any(String)
    });
  });

});
