FROM uselagoon/node-20-builder:latest as builder
COPY package.json /app/
RUN yarn

FROM uselagoon/node-20:latest
COPY --from=builder /app/node_modules /app/node_modules
COPY . /app/

EXPOSE 3000

# Deparate I know
RUN mkdir -p /app/.next/trace
RUN chmod -R 777 /app/.next

CMD ["/app/lagoon/start.sh"]
