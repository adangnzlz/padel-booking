# # --- Build stage ---
#     FROM node:20-alpine AS builder

#     WORKDIR /app
    
#     ARG APP=booking-api
    
#     RUN corepack enable && corepack prepare pnpm@10.4.1 --activate
    
#     COPY . .
    
#     RUN pnpm install --no-frozen-lockfile
    
#     RUN pnpm turbo run build --filter=${APP}...
    
#     # --- Runtime stage ---
#     FROM node:20-alpine
    
#     WORKDIR /app
    
#     ARG APP=booking-api
    
#     RUN corepack enable && corepack prepare pnpm@10.4.1 --activate
    
#     # Copy built app and required packages
#     COPY --from=builder /app/apps/${APP} /app/apps/${APP}
#     COPY --from=builder /app/packages /app/packages
#     COPY --from=builder /app/pnpm-workspace.yaml ./
#     COPY --from=builder /app/pnpm-lock.yaml ./
#     COPY --from=builder /app/package.json ./
    
#     ENV PNPM_IGNORE_SCRIPTS=true
    
#     RUN pnpm install --prod --filter=${APP}... --ignore-scripts
    
#     ENV NODE_ENV=production
#     EXPOSE 3000
    
#     ENV APP=booking-api
#     ENTRYPOINT sh -c "node apps/${APP}/dist/src/index.js"

    