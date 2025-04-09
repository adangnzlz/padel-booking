export interface DatabaseProvider<T> {
  read(): Promise<T[]>;
  create(data: Omit<T, 'id'>): Promise<T>;
  getByFields(query?: Partial<T>): Promise<T[]>;
  clear(): Promise<void>;
  deleteByField(field: keyof T, value: any): Promise<void>;
  close?(): void;
}
