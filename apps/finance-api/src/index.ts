import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import compression = require("compression");
import dotenv from "dotenv";
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });


import usersRoutes from "./routes/v1/users.routes";
import transactionsRoutes from "./routes/v1/transactions.routes";
import { httpRequestLogger } from "./middlewares/http-request-logger.middleware";
import { logger } from "../config/winston";
import { httpErrorInterceptor } from "./middlewares/http-error-interceptor.middleware";
import {
  apiRateLimiter,
  strictRateLimiter,
} from "./middlewares/rate-limiter.middleware";

const version = process.env.API_VERSION;
const app = express();
const PORT = process.env.PORT || 3000;

app.use(httpRequestLogger());
app.use(apiRateLimiter);
app.use(compression());
app.use(cors());
app.use(express.json({ limit: "10kb" }));
app.use(helmet());

app.get("/", (req: Request, res: Response) => {
  res.send("Finances API TypeScript");
});

app.use(`${version}/users`, strictRateLimiter, usersRoutes);
app.use(`${version}/transactions`, apiRateLimiter, transactionsRoutes);

app.use(httpErrorInterceptor());

const server = app.listen(PORT, () => {
  logger.info(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

export { app, server };
