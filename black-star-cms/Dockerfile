FROM node:22.17.0-alpine

WORKDIR /app

# Disable telemetry to save memory and network
ENV NEXT_TELEMETRY_DISABLED=1

# 1. Copy dependency files
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./

# 2. Install ALL dependencies
RUN \
  if [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else npm install; \
  fi

# 3. Copy all application files
COPY . .

# 4. Build the application (File tracing is now bypassed!)
RUN npm run build

# 5. Set production environment, expose port, and start
ENV NODE_ENV=production
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["npm", "start"]