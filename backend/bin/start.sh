#!/bin/sh

set -e

echo "🚀 Starting Dodesk Backend..."

# Debug: Print DATABASE_URL (hide password)
echo "🔍 Checking DATABASE_URL..."
echo "DATABASE_URL: ${DATABASE_URL//:*@/*@}"

# Wait for database to be ready with detailed error reporting
echo "⏳ Checking database connectivity..."
attempt=1
until echo "SELECT 1;" | npx prisma db execute --schema=/app/prisma/schema.prisma --stdin > /dev/null 2>&1; do
  echo "Attempt $attempt: Database not ready, waiting..."
  echo "Testing connection with detailed error output..."
  
  # Show the actual error
  echo "SELECT 1;" | npx prisma db execute --stdin 2>&1 || echo "Connection failed with error above"
  
  echo "Sleeping for 5 seconds..."
  sleep 5
  attempt=$((attempt + 1))
  
  # Stop after 10 attempts (50 seconds)
  if [ $attempt -gt 10 ]; then
    echo "❌ Database connection failed after 10 attempts. Exiting."
    echo "🔍 Final connection test with full error:"
    echo "SELECT 1;" | npx prisma db execute --stdin
    exit 1
  fi
done
echo "✅ Database is ready!"

# Run migrations
echo "🔄 Running database migrations..."
npx prisma migrate deploy
echo "✅ Migrations completed!"

# Start the application
echo "🚀 Starting application..."
exec npm start