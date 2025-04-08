import { Pool } from "pg";
import { DatabaseProvider } from "./database.provider";

export class PostgresDatabaseProvider<T> implements DatabaseProvider<T> {
  private pool: Pool;
  private table: string;

  constructor(tableName: string) {
    this.pool = new Pool({
      user: process.env.PG_USER,
      host: process.env.PG_HOST,
      database: process.env.PG_DB,
      password: process.env.PG_PASSWORD,
      port: Number(process.env.PG_PORT),
    });
    this.table = tableName;
  }

  async read(): Promise<T[]> {
    const result = await this.pool.query(`SELECT id,name,email  FROM "${this.table}";`);
    return result.rows;
  }

  async create(data: T): Promise<void> {
    const dataObject = data as Record<string, any>;
    const keys = Object.keys(dataObject);
    const values = Object.values(dataObject);
    const paramPlaceholders = keys
      .map((_, index) => `$${index + 1}`)
      .join(", ");

    const query = `INSERT INTO "${this.table}" (${keys
      .map((k) => `"${k}"`)
      .join(", ")}) VALUES (${paramPlaceholders})`;

    await this.pool.query(query, values);
  }

  async getByField(field: keyof T, value: any): Promise<T | undefined> {
    const query = `SELECT * FROM "${this.table}" WHERE "${
      field as string
    }" = $1 LIMIT 1`;
    const result = await this.pool.query(query, [value]);
    return result.rows[0] || undefined;
  }

  async clear(): Promise<void> {
    try {
      await this.pool.query(`TRUNCATE TABLE "${this.table}" RESTART IDENTITY;`);
    } catch (error) {
      console.error('Error clearing table:', error);
      throw error;
    }
  }

  async close(){
    this.pool.end();
  }
}
