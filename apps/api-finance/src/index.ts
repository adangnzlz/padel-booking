import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import usersRoutes from "./routers/users.routes";
import transactionsRoutes from "./routers/transactions.routes";
import compression = require("compression");
import { httpRequestLogger } from "./middlewares/http-request-logger.middleware";
import { logger } from "./winston";
import { httpErrorInterceptor } from "./middlewares/http-error-interceptor.middleware";
import { apiRateLimiter } from "./middlewares/rate-limiter.middleware";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;


app.use(httpRequestLogger());
app.use(apiRateLimiter);
app.use(compression());
app.use(cors());
app.use(express.json({ limit: '10kb' }));
app.use(helmet());


app.get("/", (req: Request, res: Response) => {
  res.send("Hola desde la API de Finanzas con TypeScript");
});

app.use("/users", usersRoutes);
app.use("/transactions", transactionsRoutes);



app.use(httpErrorInterceptor());

app.listen(PORT, () => {
  logger.info(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});


// add a database
// practice transactions
// TDD
// helmet
// Redis