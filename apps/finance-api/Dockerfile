# --- Build stage ---
FROM node:20-alpine AS builder

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10.4.1 --activate

# Copy the entire monorepo to the build context
COPY . .

# Install all monorepo dependencies
RUN pnpm install --no-frozen-lockfile

# Build only the target API
RUN pnpm turbo run build --filter=finance-api...

# --- Runtime stage ---
FROM node:20-alpine

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10.4.1 --activate

COPY --from=builder /app/apps/finance-api /app/apps/finance-api
COPY --from=builder /app/packages/finance-types /app/packages/finance-types
COPY --from=builder /app/pnpm-workspace.yaml ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/package.json ./

ENV PNPM_IGNORE_SCRIPTS=true

RUN pnpm install --prod --filter=finance-api... --ignore-scripts

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "apps/finance-api/dist/src/index.js"]
