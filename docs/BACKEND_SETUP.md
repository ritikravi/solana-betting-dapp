# Backend Setup Guide

Complete guide to setting up and running the backend API with PostgreSQL database.

## Overview

The backend provides:
- REST API for querying events and bets
- PostgreSQL database for data persistence
- Transaction indexing from Solana blockchain
- Platform statistics and analytics
- User bet history and leaderboards

## Quick Start

### Using Docker (Recommended)

```bash
# From project root
docker-compose up -d

# Backend will be available at http://localhost:3001
# PostgreSQL will be available at localhost:5432
```

### Manual Setup

#### 1. Install PostgreSQL

**macOS:**
```bash
brew install postgresql@14
brew services start postgresql@14
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

**Windows:**
Download from https://www.postgresql.org/download/windows/

#### 2. Create Database

```bash
# Access PostgreSQL
psql postgres

# Create database
CREATE DATABASE solana_betting;

# Create user (optional)
CREATE USER betting_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE solana_betting TO betting_user;

# Exit
\q
```

#### 3. Configure Backend

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

Edit `.env`:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/solana_betting?schema=public"
PORT=3001
NODE_ENV=development
SOLANA_RPC_URL=https://api.devnet.solana.com
SOLANA_NETWORK=devnet
PROGRAM_ID=YOUR_PROGRAM_ID_HERE
CORS_ORIGIN=http://localhost:3000
```

#### 4. Initialize Database

```bash
# Push schema to database
npm run db:push

# Generate Prisma client
npm run db:generate

# Optional: Open Prisma Studio to view data
npm run db:studio
```

#### 5. Start Backend

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm run build
npm start
```

Backend will start at http://localhost:3001

## Verify Installation

### Test Health Endpoint

```bash
curl http://localhost:3001/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-12-24T10:00:00.000Z"
}
```

### Test Events Endpoint

```bash
curl http://localhost:3001/api/events
```

Expected response:
```json
{
  "events": [],
  "pagination": {
    "total": 0,
    "limit": 50,
    "offset": 0
  }
}
```

## Database Management

### View Database with Prisma Studio

```bash
cd backend
npm run db:studio
```

Opens GUI at http://localhost:5555

### Database Migrations

```bash
# Create a new migration
npm run db:migrate

# Push schema changes without migration
npm run db:push

# Reset database (⚠️ deletes all data)
npm run db:push -- --force-reset
```

### Manual Database Access

```bash
# Connect to database
psql postgresql://localhost:5432/solana_betting

# List tables
\dt

# Query events
SELECT * FROM events LIMIT 10;

# Query bets
SELECT * FROM bets ORDER BY timestamp DESC LIMIT 10;

# Exit
\q
```

## Indexing Transactions

The backend can index Solana transactions to populate the database.

### Manual Indexing

After a bet is placed, index the transaction:

```bash
curl -X POST http://localhost:3001/api/indexer/sync/YOUR_TX_SIGNATURE
```

### Automatic Indexing (Future)

The indexer can be configured to automatically monitor the Solana program and index all transactions in real-time.

## Frontend Integration

Update `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

The frontend will now fetch data from the backend instead of directly from Solana RPC.

### Benefits

- **Faster queries**: Database is optimized for reads
- **Complex filters**: Filter by status, category, etc.
- **Analytics**: Platform stats, leaderboards
- **History**: Complete bet history per user
- **Pagination**: Handle large datasets efficiently

## API Endpoints

### Events

```bash
# Get all events
GET /api/events

# Get single event
GET /api/events/:eventId

# Get event statistics
GET /api/events/:eventId/stats
```

### Bets

```bash
# Get all bets
GET /api/bets

# Get user's bets
GET /api/bets/user/:wallet

# Get bet by transaction
GET /api/bets/tx/:signature
```

### Statistics

```bash
# Platform statistics
GET /api/stats/platform

# Category statistics
GET /api/stats/categories

# Leaderboard
GET /api/stats/leaderboard
```

### Indexer

```bash
# Index a transaction
POST /api/indexer/sync/:signature

# Get indexer status
GET /api/indexer/status
```

