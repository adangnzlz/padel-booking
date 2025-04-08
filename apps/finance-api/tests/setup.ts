import dotenv from "dotenv";
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

jest.mock("../config/winston", () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));
