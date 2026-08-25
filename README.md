# Solana Betting dApp MVP

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Solana](https://img.shields.io/badge/Solana-Devnet-blueviolet)](https://solana.com/)
[![Anchor](https://img.shields.io/badge/Anchor-0.29.0-purple)](https://www.anchor-lang.com/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)

A decentralized betting platform built on Solana Devnet where users can place bets on events, with on-chain settlement and payouts.

![Solana Betting dApp](https://img.shields.io/badge/Status-MVP-success)
![Contributions Welcome](https://img.shields.io/badge/Contributions-Welcome-brightgreen)

## 🌐 Live Deployment

**🚀 Frontend:** [Your Vercel URL - Update after deployment]  
**📡 Backend API:** https://solana-betting-dapp-1.onrender.com  
**💾 GitHub Repository:** https://github.com/ritikravi/solana-betting-dapp  

**API Health Check:** https://solana-betting-dapp-1.onrender.com/api/health

## 🚀 Features

- **Wallet Integration**: Connect with Phantom, Solflare, and Backpack wallets
- **Real Solana Transactions**: All bets are recorded on Solana Devnet
- **Event Management**: Browse and bet on various events
- **User Dashboard**: Track your bets, winnings, and transaction history
- **Admin Panel**: Create events and resolve outcomes
- **Responsive UI**: Works on desktop, tablet, and mobile
- **Secure Smart Contract**: Anchor-based Solana program with proper validation

## 🏗️ Architecture

```
┌─────────────────────────────────────────────┐
│          Frontend (Next.js/TypeScript)       │
│  Landing | Events | Dashboard | Admin        │
│         Wallet Adapter | Web3.js             │
└──────────────────┬──────────────────────────┘
                   │
                   ├─────────────┐
                   │             │
                   ▼             ▼
        ┌──────────────┐  ┌──────────────┐
        │   Solana     │  │   Backend    │
        │   Devnet     │  │   API        │
        │              │  │ (Express.js) │
        │  Smart       │  └──────┬───────┘
        │  Contract    │         │
        └──────────────┘         ▼
                          ┌──────────────┐
                          │  PostgreSQL  │
                          │   Database   │
                          └──────────────┘
```

## 🛠️ Technology Stack

**Frontend:**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Solana Wallet Adapter
- Solana Web3.js

**Backend:**
- Node.js + Express.js
- PostgreSQL + Prisma ORM
- REST API with rate limiting
- Transaction indexing
- Docker support

**Smart Contract:**
- Rust
- Anchor Framework
- Solana Devnet

## 📋 Prerequisites

- Node.js 18+ and npm
- Rust 1.70+
- Solana CLI 1.18+
- Anchor CLI 0.29+
- A Solana wallet (Phantom recommended)
- Devnet SOL (free from faucet)

## 🔧 Installation

### 1. Clone and Install Dependencies

```bash
# Install frontend dependencies
cd frontend
npm install

# Install program dependencies (from root)
cd ../program
npm install
```

### 2. Environment Setup

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_PROGRAM_ID=<your_program_id_after_deployment>
NEXT_PUBLIC_API_URL=https://solana-betting-dapp-1.onrender.com/api
```

For backend (`backend/.env`):

```env
DATABASE_URL=<your_postgresql_url>
NODE_ENV=development
PORT=3001
PROGRAM_ID=<your_program_id>
SOLANA_RPC_URL=https://api.devnet.solana.com
SOLANA_NETWORK=devnet
CORS_ORIGIN=http://localhost:3000
```

### 3. Solana Wallet Setup

```bash
# Create a new wallet (if needed)
solana-keygen new --outfile ~/.config/solana/devnet-wallet.json

# Set to Devnet
solana config set --url devnet

# Airdrop SOL for testing
solana airdrop 2
```

### 4. Deploy Solana Program

```bash
cd program
anchor build
anchor deploy

# Copy the Program ID from output to frontend/.env.local
```

### 5. Run Backend (Optional - for local development)

```bash
cd backend
npm install
npx prisma generate
npm run dev
```

Backend runs on http://localhost:3001

### 6. Run Frontend

```bash
cd frontend
npm run dev
```

Visit http://localhost:3000

## 🧪 Testing

### Test Solana Program

```bash
cd program
anchor test
```

### Test Frontend

```bash
cd frontend
npm run build
npm run lint
```

## 🎮 Demo Instructions

### Quick Demo Flow

1. **Get Devnet SOL**
   - Visit https://faucet.solana.com
   - Enter your wallet address
   - Request 2 SOL

2. **Connect Wallet**
   - Open the app
   - Click "Connect Wallet"
   - Approve connection in Phantom

3. **Place a Bet**
   - Browse events
   - Click on an event
   - Select an outcome
   - Enter bet amount (e.g., 0.1 SOL)
   - Confirm transaction in wallet

4. **View Dashboard**
   - Check your active bets
   - View transaction history
   - See pending payouts

5. **Admin Functions** (if you're the admin)
   - Navigate to /admin
   - Create new events
   - Resolve completed events

## 🔒 Security Considerations

- All transactions require wallet signature
- Smart contract validates all inputs
- Authority checks on admin functions
- No private keys in code
- PDA-based account management
- Integer overflow protection
- Event status validation

## ⚠️ Known Limitations

- MVP runs on Devnet only (no real money)
- Simple fixed-multiplier payout model
- Admin authority is configured at deployment
- Limited to binary outcome events for MVP
- No real-time odds calculation
- Manual event resolution required

## 🚧 Future Improvements

- Dynamic odds based on pool size
- Multi-outcome events
- Live event updates via WebSockets
- Historical analytics
- Social features (leaderboards)
- Oracle integration for automatic resolution
- Mainnet deployment with proper tokenomics

## 📚 Project Structure

```
solana-betting-dapp/
├── frontend/                 # Next.js frontend
│   ├── app/
│   │   ├── page.tsx         # Landing page
│   │   ├── events/          # Events listing
│   │   ├── events/[id]/     # Event details & betting
│   │   ├── dashboard/       # User dashboard
│   │   └── admin/           # Admin panel
│   ├── components/
│   │   ├── wallet/          # Wallet connection
│   │   └── ui/              # UI components
│   └── lib/
│       ├── solana/          # Solana integration
│       └── api/             # API client
│
├── backend/                  # Express.js backend
│   ├── src/
│   │   ├── routes/          # API endpoints
│   │   ├── services/        # Blockchain indexer
│   │   └── middleware/      # Error handling
│   └── prisma/
│       └── schema.prisma    # Database schema
│
├── program/                  # Solana smart contract
│   ├── programs/betting/
│   │   └── src/
│   │       ├── lib.rs       # Program entry
│   │       ├── instructions/# Instruction handlers
│   │       └── state/       # Account structures
│   └── tests/
│       └── betting.ts       # Program tests
│
└── docs/                     # Documentation
    ├── ARCHITECTURE.md
    ├── DEPLOYMENT_GUIDE.md
    └── BACKEND_SETUP.md
```

## 📡 API Documentation

The backend provides the following REST endpoints:

### Events
- `GET /api/events` - List all events
- `GET /api/events/:id` - Get event details
- `GET /api/events/:id/bets` - Get bets for an event

### Bets
- `GET /api/bets` - List all bets
- `GET /api/bets/user/:wallet` - Get user's bets

### Statistics
- `GET /api/stats/platform` - Platform statistics
- `GET /api/stats/leaderboard` - Top winners

### Indexer
- `POST /api/indexer/sync` - Sync blockchain data
- `GET /api/health` - Health check

## 🚀 Deployment

This project is deployed on:
- **Frontend:** Vercel (Free tier)
- **Backend:** Render (Free tier)
- **Database:** Render PostgreSQL (Free tier)

For detailed deployment instructions, see [DEPLOYMENT_GUIDE.md](docs/DEPLOYMENT_GUIDE.md)

## 🤝 Contributing

This is an MVP for technical evaluation. Contributions welcome for production enhancements.

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

## 🆘 Troubleshooting

**Wallet won't connect:**
- Ensure you're on Devnet in wallet settings
- Refresh the page and try again

**Transaction failed:**
- Check you have sufficient SOL (at least 0.1 + fees)
- Verify event is still open for betting
- Check Devnet is not congested

**Program deployment failed:**
- Ensure you have enough SOL in deployer wallet
- Check Anchor version matches (0.29+)
- Verify Solana CLI is configured for Devnet

---

Built with ❤️ on Solana Devnet
