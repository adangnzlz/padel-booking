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

📌 **By following these steps, we ensure that all developers and deployment environments use the same version of `pnpm`, ensuring stability and compatibility within the project.** 🚀


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