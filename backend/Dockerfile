FROM node:24-alpine AS builder
WORKDIR /app

# Install dependencies based on the lock file
COPY package.json yarn.lock* pnpm-lock.yaml* package-lock.json* ./

RUN set -eux; \
  if [ -f package-lock.json ]; then \
    npm ci; \
  elif [ -f pnpm-lock.yaml ]; then \
    corepack enable; corepack prepare pnpm@latest --activate; pnpm install --frozen-lockfile; \
  elif [ -f yarn.lock ]; then \
    corepack enable; corepack prepare yarn@1.22.22 --activate; yarn install --frozen-lockfile; \
  else \
    npm install; \
  fi

# Copy the rest of the application code
COPY . .

# Build the application
RUN npx prisma generate
RUN npm run build

# Production image
FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy only the necessary files from the builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json

# Expose the application port
EXPOSE 4000

# Start the application with database migrations and seeding
CMD sh -c '\
  npx prisma migrate deploy && npm run prisma:seed && \
  if [ -f dist/main.js ]; then node dist/main.js; \
  elif [ -f dist/src/main.js ]; then node dist/src/main.js; \
  elif [ -f dist/apps/api/main.js ]; then node dist/apps/api/main.js; \
  else echo "❌ No se encontró el entry de Nest en dist/. Revise build output."; ls -R dist || true; exit 1; fi'
