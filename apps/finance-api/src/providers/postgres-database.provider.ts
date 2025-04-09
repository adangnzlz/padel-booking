import { Pool } from "pg";
import { DatabaseProvider } from "./database.provider";

export class PostgresDatabaseProvider<T> implements DatabaseProvider<T> {
  private pool: Pool;
  private table: string;

  constructor(tableName: string) {
    this.pool = new Pool({ connectionString: process.env.DATABASE_URL });
    this.table = tableName;
  }

  async read(): Promise<T[]> {
    const result = await this.pool.query(`SELECT *  FROM "${this.table}";`);
    return result.rows;
  }

  async create(data: T): Promise<T> {
    const dataObject = data as Record<string, any>;
    const keys = Object.keys(dataObject);
    const values = Object.values(dataObject);
    const paramPlaceholders = keys.map((_, i) => `$${i + 1}`).join(", ");

    const query = `
      INSERT INTO "${this.table}" (${keys.map((k) => `"${k}"`).join(", ")})
      VALUES (${paramPlaceholders})
      RETURNING *
    `;

    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async deleteByField(field: keyof T, value: any): Promise<void> {
    const query = `DELETE FROM "${this.table}" WHERE "${field as string}" = $1`;
    await this.pool.query(query, [value]);
  }

  async getByFields(query: Partial<T>): Promise<T[]> {
    const keys = Object.keys(query);
    const values = Object.values(query);

    if (keys.length === 0) return [];

    const conditions = keys
      .map((key, i) => `"${key}" = $${i + 1}`)
      .join(" AND ");
    const sql = `SELECT * FROM "${this.table}" WHERE ${conditions}`;

    const result = await this.pool.query(sql, values);
    return result.rows;
  }

  async clear(): Promise<void> {
    try {
      await this.pool.query(`TRUNCATE TABLE "${this.table}" RESTART IDENTITY;`);
    } catch (error) {
      console.error("Error clearing table:", error);
      throw error;
    }
  }

  async close() {
    this.pool.end();
  }
}
