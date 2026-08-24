# Solana Betting dApp - Backend API

REST API backend with PostgreSQL database for indexing and querying Solana betting data.

## Features

- 📊 **Event Management**: Index and query betting events
- 🎲 **Bet Tracking**: Store and retrieve all bets with user history
- 📈 **Statistics**: Platform stats, leaderboards, analytics
- 🔍 **Transaction Indexing**: On-demand indexing of Solana transactions
- 🚀 **Performance**: PostgreSQL with optimized queries
- 🔒 **Security**: Rate limiting, CORS, input validation
- 📖 **RESTful API**: Clean, documented endpoints

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: PostgreSQL 14+
- **ORM**: Prisma
- **Language**: TypeScript
- **Validation**: Zod
- **Blockchain**: Solana Web3.js

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+ running locally or remote
- Solana program deployed to Devnet

## Installation

```bash
cd backend

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your database URL and settings

# Setup database
npm run db:push

# Generate Prisma client
npm run db:generate
```

## Database Setup

### Option 1: Local PostgreSQL

```bash
# Install PostgreSQL (macOS)
brew install postgresql@14
brew services start postgresql@14

# Create database
createdb solana_betting

# Update .env
DATABASE_URL="postgresql://localhost:5432/solana_betting?schema=public"
```

### Option 2: Docker

```bash
docker run --name postgres-betting \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=solana_betting \
  -p 5432:5432 \
  -d postgres:14
```

### Option 3: Cloud (Recommended for Production)

