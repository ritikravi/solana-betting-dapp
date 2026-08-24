# Demo Guide

Step-by-step guide to demonstrate the Solana Betting dApp MVP.

## Prerequisites

Before starting the demo, ensure:

- ✅ Solana program deployed to Devnet
- ✅ Frontend running at http://localhost:3000
- ✅ Phantom wallet installed and configured for Devnet
- ✅ At least 2 SOL in your Devnet wallet
- ✅ Platform initialized (one-time setup)

## Demo Flow (5 Minutes)

### Part 1: Introduction (30 seconds)

**What to show:**
- Landing page at http://localhost:3000
- Explain this is a decentralized betting platform on Solana
- Highlight "Devnet" badge (no real money)
- Point out key features: Secure, Fast, Transparent

**Key talking points:**
- "All bets recorded on Solana blockchain"
- "Complete transparency - no intermediaries"
- "Test environment using Devnet SOL"

### Part 2: Wallet Connection (30 seconds)

**Steps:**
1. Click "Connect Wallet" button
2. Select Phantom wallet
3. Approve connection
4. Show connected state (address displayed, green indicator)

**What to highlight:**
- Wallet address shown in navbar
- "Devnet" indicator visible
- Seamless connection experience

### Part 3: Browse Events (1 minute)

**Steps:**
1. Click "Events" in navigation
2. Show list of available betting events
3. Hover over event cards to show interactivity
4. Point out key information:
   - Event title and description
   - Category tags
   - Status badges (Open/Closed/Resolved)
   - Total pool amount
   - Number of bets
   - Closing time
   - Outcome pools

**Key talking points:**
- "Multiple event categories: Sports, Esports, Predictions"
- "Real-time pool tracking"
- "Events auto-close at specified time"

### Part 4: Place a Bet (2 minutes)

**Steps:**
1. Click on an event (e.g., "India vs Australia")
2. Show event details page:
   - Full description
   - Pool statistics
   - Outcome options
   - Current odds
3. In betting panel:
   - Select an outcome (e.g., "India")
   - Enter bet amount: 0.1 SOL
   - Show potential payout calculation (0.18 SOL for 1.8x)
4. Click "Place Bet"
5. Approve transaction in Phantom wallet
6. Wait for confirmation (3-5 seconds)
7. Show success message with transaction signature
8. Click "View on Explorer"

**What to highlight:**
- "Transaction requires wallet signature"
- "All funds held securely in program vault"
- "Transaction recorded immutably on blockchain"
- Point out transaction details on Solana Explorer:
  - Transaction signature
  - Block number
  - Fee amount
  - Account changes
  - Program logs

**Key talking points:**
- "Wallet signs transaction - we never touch your private keys"
- "Fixed 1.8x multiplier for MVP"
- "Sub-second transaction confirmation on Solana"

### Part 5: Dashboard (1 minute)

**Steps:**
1. Navigate to "Dashboard"
2. Show user statistics:
   - Total bets
   - Active bets
   - Won/lost bets
   - Total wagered
   - Total winnings
   - Win rate
3. Scroll through bet history
4. Show individual bet details:
   - Event name
   - Selected outcome
   - Bet amount
   - Potential payout
   - Status
   - Transaction link
5. Click transaction link to open Explorer

**Key talking points:**
- "Complete betting history on-chain"
- "Track performance and ROI"
- "Full transparency - verify any transaction"

### Part 6: Admin Panel (Optional - 1 minute)

**Steps:**
1. Navigate to "Admin" panel
2. Show create event form
3. Fill in example event:
   - Event ID: 4
   - Title: "New York vs Los Angeles"
   - Description: "Basketball championship game"
   - Category: Sports
   - Outcome 1: "New York"
   - Outcome 2: "Los Angeles"
   - Hours until close: 12
4. Click "Create Event"
5. Approve transaction
6. Show success message
7. Navigate back to Events page
8. Show newly created event

**Key talking points:**
- "Admin functions protected by smart contract"
- "Only platform authority can create events"
- "Events immutable once created"

## Demo Tips

### Preparation

1. **Pre-fund wallet:**
   ```bash
   solana airdrop 2
   ```

2. **Verify program deployed:**
   ```bash
   solana program show YOUR_PROGRAM_ID
   ```

3. **Test one bet beforehand:**
   - Ensure everything works
   - Have transaction signature ready to show

4. **Open Solana Explorer in advance:**
   - Have it ready in a separate tab
   - Can quickly show transaction details

### Handling Common Issues

**Wallet connection fails:**
- Refresh the page
- Check Phantom is on Devnet
- Try disconnecting and reconnecting

