const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.envPORT || 3000;

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hola");
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
