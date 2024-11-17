# syntax=docker.io/docker/dockerfile:1

FROM uselagoon/node-20-builder:latest AS builder
COPY package.* /app/
ENV NODE_ENV=production
RUN yarn --frozen-lockfile

FROM uselagoon/node-20:latest
COPY --from=builder /app/node_modules /app/node_modules
COPY . /app/

WORKDIR /app

ENV NODE_ENV=production

# Uncomment the following line in case you want to disable telemetry during runtime.
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs nodejs

COPY --from=builder /app .

# Set the correct permission for prerender cache
RUN mkdir -p /app/.next
RUN chown -R nextjs:nodejs /app/.next

# Deperate action I know
RUN chmod -R 777 /app/.next

RUN mkdir -p /tmp/.yarn-cache
RUN chown -R nextjs:nodejs /tmp/.yarn-cache

USER nextjs

EXPOSE 3000

CMD ["/app/lagoon/start.sh"]

# Use for debugging:
# CMD ["sleep", "infinity"]
