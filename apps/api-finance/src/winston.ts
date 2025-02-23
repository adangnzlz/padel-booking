import winston from "winston";

const format = winston.format.combine(
  winston.format.timestamp(),
  winston.format.json()
);

// Crear logger con formato JSON
export const logger = winston.createLogger({
  level: "info",
  format,
  transports: [
    new winston.transports.Console(), // Mostrar en consola
    new winston.transports.File({ filename: "logs/app.log", level: "info" }), // Guardar en archivo
  ],
});
