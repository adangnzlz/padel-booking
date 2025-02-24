import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import compression = require("compression");
import dotenv from "dotenv";
dotenv.config();

import usersRoutes from "./routers/users.routes";
import transactionsRoutes from "./routers/transactions.routes";
import { httpRequestLogger } from "./middlewares/http-request-logger.middleware";
import { logger } from "./config/winston";
import { httpErrorInterceptor } from "./middlewares/http-error-interceptor.middleware";
import { apiRateLimiter } from "./middlewares/rate-limiter.middleware";


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

app.use("/users", usersRoutes);
app.use("/transactions", transactionsRoutes);

app.use(httpErrorInterceptor());

const server = app.listen(PORT, () => {
  logger.info(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

export { app, server };

