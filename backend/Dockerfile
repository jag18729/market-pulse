# Backend API Dockerfile (ARM64 compatible)
FROM denoland/deno:alpine

WORKDIR /app

# Copy source
COPY . .

# Cache dependencies
RUN deno cache src/server.ts || true

# Run as non-root
USER deno

EXPOSE 3003

CMD ["run", "--allow-net", "--allow-env", "--allow-read", "src/server.ts"]
