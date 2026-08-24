# Setup Guide

Complete step-by-step guide to run the Solana Betting dApp locally.

## Prerequisites

### Required Software

1. **Node.js & npm**
   - Version: 18.x or higher
   - Download: https://nodejs.org/

2. **Rust**
   - Version: 1.70 or higher
   - Install: `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh`

3. **Solana CLI**
   - Version: 1.18 or higher
   - Install: `sh -c "$(curl -sSfL https://release.solana.com/stable/install)"`

4. **Anchor CLI**
   - Version: 0.29.0
   - Install: `cargo install --git https://github.com/coral-xyz/anchor avm --locked`
   - Then: `avm install 0.29.0 && avm use 0.29.0`

5. **Solana Wallet**
   - Phantom (recommended): https://phantom.app/
   - Solflare: https://solflare.com/
   - Backpack: https://backpack.app/

### Verify Installation

```bash
node --version    # Should be v18.x or higher
npm --version     # Should be 9.x or higher
rustc --version   # Should be 1.70 or higher
solana --version  # Should be 1.18 or higher
anchor --version  # Should be 0.29.0
```

## Step 1: Create Solana Devnet Wallet

```bash
# Create a new wallet for deployment
solana-keygen new --outfile ~/.config/solana/devnet-wallet.json

# Set Solana to use Devnet
solana config set --url devnet

# Set the wallet as default
solana config set --keypair ~/.config/solana/devnet-wallet.json

# Check configuration
solana config get
```

**Expected output:**
```
Config File: /Users/yourname/.config/solana/cli/config.yml
RPC URL: https://api.devnet.solana.com
WebSocket URL: wss://api.devnet.solana.com/ (computed)
Keypair Path: /Users/yourname/.config/solana/devnet-wallet.json
Commitment: confirmed
```

## Step 2: Get Devnet SOL

```bash
# Airdrop 2 SOL (may need to run multiple times)
solana airdrop 2

# Check balance
solana balance
```

If airdrop fails, use the web faucet:
- Visit: https://faucet.solana.com/
- Enter your wallet address: `solana address`
- Request SOL

You'll need at least 3-4 SOL total for:
- Program deployment (~2 SOL)
- Account rent (~0.5 SOL)
- Testing transactions (~0.5-1 SOL)

## Step 3: Clone and Setup Project

```bash
# Clone the repository (or use your local directory)
cd solana-betting-dapp

# Install program dependencies
cd program
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

## Step 4: Build and Deploy Solana Program

```bash
cd program

# Build the program
anchor build

# Get the program ID
solana address -k target/deploy/betting-keypair.json
```

**Important:** Copy the program ID (something like `7xKp...9AbC`)

### Update Program ID

You need to update the program ID in two places:

1. **program/Anchor.toml**
```toml
[programs.devnet]
betting = "YOUR_PROGRAM_ID_HERE"
```

2. **program/programs/betting/src/lib.rs**
```rust
declare_id!("YOUR_PROGRAM_ID_HERE");
```

### Rebuild and Deploy

```bash
# Rebuild with correct program ID
anchor build

# Deploy to Devnet
anchor deploy --provider.cluster devnet
```

**Expected output:**
```
Deploying cluster: https://api.devnet.solana.com
Upgrade authority: /Users/yourname/.config/solana/devnet-wallet.json
Deploying program "betting"...
Program Id: 7xKp...9AbC

Deploy success
```

## Step 5: Initialize the Platform

The platform must be initialized before creating events.

```bash
# Run tests which include initialization
anchor test --skip-local-validator

# Or manually call initialize through frontend after setup
```

## Step 6: Configure Frontend

```bash
cd frontend

# Copy environment template
cp .env.example .env.local

# Edit .env.local with your program ID
```

**.env.local:**
```env
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_PROGRAM_ID=YOUR_PROGRAM_ID_HERE
```

Replace `YOUR_PROGRAM_ID_HERE` with the program ID from step 4.

## Step 7: Run Frontend

```bash
cd frontend

# Start development server
npm run dev
```

**Expected output:**
```
   ▲ Next.js 14.1.0
   - Local:        http://localhost:3000
   - Network:      http://192.168.1.x:3000

 ✓ Ready in 2.5s
