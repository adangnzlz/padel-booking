-- Eliminar datos anteriores
TRUNCATE TABLE transactions RESTART IDENTITY CASCADE;
TRUNCATE TABLE users RESTART IDENTITY CASCADE;

-- Insertar usuarios mock
INSERT INTO users (name, email, password) VALUES
  ('Alice Smith', 'alice@example.com', 'hashedpassword1'),
  ('Bob Johnson', 'bob@example.com', 'hashedpassword2'),
  ('Carol White', 'carol@example.com', 'hashedpassword3');

-- Insertar transacciones mock usando emails
INSERT INTO transactions (senderEmail, receiverEmail, amount) VALUES
  ('alice@example.com', 'bob@example.com', 150.50),
  ('bob@example.com', 'carol@example.com', 45.00),
  ('carol@example.com', 'alice@example.com', 20.25),
  ('alice@example.com', 'carol@example.com', 5.75),
  ('bob@example.com', 'alice@example.com', 100.00);
