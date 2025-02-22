import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import usersRoutes from "./routers/users.routes";
import transactionsRoutes from "./routers/transactions.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hola desde la API de Finanzas con TypeScript");
});



app.use('/users', usersRoutes);
app.use('/transactions', transactionsRoutes);


app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