**Transaction fails:**
- Check you have enough SOL (0.1 + fees)
- Verify event is still open
- Check Devnet status: https://status.solana.com

**Slow transaction:**
- Devnet can be congested
- Wait up to 30 seconds
- Explain this wouldn't happen on Mainnet with priority fees

**Event not showing:**
- Explain MVP limitations (no indexer)
- Show how to refresh
- Mention production would have real-time updates

### Key Demo Scenarios

#### Scenario 1: First-Time User (3 minutes)
1. Land on homepage
2. Connect wallet
3. Browse events
4. Place first bet
5. View dashboard

#### Scenario 2: Power User (2 minutes)
1. Quick wallet connect
2. Navigate directly to event
3. Place bet
4. Show transaction on Explorer
5. Show dashboard history

#### Scenario 3: Admin (2 minutes)
1. Access admin panel
2. Create new event
3. Show event appears in listings
4. Explain resolution process

## Questions & Answers

**Q: Is this real money?**
A: No, this runs on Solana Devnet with test SOL. No real money involved.

**Q: How do I get Devnet SOL?**
A: Visit https://faucet.solana.com and request test SOL.

**Q: Can I lose my bet?**
A: Yes - if you pick the wrong outcome. But it's test SOL, so no real loss!

**Q: How are payouts calculated?**
A: For this MVP, we use a fixed 1.8x multiplier. Production would use dynamic odds based on pool ratios.

**Q: Who resolves events?**
A: Currently the platform admin manually resolves. Production would integrate oracles for automatic resolution.

**Q: Is the code audited?**
A: This is an MVP for demonstration. Production deployment would require professional security audit.

**Q: What happens if event is cancelled?**
A: MVP doesn't handle cancellations. Production would include refund mechanism.

**Q: Can I bet on multiple outcomes?**
A: Not currently. Each bet is a single outcome. Production could support parlays.

**Q: How long do transactions take?**
A: Usually 1-5 seconds on Devnet. Mainnet is typically sub-second.

**Q: What wallets are supported?**
A: Phantom, Solflare, and Backpack. More can be added easily.

## Advanced Demos

### Show the Smart Contract

```bash
# Show program account
solana program show YOUR_PROGRAM_ID

# Show program size
ls -lh target/deploy/betting.so

# Show program logs
solana logs YOUR_PROGRAM_ID
```

### Show Account Data

```bash
# Show platform account
solana account PLATFORM_PDA

# Show event account
solana account EVENT_PDA

# Show bet account
solana account BET_PDA
```

### Run Tests

```bash
cd program
anchor test
```

Show the test output to demonstrate:
- All test scenarios pass
- Error handling works
- Authorization checks function

### Code Walkthrough

If technical audience, show:

1. **Smart Contract Structure:**
   ```
   program/programs/betting/src/
   ├── lib.rs            # Program entry
   ├── state/           # Account structures
   ├── instructions/    # Business logic
   └── errors.rs        # Error types
   ```

2. **Key Security Features:**
   - PDA-based accounts
   - Authority validation
   - Signer checks
   - Integer overflow protection
   - Status validation

3. **Frontend Integration:**
   ```typescript
   // Show how transaction is built
   const tx = await program.methods
     .placeBet(eventId, outcomeIndex, amount)
     .accounts({...})
     .rpc();
   ```

## Post-Demo Actions

**For evaluators:**
1. Share GitHub repository
2. Provide setup documentation
3. Share Devnet program ID
4. Offer to walk through code

**For users:**
1. Encourage them to place test bets
2. Show how to get Devnet SOL
3. Guide them through dashboard
4. Answer any questions

**For developers:**
1. Show code structure
2. Explain architecture decisions
3. Discuss scaling considerations
4. Review security measures

## Demo Checklist

Before starting demo:
- [ ] Program deployed and working
- [ ] Frontend running on localhost
- [ ] Wallet connected to Devnet
- [ ] At least 2 SOL in wallet
- [ ] Platform initialized
- [ ] At least 2-3 events created
- [ ] Solana Explorer open in browser
- [ ] Backup tab with documentation
- [ ] Screen sharing ready (if remote)

## Success Metrics

A successful demo shows:
- ✅ Seamless wallet connection
- ✅ Smooth betting flow
- ✅ Quick transaction confirmation
- ✅ Transaction visible on Explorer
- ✅ Dashboard updates correctly
- ✅ Professional UI/UX
- ✅ No errors or crashes

---

**Remember:** This is an MVP. Acknowledge limitations while highlighting the working functionality and solid foundation for production development.