Use services like:
- [Supabase](https://supabase.com/) - Free tier available
- [Railway](https://railway.app/) - Free tier available
- [Neon](https://neon.tech/) - Serverless PostgreSQL

## Configuration

Create `.env` file:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/solana_betting?schema=public"

# Server
PORT=3001
NODE_ENV=development

# Solana
SOLANA_RPC_URL=https://api.devnet.solana.com
SOLANA_NETWORK=devnet
PROGRAM_ID=YOUR_PROGRAM_ID_HERE

# API
CORS_ORIGIN=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Running

### Development

```bash
npm run dev
```

Server starts at http://localhost:3001

### Production

```bash
npm run build
npm start
```

## API Endpoints

### Events

```
GET    /api/events              Get all events (with filters)
GET    /api/events/:eventId     Get single event
GET    /api/events/:eventId/stats  Get event statistics
```

**Query Parameters:**
- `status` - Filter by status (OPEN, CLOSED, RESOLVED)
- `category` - Filter by category
- `limit` - Results per page (default: 50)
- `offset` - Pagination offset (default: 0)

**Example:**
```bash
curl http://localhost:3001/api/events?status=OPEN&limit=10
```

### Bets

```
GET    /api/bets                Get all bets (with filters)
GET    /api/bets/user/:wallet   Get user's bets and statistics
GET    /api/bets/tx/:signature  Get bet by transaction signature
```

**Query Parameters:**
- `eventId` - Filter by event
- `bettor` - Filter by wallet address
- `claimed` - Filter by claim status
- `limit` - Results per page (default: 50)
- `offset` - Pagination offset (default: 0)

**Example:**
```bash
curl http://localhost:3001/api/bets/user/7xKp...9AbC
```

### Statistics

```
GET    /api/stats/platform      Get platform-wide statistics
GET    /api/stats/categories    Get stats by category
GET    /api/stats/leaderboard   Get top bettors leaderboard
```

**Query Parameters:**
- `limit` - Number of results (default: 10 for leaderboard)

**Example:**
```bash
curl http://localhost:3001/api/stats/platform
```

### Indexer

```
POST   /api/indexer/sync/:signature  Index a specific transaction
GET    /api/indexer/status           Get indexer status
```

**Example:**
```bash
curl -X POST http://localhost:3001/api/indexer/sync/5Gx...abc
```

### Health Check

```
GET    /health                  Health check endpoint
```

## API Response Examples

### Get Events

```json
{
  "events": [
    {
      "id": "clx123...",
      "eventId": 1,
      "title": "India vs Australia",
      "description": "Cricket World Cup Final",
      "category": "Sports",
      "status": "OPEN",
      "totalPool": "3500000000",
      "totalBets": 35,
      "outcomes": ["India", "Australia"],
      "outcomePools": ["1500000000", "2000000000"],
      "closeTime": "2024-12-25T10:00:00Z",
      "_count": {
        "bets": 35
      }
    }
  ],
  "pagination": {
    "total": 100,
    "limit": 50,
    "offset": 0
  }
}
```

### Get User Bets

```json
{
  "bets": [...],
  "statistics": {
    "totalBets": 12,
    "activeBets": 8,
    "wonBets": 3,
    "lostBets": 1,
    "totalWagered": "1200000000",
    "totalWinnings": "450000000",
    "winRate": "75.00"
  },
  "pagination": {
    "total": 12,
    "limit": 50,
    "offset": 0
  }
}
```

### Platform Statistics

```json
{
  "totalEvents": 42,
  "totalBets": 523,
  "totalVolume": "52500000000",
  "activeEvents": 15,
  "uniqueBettors": 127,
  "recentBets": [...]
}
```

## Database Schema

### Tables

- **platforms** - Platform configuration and stats
- **events** - Betting events
- **bets** - Individual bets
- **transactions** - Blockchain transaction records

### Relationships

- Event hasMany Bets
- Bet belongsTo Event

## Performance Optimization

### Database Indexes

```sql
-- Events
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_category ON events(category);
CREATE INDEX idx_events_close_time ON events(close_time);

-- Bets
CREATE INDEX idx_bets_bettor ON bets(bettor);
CREATE INDEX idx_bets_event_id ON bets(event_id);
CREATE INDEX idx_bets_claimed ON bets(claimed);

-- Transactions
CREATE INDEX idx_transactions_signature ON transactions(signature);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_signer ON transactions(signer);
```

### Caching Strategy (Future)

- Redis for frequent queries
- Cache platform stats (5 min TTL)
- Cache event lists (1 min TTL)
- Invalidate on new data

## Security

### Implemented

- ✅ Rate limiting (100 req/15min per IP)
- ✅ CORS configuration
- ✅ Input validation with Zod
- ✅ SQL injection prevention (Prisma ORM)
- ✅ Environment variables for secrets

### Recommended for Production

- [ ] API key authentication
- [ ] Request signing
- [ ] DDoS protection (Cloudflare)
- [ ] Database connection pooling
- [ ] Backup strategy
- [ ] Monitoring and alerts

## Deployment

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["npm", "start"]
```

### Environment Variables (Production)

```env
DATABASE_URL=<your_production_database>
NODE_ENV=production
PORT=3001
SOLANA_RPC_URL=https://api.devnet.solana.com
PROGRAM_ID=<your_program_id>
CORS_ORIGIN=https://yourdomain.com
```

## Monitoring

### Health Check

```bash
curl http://localhost:3001/health
```

### Database Connection

```bash
npx prisma db pull
```

### Logs

```bash
# Development
npm run dev

# Production (with PM2)
pm2 logs backend
```

## Testing

```bash
# Run tests (when implemented)
npm test

# Database studio
npm run db:studio
```

## Troubleshooting

### Database Connection Issues

```bash
# Check PostgreSQL is running
pg_isready

# Test connection
psql postgresql://localhost:5432/solana_betting

# Reset database
npm run db:push --force-reset
```

### Port Already in Use

```bash
# Find process
lsof -i :3001

# Kill process
kill -9 <PID>

# Or change PORT in .env
```

## Future Enhancements

- [ ] WebSocket subscriptions for real-time updates
- [ ] Automated background indexer
- [ ] GraphQL API
- [ ] Redis caching layer
- [ ] Comprehensive test suite
- [ ] API documentation (Swagger/OpenAPI)
- [ ] Webhook notifications
- [ ] Advanced analytics endpoints

## Contributing

See main repository [CONTRIBUTING.md](../CONTRIBUTING.md)

## License

MIT - See [LICENSE](../LICENSE)

---

**Need Help?** Open an issue on [GitHub](https://github.com/ritikravi/solana-betting-dapp/issues)
