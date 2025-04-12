export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

export const getUsers = async (): Promise<{ message: string; timestamp: string }> => {
  return {
    message: "Hello from Users API!",
    timestamp: new Date().toISOString()
  };
};

