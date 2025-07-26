# === 🏗️ Stage 1: Builder =========================
FROM node:22-alpine AS builder

WORKDIR /app

# Install all dependencies (including devDependencies)
COPY package*.json ./
RUN npm ci

# Copy everything and generate Prisma client
COPY . .
RUN npx prisma generate

# === 🚀 Stage 2: Production =========================
FROM node:22-alpine AS production

WORKDIR /app

# Install curl for healthcheck
RUN apk add --no-cache curl

# Copy only production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy built files and prisma client from builder stage
COPY --from=builder /app/node_modules/.prisma /app/node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma /app/node_modules/@prisma
COPY --from=builder /app/src /app/src
COPY --from=builder /app/bin /app/bin
COPY --from=builder /app/prisma /app/prisma
COPY --from=builder /app/*.js /app/

# Make startup script executable
RUN chmod +x /app/bin/start.sh

EXPOSE 5033

HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:5033/health || exit 1

CMD ["/app/bin/start.sh"]