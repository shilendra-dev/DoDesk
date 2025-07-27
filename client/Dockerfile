# === 🏗️ Stage 1: Dependencies ===
FROM node:22-alpine AS deps
WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm install --only=production && npm cache clean --force

# === 🏗️ Stage 2: Builder ===
FROM node:22-alpine AS builder
WORKDIR /app

# Pass backend URL at build time so Next.js embeds it in the client bundle
ARG NEXT_PUBLIC_BACKEND_URL
ENV NEXT_PUBLIC_BACKEND_URL=$NEXT_PUBLIC_BACKEND_URL


# Copy package files and install ALL dependencies (including dev)
COPY package*.json ./
RUN npm install

# Copy source code and build
COPY . .
RUN npm run build

# === 🚀 Stage 3: Production Runner ===
FROM node:22-alpine AS runner
WORKDIR /app

# Install curl for health checks
RUN apk add --no-cache curl

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy production dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package*.json ./

# Copy built application from builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Fix ownership for non-root user
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

# Health check that works with our setup
HEALTHCHECK --interval=30s --timeout=15s --start-period=120s --retries=5 \
  CMD curl -f http://localhost:3000 || (echo "Health check failed at $(date)" && exit 1)

# Use npm start (which works) instead of standalone server
CMD ["npm", "start"]