## Production Deployment

### Using Railway

1. Create account at https://railway.app
2. Create new project
3. Add PostgreSQL database
4. Add web service (connect GitHub repo)
5. Set environment variables
6. Deploy

### Using Heroku

```bash
# Install Heroku CLI
brew install heroku

# Login
heroku login

# Create app
heroku create your-app-name

# Add PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev

# Deploy
git push heroku main
```

### Using Vercel + Supabase

1. Deploy frontend to Vercel
2. Create PostgreSQL database at https://supabase.com
3. Deploy backend to Vercel or Railway
4. Configure environment variables

### Environment Variables (Production)

```env
DATABASE_URL=<your_production_database_url>
NODE_ENV=production
PORT=3001
SOLANA_RPC_URL=https://api.devnet.solana.com
PROGRAM_ID=<your_program_id>
CORS_ORIGIN=https://yourdomain.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Monitoring

### Check Backend Logs

```bash
# Development
npm run dev

# Production (with PM2)
pm2 logs backend

# Docker
docker-compose logs -f backend
```

### Check Database Connections

```bash
# List active connections
psql -d solana_betting -c "SELECT * FROM pg_stat_activity;"

# Check database size
psql -d solana_betting -c "SELECT pg_size_pretty(pg_database_size('solana_betting'));"
```

## Troubleshooting

### Backend won't start

**Error: Cannot connect to database**
```bash
# Check PostgreSQL is running
pg_isready

# Check DATABASE_URL in .env
echo $DATABASE_URL

# Try connecting manually
psql $DATABASE_URL
```

**Error: Port 3001 already in use**
```bash
# Find process
lsof -i :3001

# Kill process
kill -9 <PID>

# Or change PORT in .env
```

### Database Issues

**Error: Prisma schema out of sync**
```bash
npm run db:generate
npm run db:push
```

**Error: Migration failed**
```bash
# Reset database (⚠️ deletes data)
npm run db:push -- --force-reset
```

### Docker Issues

**Container won't start**
```bash
# View logs
docker-compose logs backend
docker-compose logs postgres

# Restart services
docker-compose restart

# Rebuild
docker-compose up --build
```

## Performance Optimization

### Database Indexes

Already configured in Prisma schema:
- Events: status, category, closeTime
- Bets: bettor, eventId, claimed
- Transactions: signature, type, signer

### Connection Pooling

Add to DATABASE_URL:
```
postgresql://user:pass@host:5432/db?connection_limit=10
```

### Caching (Future)

- Add Redis for frequently accessed data
- Cache platform stats (5 min TTL)
- Cache event lists (1 min TTL)
- Invalidate on updates

## Backup Strategy

### Manual Backup

```bash
# Backup database
pg_dump solana_betting > backup_$(date +%Y%m%d).sql

# Restore from backup
psql solana_betting < backup_20241224.sql
```

### Automated Backups

**Using cron:**
```bash
# Add to crontab
0 2 * * * pg_dump solana_betting > /backups/db_$(date +\%Y\%m\%d).sql
```

**Using cloud provider:**
- Railway: Automatic backups included
- Supabase: Point-in-time recovery
- Heroku: Manual backup snapshots

## Security Checklist

- [ ] Change default PostgreSQL password
- [ ] Use strong DATABASE_URL credentials
- [ ] Enable SSL for database connection (production)
- [ ] Configure CORS_ORIGIN for production domain
- [ ] Set appropriate rate limits
- [ ] Use environment variables for all secrets
- [ ] Enable database connection encryption
- [ ] Regular security updates
- [ ] Monitor for unusual activity

## Next Steps

1. ✅ Backend running
2. ✅ Database connected
3. ✅ API endpoints working
4. Configure automatic transaction indexing
5. Add Redis caching
6. Set up monitoring (Sentry, LogRocket)
7. Configure CI/CD pipeline
8. Deploy to production

---

**Need Help?** Check the [main documentation](../README.md) or open an [issue](https://github.com/ritikravi/solana-betting-dapp/issues).
