import { DatabaseProvider } from "./database.provider";
import { Pool } from "pg";

export class PostgressDatabaseProvider<T> implements DatabaseProvider<T> {
  private pool: Pool;
  private table: string;

  constructor(tableName: string) {
    this.pool = new Pool({
      user: process.env.PG_USER || "admin",
      host: process.env.PG_HOST || "localhost",
      database: process.env.PG_DB || "mydatabase",
      password: process.env.PG_PASSWORD || "secret",
      port: Number(process.env.PG_PORT) || 5432,
    });
    this.table = tableName;
  }

  async read(): Promise<T[]> {
    const result = await this.pool.query(`
            SELECT * FROM ${this.table}
        `);
    return result.rows;
  }
  async create(data: T): Promise<void> {
    const dataObject = data as Object;
    const keys = Object.keys(dataObject).join(", ");
    const values = Object.values(dataObject)
      .map((x, i) => `$${i + 1}`)
      .join(", ");

    const query = `INSERT INTO ${this.table} ${keys} VALUES ${values}`;
    await this.pool.query(query, Object.values(dataObject));
  }
  async getByField(field: keyof T, value: any): Promise<T | undefined> {
    const query = `
        SELECT * FROM ${this.table} 
        WHERE ${field as string} = $1
        LIMIT 1
    `;
    const result = await this.pool.query(query, [value]);
    return (result.rows[0] as T) || undefined;
  }

  async clear(): Promise<void> {
    await this.pool.query(`TRUNCATE TABLE ${this.table} RESTART IDENTITY;`);
  }
}
