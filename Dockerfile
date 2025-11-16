# ========== Base =============
FROM node:20-alpine AS base
WORKDIR /app
RUN corepack enable pnpm

# ===== Build args =====
ARG NEXT_PUBLIC_DIRECTUS_URL
ARG DIRECTUS_URL
ARG DIRECTUS_TOKEN
ARG NEXT_PUBLIC_ASSETS_URL
ARG MONO_TOKEN
ARG DIRECTUS_BASE_URL
ARG NOVA_POSHTA_API_KEY
ARG RESEND_API_KEY
ARG CLIENT_ORDER_URL_BASE

ENV NEXT_PUBLIC_DIRECTUS_URL=$NEXT_PUBLIC_DIRECTUS_URL
ENV DIRECTUS_URL=$DIRECTUS_URL
ENV DIRECTUS_TOKEN=$DIRECTUS_TOKEN
ENV NEXT_PUBLIC_ASSETS_URL=$NEXT_PUBLIC_ASSETS_URL
ENV MONO_TOKEN=$MONO_TOKEN
ENV DIRECTUS_BASE_URL=$DIRECTUS_BASE_URL
ENV NOVA_POSHTA_API_KEY=$NOVA_POSHTA_API_KEY
ENV RESEND_API_KEY=$RESEND_API_KEY
ENV CLIENT_ORDER_URL_BASE=$CLIENT_ORDER_URL_BASE

# ========== Dependencies =============
FROM base AS deps
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# ========== Build =============
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN pnpm build

# ========== Runner =============
FROM node:20-alpine AS runner
WORKDIR /app

RUN addgroup -g 1001 nodejs
RUN adduser -u 1001 -G nodejs -S nextjs
USER nextjs

COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

ENV PORT=3000
EXPOSE 3000

CMD ["node", "server.js"]
