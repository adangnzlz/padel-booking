# Booking Monorepo

> **Personal Project Statement**: This personal project is a sandbox for testing out technologies and exploring best practices. It does not aim to provide the optimal solution for the specific problem implemented, but rather to serve as a learning and experimentation platform.

This monorepo contains a full-stack booking application with a TypeScript/Express API backend and a React/Vite frontend, managed using Turbo and pnpm workspaces.

## 📋 Repository Structure

```
booking-monorepo/
├── apps/
│   ├── booking-api/        # Backend Express API
│   └── booking-web-app/    # Frontend React application
├── packages/
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

### Backend (booking-api)
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

### Frontend (booking-web-app)
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
   git clone https://github.com/your-username/padel-booking.git
   cd padel-booking
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
   pnpm --filter booking-api db:start
   ```

2. **Seed the database with initial data**:
   ```bash
   pnpm --filter booking-api db:seed
   ```

### Configure Environment Variables

1. **Create a .env file for the API**:
   ```bash
   cp apps/booking-api/.env.example apps/booking-api/.env.dev
   ```

2. **Edit the .env.dev file** to include necessary database connection details:
   ```
   DATABASE_TYPE=postgres
   API_VERSION=/api/v1
   PORT=3000
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/padel_dev
   ```

## 🖥️ Development Workflow

### Starting the Backend

```bash
# Start just the API in development mode
pnpm --filter booking-api dev

# Or from the API directory
cd apps/booking-api
pnpm dev
```

### Starting the Frontend

```bash
# Start just the frontend in development mode
pnpm --filter booking-web-app dev

# Or from the web app directory
cd apps/booking-web-app
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
pnpm --filter booking-api test

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
pnpm --filter booking-api build
pnpm --filter booking-web-app build
```

## 🚀 Deployment

### Backend Deployment (Google Cloud Run)

The API is automatically deployed to Google Cloud Run when changes are pushed to the `main` branch via GitHub Actions. To manually deploy:

```bash
# Build and push Docker image, then deploy to Cloud Run
pnpm release:booking-api
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
pnpm --filter booking-api db:start
pnpm --filter booking-api db:seed
```

### Adding a New Dependency

```bash
# Add to a specific workspace
pnpm --filter booking-api add express

# Add as a dev dependency
pnpm --filter booking-web-app add -D typescript
```

## 📝 License

This project is licensed under the ISC License.
