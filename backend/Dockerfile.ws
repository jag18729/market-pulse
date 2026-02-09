# WebSocket Server Dockerfile (ARM64 compatible)
FROM denoland/deno:alpine

WORKDIR /app

# Copy source
COPY deno.json .
COPY src/websocket.ts src/websocket.ts
COPY src/services/ src/services/

# Cache imports
RUN deno cache src/websocket.ts || true

# Run as non-root
USER deno

EXPOSE 3004

CMD ["run", "--allow-net", "--allow-env", "--allow-read", "src/websocket.ts"]
