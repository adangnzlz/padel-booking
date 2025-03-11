# finance-monorepo


# 📌 Finance API

## 🚀 Project Setup and Startup

This project uses `pnpm` as the package manager, managed via `Corepack`. Make sure to follow the steps below to configure it correctly in your environment.

### 📦 **Prerequisites**

- **Node.js** `>= v20.15.1`
- **Corepack** enabled.

### 🛠 **Initial Configuration**

1. **Enable Corepack** (if not already enabled on your machine):

   ```bash
   corepack enable
   ```

2. **Set the specific version of `pnpm` for this project**:

   ```bash
   corepack prepare pnpm@10.4.1 --activate
   ```

3. **Verify that `pnpm` is working correctly**:

   ```bash
   pnpm -v
   ```

   It should display `10.4.1` (or the version specified in `package.json`).

### 📂 **Installing Dependencies**

To install the project's dependencies, run:

```bash
pnpm install
```

### ▶️ **Running the Project**

To start the server in development mode:

```bash
pnpm start
```

Or if the project uses `scripts` in `package.json`, you can run:

```bash
pnpm run dev
```

### 🧪 **Running Tests**

To run the tests:

```bash
pnpm test
```

### 🔄 **Updating `pnpm` (optional)**

If you need to update `pnpm` in the future, edit `package.json` and change the version in:

```json
"packageManager": "pnpm@X.Y.Z"
```

Then run:

```bash
corepack prepare pnpm@X.Y.Z --activate
```

---

## 🛠 **Database Setup (PostgreSQL with Docker)**

This project uses a PostgreSQL database running in a Docker container. Follow these steps to set it up or reset it:

### 🗑 **Resetting the Database**

If you need to delete and recreate the database:

```bash
docker stop pgdb
docker rm pgdb
docker volume prune -f
```

### 🔄 **Re-downloading the PostgreSQL Docker Image**

If you have removed the PostgreSQL image, download it again with:

```bash
docker pull postgres
```

To download a specific version (e.g., PostgreSQL 15):

```bash
docker pull postgres:15
```

### 🏗 **Creating or Starting the Database**

To avoid conflicts, use this command to **start** the database if it exists, or **create** it if it doesn't:

```bash
[[ $(docker ps -aq -f name=^pgdb$) ]] && docker start pgdb || (export $(grep -v '^#' .env | xargs) && \
docker run --name pgdb \
  -e POSTGRES_USER=$PG_USER \
  -e POSTGRES_PASSWORD=$PG_PASSWORD \
  -e POSTGRES_DB=$PG_DB \
  -p $PG_PORT:$PG_PORT \
  -v $(pwd)/src/config/init.sql:/docker-entrypoint-initdb.d/init.sql \
  -d postgres)
```

This command ensures credentials are **not hardcoded** in `package.json` and avoids container conflicts.

### 🔄 **Updating `.env` File**

Ensure that the `.env` file contains the correct database credentials:

```env
DATABASE_TYPE=postgres
API_VERSION=V1
PORT=3000
PG_USER=admin
PG_HOST=localhost
PG_DB=mydatabase
PG_PASSWORD=secret
PG_PORT=5432
```

Make sure the `.env` file is **not versioned** by adding it to `.gitignore`:

```bash
echo ".env" >> .gitignore
```

### 📦 **Recreating the `users` Table**

To create the `users` table inside PostgreSQL:

```bash
docker exec -it pgdb psql -U $PG_USER -d $PG_DB
```

Then run:

```sql
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);
```

Exit PostgreSQL with `\q`.

### ✅ **Testing the Database Connection**

Restart the application:

```bash
pnpm start
```

If using migrations, apply them with:

```bash
pnpm run migrate
```

---

📌 **By following these steps, we ensure that all developers and deployment environments use the same version of `pnpm`, and have a consistent and easily restorable PostgreSQL database setup.** 🚀



Finance Monorepo Example

NodeJS with 

- Winston
- Loggin middlewares (JSON, durations, status code...)
- Error handlers (asyncHandler, HttpError, Error interceptors)
- Cors
- Helmet
- express validator
- Rate limits
- Test (supertest, jest)