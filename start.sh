#!/bin/sh
npx prisma db push
node dist/server.js