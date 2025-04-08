import { DatabaseProvider } from "./database.provider";

export class MemoryDatabaseProvider<T> implements DatabaseProvider<T> {
  private storage: T[] = [];

  async read(): Promise<T[]> {
    return this.storage;
  }

  async create(data: T): Promise<void> {
    this.storage.push(data);
  }

  async deleteByField(field: keyof T, value: any): Promise<void> {
    this.storage = await this.storage.filter((item) => item[field] !== value);
  }

  async getByField(field: keyof T, value: any): Promise<T | undefined> {
    const data = await this.read();
    return data.find((item) => item[field] === value);
  }

  async clear(): Promise<void> {
    this.storage = [];
  }
}
