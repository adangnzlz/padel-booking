import fs from "fs/promises";
import path from "path";
import { DatabaseProvider } from "./database.provider";

const FILE_PATH_BASE = path.join(__dirname, "../../data/");

export class FileDatabaseProvider<T> implements DatabaseProvider<T> {
  filePath: string;

  constructor(name: string) {
    this.filePath = `${FILE_PATH_BASE}${name}.json`;
  }

  async read(): Promise<T[]> {
    try {
      const data = await fs.readFile(this.filePath, "utf8");
      return data ? JSON.parse(data) : [];
    } catch (error: any) {
      if (error.code === "ENOENT") {
        return []; // Si el archivo no existe, devuelve un array vacío
      }
      throw new Error("Error reading file database");
    }
  }

  async create(newElement: T): Promise<void> {
    try {
      const data = await this.read(); // 🔹 Leemos los datos actuales
      data.push(newElement); // 🔹 Agregamos el nuevo elemento
      await fs.writeFile(this.filePath, JSON.stringify(data, null, 2), "utf8"); // 🔹 Sobreescribimos con el JSON formateado
    } catch (error) {
      throw new Error("Error writing to file database");
    }
  }

  async deleteByField(field: keyof T, value: any): Promise<void> {
    const data = await this.read();
    const filteredData = data.filter((x) => x[field] !== value);
    await fs.writeFile(
      this.filePath,
      JSON.stringify(filteredData, null, 2),
      "utf8"
    );
  }

  async getByField(field: keyof T, value: any): Promise<T | undefined> {
    const data = await this.read();
    return data.find((x) => x[field] == value);
  }

  async clear(): Promise<void> {
    await fs.writeFile(this.filePath, "[]", "utf8");
  }
}
