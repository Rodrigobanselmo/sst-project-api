FROM node:lts as builder

ENV NODE_ENV build

WORKDIR /app

RUN corepack enable

COPY package*.json ./
COPY yarn.lock ./
COPY prisma ./prisma/

RUN yarn install --frozen-lockfile

COPY . .

RUN npx prisma generate && yarn build

# ---

FROM node:lts

ENV NODE_ENV production

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules/
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist/
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/cert ./cert
COPY --from=builder /app/templates ./templates

EXPOSE 3333

# Run migrations and start the app (no rebuild needed - dist is already built)
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main --max-old-space-size=4096"]
