# Finance Monorepo

> **Personal Project Statement**: This personal project is a sandbox for testing out technologies and exploring best practices. It does not aim to provide the optimal solution for the specific problem implemented, but rather to serve as a learning and experimentation platform.

This monorepo contains a full-stack financial application with a TypeScript/Express API backend and a React/Vite frontend, managed using Turbo and pnpm workspaces.

## 📋 Repository Structure

```
finance-monorepo/
├── apps/
│   ├── finance-api/        # Backend Express API
│   └── finance-web-app/    # Frontend React application
├── packages/
│   └── finance-types/      # Shared TypeScript types
├── infra/                  # Terraform infrastructure for GCP
├── .github/
│   └── workflows/          # CI/CD pipelines
└── [config files]          # Root configuration files
```

## 🛠️ Technology Stack

### Core Infrastructure
- **Monorepo Management**: Turborepo + pnpm workspaces
- **Package Manager**: pnpm (v10.4.1)
- **Language**: TypeScript
- **CI/CD**: GitHub Actions

### Backend (finance-api)
- **Runtime**: Node.js (v20+)
- **Framework**: Express.js
- **Database**: PostgreSQL
- **API Features**:
  - Winston for logging
  - Error handling
  - Express validation
  - Rate limiting
  - CORS and Helmet for security
  - 100% test coverage with Jest and Supertest

### Frontend (finance-web-app)
- **Framework**: React 18
- **Build System**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **Icons**: React Feather Icons

### Infrastructure
- **Cloud Provider**: Google Cloud Platform (GCP)
  - Cloud Run for hosting the API
  - Secret Manager for secure environment variables
  - Artifact Registry for Docker images
- **Database**: PostgreSQL (local Docker for development, Supabase for production)
- **Frontend Hosting**: Netlify (automated deployments)

## 🚀 Getting Started

### Prerequisites

- **Node.js** `>= v20.15.1`
- **Docker** for local database
- **Google Cloud SDK** (optional, only for deployment)

### Initial Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/finance-monorepo.git
   cd finance-monorepo
   ```

2. **Enable Corepack** (for pnpm management):
   ```bash
   corepack enable
   corepack prepare pnpm@10.4.1 --activate
   ```

3. **Verify pnpm installation**:
   ```bash
   pnpm -v  # Should display 10.4.1
   ```

4. **Install dependencies**:
   ```bash
   pnpm install
   ```

### Setting Up the Database

The project uses PostgreSQL in Docker for local development:

1. **Start the database**:
   ```bash
   pnpm --filter finance-api db:start
   ```

2. **Seed the database with initial data**:
   ```bash
   pnpm --filter finance-api db:seed
   ```

### Configure Environment Variables

1. **Create a .env file for the API**:
   ```bash
   cp apps/finance-api/.env.example apps/finance-api/.env.dev
   ```

2. **Edit the .env.dev file** to include necessary database connection details:
   ```
   DATABASE_TYPE=postgres
   API_VERSION=/api/v1
   PORT=3000
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/finance_dev
   ```

## 🖥️ Development Workflow

### Starting the Backend

```bash
# Start just the API in development mode
pnpm --filter finance-api dev

# Or from the API directory
cd apps/finance-api
pnpm dev
```

### Starting the Frontend

```bash
# Start just the frontend in development mode
pnpm --filter finance-web-app dev

# Or from the web app directory
cd apps/finance-web-app
pnpm dev
```

### Running the Entire Stack

From the root directory:
```bash
pnpm dev
```

This will start both the backend and frontend in development mode using Turborepo.

### Running Tests

```bash
# Run tests for a specific application
pnpm --filter finance-api test

# Run all tests in the monorepo
pnpm test
```

## 🏗️ Building for Production

### Building All Applications

```bash
pnpm build
```

### Building Specific Applications

```bash
pnpm --filter finance-api build
pnpm --filter finance-web-app build
```

## 🚀 Deployment

### Backend Deployment (Google Cloud Run)

The API is automatically deployed to Google Cloud Run when changes are pushed to the `main` branch via GitHub Actions. To manually deploy:

```bash
# Build and push Docker image, then deploy to Cloud Run
pnpm release:finance-api
```

You'll need Google Cloud credentials set up for this.

### Frontend Deployment (Netlify)

The web application is automatically deployed to Netlify when changes are pushed to the `main` branch. The deployment configuration is in `netlify.toml`.

## 🗃️ Infrastructure Management

The project uses Terraform to manage Google Cloud Platform infrastructure:

- Artifact Registry for Docker images
- Cloud Run service
- IAM permissions for GitHub Actions deployment
- Service accounts for the CI/CD pipeline

To apply infrastructure changes:

```bash
cd infra
terraform init
terraform apply
```

## 🧩 Working with Shared Packages

The monorepo includes shared packages in the `packages/` directory:

- **finance-types**: TypeScript interfaces shared between frontend and backend

To build shared packages:

```bash
pnpm --filter @finance/types build
```

## 🔄 Common Tasks

### Updating pnpm Version

1. Edit `packageManager` in the root `package.json`
2. Run `corepack prepare pnpm@[new-version] --activate`

### Resetting the Database

If you need to reset your local database:

```bash
docker stop pgdb
docker rm pgdb
docker volume prune -f
pnpm --filter finance-api db:start
pnpm --filter finance-api db:seed
```

### Adding a New Dependency

```bash
# Add to a specific workspace
pnpm --filter finance-api add express

# Add as a dev dependency
pnpm --filter finance-web-app add -D typescript

# Add to shared package
pnpm --filter @finance/types add -D typescript
```

## 📝 License

This project is licensed under the ISC License.
