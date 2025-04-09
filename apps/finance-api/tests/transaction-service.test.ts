import { DatabaseFactory } from "../src/providers/database.factory";
import { getUserByEmail } from "../src/services/users.service";
import { CreateTransactionRequest } from "@finance/types";

// Estas serían las funciones que implementarías en el servicio de transacciones
import {
  createTransaction,
  getTransactions,
} from "../src/services/transactions.service";

// Mockear el servicio de usuarios para evitar dependencias reales
jest.mock("../src/services/users.service");

describe("Transaction Service", () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    const database = DatabaseFactory.get("transactions");
    await database.clear();

    // Configurar el mock de getUserByEmail para que devuelva true por defecto
    (getUserByEmail as jest.Mock).mockImplementation((email: string) => {
      // Simulamos que estos emails existen
      return email === "sender@example.com" || email === "receiver@example.com"
        ? { name: "Test User", email }
        : undefined;
    });
  });

  it("Should return empty array when no transactions exist", async () => {
    const transactions = await getTransactions();
    expect(transactions).toEqual([]);
  });

  it("Should create a transaction successfully", async () => {
    const transaction: CreateTransactionRequest = {
      senderemail: "sender@example.com",
      receiveremail: "receiver@example.com",
      amount: 100,
    };

    const result = await createTransaction(transaction);
    expect(result.senderemail).toBe("sender@example.com");
    expect(result.receiveremail).toBe("receiver@example.com");
    expect(result.amount).toBe(100);
  });

  it("Should retrieve transactions filtered by sender email", async () => {
    (getUserByEmail as jest.Mock).mockReturnValue(true);
    // Crear algunas transacciones para probar
    await createTransaction({
      senderemail: "sender@example.com",
      receiveremail: "receiver@example.com",
      amount: 100,
    });

    await createTransaction({
      senderemail: "other@example.com",
      receiveremail: "receiver@example.com",
      amount: 200,
    });

    const transactions = await getTransactions({
      senderemail: "sender@example.com",
    });
    expect(transactions.length).toBe(1);
    expect(transactions[0].senderemail).toBe("sender@example.com");
  });

  it("Should retrieve all transactions when no filters ", async () => {
    (getUserByEmail as jest.Mock).mockReturnValue(true);
    // Crear algunas transacciones para probar
    await createTransaction({
      senderemail: "sender@example.com",
      receiveremail: "receiver@example.com",
      amount: 100,
    });

    await createTransaction({
      senderemail: "other@example.com",
      receiveremail: "receiver2@example.com",
      amount: 200,
    });

    const transactions = await getTransactions({});
    expect(transactions.length).toBe(2);
    const transactions2 = await getTransactions({
      senderemail: "sender@example.com",
    });
    expect(transactions2.length).toBe(1);
    const transactions3 = await getTransactions({
      receiveremail: "receiver2@example.com",
    });
    expect(transactions3.length).toBe(1);
  });

  it("Should retrieve transactions filtered by receiver email", async () => {
    (getUserByEmail as jest.Mock).mockReturnValue(true);
    await createTransaction({
      senderemail: "sender@example.com",
      receiveremail: "receiver@example.com",
      amount: 100,
    });

    await createTransaction({
      senderemail: "sender@example.com",
      receiveremail: "other@example.com",
      amount: 200,
    });

    const transactions = await getTransactions({
      receiveremail: "receiver@example.com",
    });
    expect(transactions.length).toBe(1);
    expect(transactions[0].receiveremail).toBe("receiver@example.com");
  });

  it("Should fail when trying to create a transaction with the same sender and receiver", async () => {
    await expect(
      createTransaction({
        senderemail: "sender@example.com",
        receiveremail: "sender@example.com",
        amount: 100,
      })
    ).rejects.toThrow("Emails should be different");
  });

  it("Should fail when trying to create a transaction with non-existing sender", async () => {
    // Configurar el mock para que devuelva undefined para este email
    (getUserByEmail as jest.Mock).mockImplementation((email: string) =>
      email === "receiver@example.com"
        ? { name: "Test User", email }
        : undefined
    );

    await expect(
      createTransaction({
        senderemail: "nonexistent@example.com",
        receiveremail: "receiver@example.com",
        amount: 100,
      })
    ).rejects.toThrow("Sender email not exists");
  });

  it("Should fail when trying to create a transaction with non-existing receiver", async () => {
    // Configurar el mock para que devuelva undefined para este email
    (getUserByEmail as jest.Mock).mockImplementation((email: string) =>
      email === "sender@example.com" ? { name: "Test User", email } : undefined
    );

    await expect(
      createTransaction({
        senderemail: "sender@example.com",
        receiveremail: "nonexistent@example.com",
        amount: 100,
      })
    ).rejects.toThrow("Receiver email not exists");
  });

  afterAll(async () => {
    jest.resetAllMocks();
    const database = DatabaseFactory.get("transactions");
    await database.clear();
    if (database.close) {
      await database.close();
    }
  });
});
