# Backend API Dockerfile
FROM denoland/deno:1.40.0

WORKDIR /app

# Cache dependencies
COPY deno.json .
RUN deno cache --reload src/server.ts || true

# Copy source
COPY . .

# Cache all imports
RUN deno cache src/server.ts

# Run as non-root
USER deno

EXPOSE 3003

CMD ["run", "--allow-net", "--allow-env", "--allow-read", "src/server.ts"]
