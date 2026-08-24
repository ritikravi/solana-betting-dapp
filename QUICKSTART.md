# Quick Start Guide

Get the Solana Betting dApp running in under 10 minutes.

## Prerequisites Check

```bash
# Verify you have everything installed
node --version    # Need 18+
npm --version     # Need 9+
rustc --version   # Need 1.70+
solana --version  # Need 1.18+
anchor --version  # Need 0.29.0
```

If missing any, see `docs/SETUP.md` for installation instructions.

## 1. Setup Solana Wallet (2 minutes)

```bash
# Create wallet
solana-keygen new --outfile ~/.config/solana/devnet-wallet.json

# Configure for Devnet
solana config set --url devnet
solana config set --keypair ~/.config/solana/devnet-wallet.json

# Get test SOL
solana airdrop 2
solana airdrop 2
solana balance  # Should show ~4 SOL
```

## 2. Deploy Smart Contract (3 minutes)

```bash
# Navigate to program directory
cd program

# Install dependencies
npm install

# Build program
anchor build

# Get program ID
solana address -k target/deploy/betting-keypair.json
# Copy this address!

# Update program ID in two files:
# 1. program/Anchor.toml - replace "BET111..." with your ID
# 2. program/programs/betting/src/lib.rs - replace declare_id!("BET111...")

# Rebuild with correct ID
anchor build

# Deploy to Devnet
anchor deploy
```

**Expected output:**
```
Deploying cluster: https://api.devnet.solana.com
Upgrade authority: /Users/.../.config/solana/devnet-wallet.json
Deploying program "betting"...
Program Id: YOUR_PROGRAM_ID_HERE

Deploy success
```

## 3. Setup Frontend (2 minutes)

```bash
# Navigate to frontend
cd ../frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Edit .env.local and set your program ID
# NEXT_PUBLIC_PROGRAM_ID=YOUR_PROGRAM_ID_HERE
```

## 4. Initialize Platform (1 minute)

The platform must be initialized once before creating events.

**Option A: Via Test**
```bash
cd ../program
anchor test --skip-local-validator
```

**Option B: Via Frontend**
- Start frontend (step 5)
- Connect wallet
- Go to /admin
- Click "Initialize Platform"

## 5. Start Frontend (1 minute)

```bash
cd frontend
npm run dev
```

Open http://localhost:3000

## 6. Setup Phantom Wallet (1 minute)

1. Install Phantom extension: https://phantom.app/
2. Create/import wallet
3. Click Settings → Developer Settings
4. Change network to "Devnet"
5. Request Devnet SOL from https://faucet.solana.com/

## 7. Test the App

### Connect Wallet
1. Click "Connect Wallet" button
2. Select Phantom
3. Approve connection
4. You should see your address in the nav bar

### Create Test Event (Admin)
1. Go to http://localhost:3000/admin
2. Fill in:
   - Event ID: 1
   - Title: "Test Event"
   - Description: "My first betting event"
   - Category: Sports
   - Outcome 1: "Team A"
   - Outcome 2: "Team B"
   - Hours until close: 24
3. Click "Create Event"
4. Approve transaction in Phantom
5. Wait for confirmation

### Place a Bet
1. Go to http://localhost:3000/events
2. Click on your event
3. Select an outcome
4. Enter amount: 0.1
5. Click "Place Bet"
6. Approve transaction
7. See success message with transaction link

### View Dashboard
1. Go to http://localhost:3000/dashboard
2. See your bet listed
3. Click transaction link to view on Solana Explorer

## Troubleshooting

### "Transaction simulation failed"
- Make sure you have enough SOL (at least 0.5)
- Verify you're on Devnet in Phantom
- Check program is deployed: `solana program show YOUR_PROGRAM_ID`

### "Platform not initialized"
- Run: `cd program && anchor test --skip-local-validator`
- Or use admin panel Initialize Platform button

### "Module not found" errors
- Delete node_modules: `rm -rf node_modules package-lock.json`
- Reinstall: `npm install`

### "Wallet connection failed"
- Refresh page
- Check Phantom is on Devnet
- Try disconnecting and reconnecting

### Need more help?
See `docs/SETUP.md` for detailed troubleshooting.

## Next Steps

- Create more events in admin panel
- Place bets with different amounts
- Resolve events to test payout claims
- Review code in `program/programs/betting/src/`
- Read architecture docs in `docs/ARCHITECTURE.md`
- Follow demo guide in `docs/DEMO.md`

## Common Commands

```bash
# Check Solana config
solana config get

# Check wallet balance
solana balance

# Get more Devnet SOL
solana airdrop 2

# Rebuild program
cd program && anchor build

# Run program tests
cd program && anchor test

# Start frontend dev server
cd frontend && npm run dev

# Build frontend for production
cd frontend && npm run build
```

## Project Structure Quick Reference

```
solana-betting-dapp/
├── program/              # Solana smart contract
│   ├── programs/betting/ # Rust program code
│   └── tests/           # Program tests
├── frontend/            # Next.js web app
│   ├── app/            # Pages (/, /events, /dashboard, /admin)
│   ├── components/     # React components
│   └── lib/            # Solana integration
└── docs/               # Documentation
```

## Success! 🎉

You now have a working Solana betting dApp running on Devnet.

- **Frontend:** http://localhost:3000
- **Program ID:** Check `.env.local`
- **Network:** Solana Devnet
- **Wallet:** Phantom on Devnet

Explore the app, place some test bets, and check out the documentation for more details!
