FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
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
