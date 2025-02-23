import winston from "winston";

// Crear logger con formato JSON
export const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(), // Mostrar en consola
    new winston.transports.File({ filename: "logs/app.log" }), // Guardar en archivo
  ],
});
