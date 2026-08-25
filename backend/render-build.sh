#!/bin/bash
set -e

echo "📦 Installing dependencies..."
npm install

echo "🔄 Generating Prisma client..."
npx prisma generate

echo "📊 Pushing database schema..."
npx prisma db push --accept-data-loss

echo "🏗️ Building application..."
npm run build

echo "✅ Build complete!"
