import { DatabaseProvider } from "./database.provider";
import { FileDatabaseProvider } from "./file-database.provider";
import { MemoryDatabaseProvider } from "./memory-database.provider";
import { PostgressDatabaseProvider } from "./postgres-database.provider";

export enum DatabaseType {
  FILE = "file",
  MEMORY = "memory",
  POSTGRES = "postgres",
}

export class DatabaseFactory {
  private static instances: Map<string, DatabaseProvider<any>> = new Map();

  static get<T>(name: string): DatabaseProvider<T> {
    const dbType = process.env.DATABASE_TYPE as DatabaseType;
    if (!dbType) throw new Error("Database type not defined");
    if (!this.instances.get(name)) {
      let instance: DatabaseProvider<T>;
      switch (dbType) {
        case DatabaseType.FILE:
          instance = new FileDatabaseProvider<T>(name);
          break;
        case DatabaseType.MEMORY:
          instance = new MemoryDatabaseProvider<T>();
          break;
        case DatabaseType.POSTGRES:
          instance = new PostgressDatabaseProvider<T>(name);
          break;
        default:
          throw new Error("Invalid database type");
      }
      this.instances.set(name, instance);
    }
    return this.instances.get(name) as DatabaseProvider<T>;
  }
}