```

Visit http://localhost:3000

## Step 8: Configure Wallet for Devnet

### Phantom Wallet

1. Open Phantom extension
2. Click Settings (gear icon)
3. Select "Developer Settings"
4. Change network to "Devnet"
5. Go back to main screen

### Solflare Wallet

1. Open Solflare extension
2. Click Settings
3. Select "Network"
4. Choose "Devnet"

## Step 9: Connect Wallet & Test

1. **Connect Wallet**
   - Click "Connect Wallet" button
   - Select your wallet (Phantom/Solflare)
   - Approve connection

2. **Get Devnet SOL** (for betting)
   - Copy your wallet address
   - Visit https://faucet.solana.com/
   - Request 2 SOL

3. **Browse Events**
   - Navigate to "Events" page
   - You should see demo events (or create one as admin)

4. **Place a Test Bet**
   - Click on an event
   - Select an outcome
   - Enter amount (e.g., 0.1 SOL)
   - Click "Place Bet"
   - Approve transaction in wallet

5. **View Dashboard**
   - Check your bet in the dashboard
   - View transaction on Solana Explorer

## Troubleshooting

### Program Deployment Fails

**Error:** Insufficient funds
```bash
# Get more SOL
solana airdrop 2
solana balance
```

**Error:** Program account already exists
```bash
# Use upgrade instead of deploy
anchor upgrade --program-id YOUR_PROGRAM_ID target/deploy/betting.so
```

### Wallet Connection Issues

1. **Wallet not installed**
   - Install Phantom or Solflare extension
   - Refresh the page

2. **Wrong network**
   - Ensure wallet is set to Devnet
   - Disconnect and reconnect

3. **Connection rejected**
   - Try refreshing the page
   - Clear browser cache
   - Try a different browser

### Transaction Failures

**Error:** "Transaction simulation failed"
- Check you have enough SOL (at least 0.1 + fees)
- Ensure event is still open for betting
- Verify you're on Devnet

**Error:** "Blockhash not found"
- Devnet can be slow/congested
- Wait a few seconds and try again
- Check https://status.solana.com/

### Frontend Build Errors

**Error:** Module not found
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

**Error:** TypeScript errors
```bash
# Check Node version
node --version  # Must be 18+

# Reinstall dependencies
npm install
```

### RPC Issues

If default RPC is slow:

1. **Try alternative Devnet RPC:**
   - https://api.devnet.solana.com (default)
   - https://devnet.genesysgo.net
   - https://rpc.ankr.com/solana_devnet

2. **Update .env.local:**
```env
NEXT_PUBLIC_SOLANA_RPC_URL=https://devnet.genesysgo.net
```

## Testing the Program

```bash
cd program

# Run all tests
anchor test

# Run specific test
anchor test --skip-local-validator
```

**Expected output:**
```
  betting
    ✔ Initializes the platform (450ms)
    ✔ Creates a betting event (380ms)
    ✔ Places a bet on an event (520ms)
    ✔ Prevents betting with invalid outcome (200ms)
    ✔ Closes an event (180ms)
    ✔ Resolves an event (190ms)

  6 passing (2s)
```

## Next Steps

1. **Create Events** - Use admin panel at http://localhost:3000/admin
2. **Place Bets** - Test the betting flow with different amounts
3. **Resolve Events** - Test the complete lifecycle
4. **Claim Payouts** - Verify winners can claim

## Production Checklist

Before deploying to mainnet (DO NOT DO THIS WITH CURRENT MVP):

- [ ] Complete security audit
- [ ] Implement proper admin multi-sig
- [ ] Add comprehensive error handling
- [ ] Set up monitoring and alerts
- [ ] Test with real economic incentives
- [ ] Implement refund mechanisms
- [ ] Add rate limiting
- [ ] Set up proper infrastructure
- [ ] Legal compliance review
- [ ] User testing and feedback

## Getting Help

- **Solana Docs:** https://docs.solana.com/
- **Anchor Docs:** https://www.anchor-lang.com/
- **Solana Stack Exchange:** https://solana.stackexchange.com/
- **Solana Discord:** https://discord.gg/solana

---

You're now ready to run and test the Solana Betting dApp!
