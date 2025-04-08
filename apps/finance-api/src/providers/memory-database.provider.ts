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

  async getByFields(query: Partial<T>): Promise<T[]> {
    const data = await this.read();
    return data.filter((item) =>
      Object.entries(query).every(
        ([key, value]) => item[key as keyof T] === value
      )
    );
  }

  async clear(): Promise<void> {
    this.storage = [];
  }
}
