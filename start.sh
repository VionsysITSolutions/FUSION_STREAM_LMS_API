#!/bin/sh
echo "=== START.SH IS RUNNING ==="
echo "DATABASE_URL is: $DATABASE_URL"
npx prisma migrate deploy || exit 1
node dist/server.js