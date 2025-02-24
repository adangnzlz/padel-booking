import dotenv from "dotenv";
dotenv.config();

jest.mock("../src/config/winston", () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));
