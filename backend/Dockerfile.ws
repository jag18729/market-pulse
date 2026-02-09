# WebSocket Server Dockerfile
FROM denoland/deno:1.40.0

WORKDIR /app

# Copy source
COPY deno.json .
COPY src/websocket.ts src/websocket.ts
COPY src/services/ src/services/

# Cache imports
RUN deno cache src/websocket.ts

# Run as non-root
USER deno

EXPOSE 3004

CMD ["run", "--allow-net", "--allow-env", "--allow-read", "src/websocket.ts"]
