import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import usersRoutes from "./routers/users.routes";
import transactionsRoutes from "./routers/transactions.routes";
import compression = require("compression");
import { httpRequestLogger } from "./middlewares/http-request-logger.middleware";
import { logger } from "./winston";
import { httpErrorInterceptor } from "./middlewares/http-error-logger.middleware";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;


app.use(compression());
app.use(cors());
app.use(express.json());
app.use(httpRequestLogger());


app.get("/", (req: Request, res: Response) => {
  res.send("Hola desde la API de Finanzas con TypeScript");
});

app.use("/users", usersRoutes);
app.use("/transactions", transactionsRoutes);



app.use(httpErrorInterceptor());

app.listen(PORT, () => {
  logger.info(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});


// Validation libraries express
// add a database
// practice transactions
// Uso del logger
// por que no se muestra logger
// TDD