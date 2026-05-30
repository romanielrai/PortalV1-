FROM node:20-alpine AS builder
WORKDIR /workspace
COPY app/package.json app/package-lock.json* ./
COPY app/tsconfig.json app/tailwind.config.ts app/postcss.config.js app/next.config.mjs ./
COPY app/ .
RUN npm install
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /workspace
COPY --from=builder /workspace/.next .next
COPY --from=builder /workspace/node_modules node_modules
COPY --from=builder /workspace/package.json .
COPY app/public ./public
EXPOSE 3000
CMD ["npm", "start"]
