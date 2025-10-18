FROM node:24-alpine AS deps
WORKDIR /app
COPY package.json yarn.lock* pnpm-lock.yaml* package-lock.json* ./
RUN set -eux; \
  if [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable; corepack prepare pnpm@latest --activate; pnpm install --frozen-lockfile; \
  elif [ -f yarn.lock ]; then corepack enable; corepack prepare yarn@1.22.22 --activate; yarn install --frozen-lockfile; \
  else npm install; fi

FROM node:24-alpine AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

ARG NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL} npm run build

FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
CMD ["npm", "run", "start"]
