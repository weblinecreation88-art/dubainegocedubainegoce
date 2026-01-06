# Utilise l'image Node.js officielle
FROM node:20-alpine AS base

# Étape 1: Installer les dépendances
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copier les fichiers de configuration
COPY package.json package-lock.json* ./
RUN npm ci --legacy-peer-deps

# Étape 2: Builder l'application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Désactiver la télémétrie Next.js pendant le build
ENV NEXT_TELEMETRY_DISABLED 1

# Build de l'application
RUN npm run build

# Étape 3: Image de production
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Créer un groupe et utilisateur non-root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copier les fichiers nécessaires
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Copier les fichiers du build Next.js
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

# Exposer le port
EXPOSE 8080

ENV PORT 8080
ENV HOSTNAME "0.0.0.0"

# Démarrer l'application
CMD ["node", "server.js"]
