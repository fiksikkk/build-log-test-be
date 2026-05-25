#!/bin/sh
set -eu

echo "Starting application bootstrap..."

attempt=1
max_attempts=20

until pnpm prisma migrate deploy; do
  if [ "$attempt" -ge "$max_attempts" ]; then
    echo "Prisma migrations failed after $attempt attempts"
    exit 1
  fi

  echo "Database is not ready yet. Retry $attempt/$max_attempts in 3s..."
  attempt=$((attempt + 1))
  sleep 3
done

echo "Running seed..."
pnpm prisma db seed

echo "Starting NestJS server..."
exec node dist/main.js
