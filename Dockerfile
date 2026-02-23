# ============================================
# Mono Project - Workflow Canvas Dockerfile
# ============================================
# Multi-stage build for React + Vite application

# ============================================
# Stage 1: Dependencies
# ============================================
FROM node:20-alpine AS deps

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./
COPY apps/workflow-canvas/package.json ./apps/workflow-canvas/
COPY packages/central-nodes/package.json ./packages/central-nodes/
COPY packages/central-popups/package.json ./packages/central-popups/

# Install dependencies
RUN npm ci

# ============================================
# Stage 2: Builder
# ============================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/workflow-canvas/node_modules ./apps/workflow-canvas/node_modules 2>/dev/null || true

# Copy source files
COPY package.json package-lock.json turbo.json ./
COPY apps/workflow-canvas ./apps/workflow-canvas
COPY packages ./packages

# Build packages first, then the app
RUN npm run build --workspace=@workflow/central-popups 2>/dev/null || true
RUN npm run build --workspace=workflow-canvas

# ============================================
# Stage 3: Production - Nginx
# ============================================
FROM nginx:alpine AS runner

# Copy custom nginx config
COPY apps/workflow-canvas/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets
COPY --from=builder /app/apps/workflow-canvas/dist /usr/share/nginx/html

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
