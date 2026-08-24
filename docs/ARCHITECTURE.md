# Architecture Documentation

## System Overview

The Solana Betting dApp is a full-stack decentralized application built on Solana Devnet consisting of three main components:

1. **Solana Program** - Smart contract written in Rust using Anchor framework
2. **Frontend** - Next.js web application with TypeScript
3. **On-Chain State** - All betting data stored on Solana blockchain

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Next.js    │  │   Wallet     │  │   Solana     │      │
│  │   Pages      │◄─┤   Adapter    │◄─┤   Web3.js    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└────────────────────────────┬────────────────────────────────┘
                             │
                             │ RPC Calls
                             │
┌────────────────────────────▼────────────────────────────────┐
│                     Solana Devnet                            │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Betting Program (Rust/Anchor)           │   │
│  │                                                       │   │
│  │  Instructions:                                       │   │
│  │  • initialize_platform                               │   │
│  │  • create_event                                      │   │
│  │  • place_bet                                         │   │
│  │  • close_event                                       │   │
│  │  • resolve_event                                     │   │
│  │  • claim_payout                                      │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                   Program Accounts                    │   │
│  │                                                       │   │
│  │  • Platform (PDA)                                    │   │
│  │  • BettingEvent (PDA per event)                      │   │
│  │  • Bet (PDA per bet)                                 │   │
│  │  • Vault (PDA per event - holds funds)              │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
```

## Component Details

### 1. Solana Program (Smart Contract)

**Location:** `program/programs/betting/`

**Technology:** Rust, Anchor Framework 0.29.0

**Key Files:**
- `lib.rs` - Program entry point and instruction definitions
- `state/` - Account structures (Platform, BettingEvent, Bet)
- `instructions/` - Business logic for each instruction
- `errors.rs` - Custom error types

**Account Structure:**

```rust
Platform (PDA: ["platform"])
├── authority: Pubkey
├── total_events: u64
├── total_bets: u64
└── total_volume: u64

BettingEvent (PDA: ["event", event_id])
├── event_id: u64
├── authority: Pubkey
├── title: String
├── description: String
├── outcomes: Vec<String>
├── outcome_pools: Vec<u64>
├── status: EventStatus
├── start_time: i64
├── close_time: i64
├── winning_outcome: Option<u8>
└── total_pool: u64

Bet (PDA: ["bet", event_id, bettor, bet_index])
├── bettor: Pubkey
├── event_id: u64
├── outcome_index: u8
├── amount: u64
├── potential_payout: u64
├── claimed: bool
└── timestamp: i64

Vault (PDA: ["vault", event_id])
└── (Holds SOL for event payouts)
```

**Security Features:**
- PDA-based account derivation for security
- Authority checks on admin functions
- Signer validation on all transactions
- Event status validation
- Integer overflow protection with checked arithmetic
- Time-based betting window enforcement

### 2. Frontend Application

**Location:** `frontend/`

**Technology:** Next.js 14, TypeScript, Tailwind CSS, Solana Wallet Adapter

**Key Directories:**
- `app/` - Next.js app router pages
- `components/` - Reusable React components
- `lib/` - Utility functions and Solana integration
- `hooks/` - Custom React hooks

**Pages:**
- `/` - Landing page with product overview
- `/events` - Browse all betting events
- `/events/[id]` - Event details and betting interface
- `/dashboard` - User's bet history and stats
- `/admin` - Admin panel for event management

**State Management:**
- Wallet state via Solana Wallet Adapter
- On-chain data fetched directly via Solana Web3.js
- React Query for caching and synchronization (optional enhancement)

### 3. Data Flow

**Placing a Bet:**

```
User Action → Frontend Validates → Build Transaction →
→ Wallet Signs → Send to Solana → Program Validates →
→ Transfer SOL to Vault → Create Bet Account →
→ Update Event State → Confirm → Update UI
```

**Claiming Payout:**

```
User Action → Frontend Validates → Build Transaction →
→ Wallet Signs → Send to Solana → Program Validates →
→ Check Winner Status → Transfer SOL from Vault →
→ Mark Bet as Claimed → Confirm → Update UI
```

## Security Model

### Authentication & Authorization

1. **Wallet Signature** - All transactions require wallet signature
2. **Authority Checks** - Admin functions verify authority pubkey
3. **PDA Validation** - Accounts must match expected PDA derivation
4. **Signer Requirements** - Enforced at program level

### Fund Security

- Event funds held in PDA vaults (no private keys)
- No arbitrary withdrawal functions
- Payouts only to verified bet winners
- Automatic vault management

### Input Validation

- Amount must be > 0
- Outcome index must be valid
- Event must be in correct status
- Time windows enforced
- String length limits

## Deployment Architecture

### Devnet Deployment

```
1. Deploy Solana Program
   anchor deploy --provider.cluster devnet

2. Initialize Platform
   Call initialize_platform instruction

3. Configure Frontend
   Set NEXT_PUBLIC_PROGRAM_ID in .env.local

4. Create Demo Events
   Use admin panel or script

5. Start Frontend
   npm run dev
```

### Environment Configuration

**Program:**
- Deployed to Solana Devnet
- Program ID configured at build time

**Frontend:**
- RPC endpoint: https://api.devnet.solana.com
- Network: Devnet
- Program ID from environment variable

## Scalability Considerations

### Current MVP Limitations

1. **No Database** - All state on-chain (slower queries)
2. **Linear Event Lookup** - No indexing mechanism
3. **Simple Payouts** - Fixed multiplier, not pool-based odds
4. **No Event Oracle** - Manual resolution required
5. **No Real-Time Updates** - Polling-based UI updates

### Production Enhancements

1. **Off-Chain Indexer**
   - PostgreSQL database for fast queries
   - Background service to index blockchain events
   - GraphQL API for frontend

2. **Dynamic Odds**
   - Calculate odds based on pool ratios
   - Implement parimutuel betting model

3. **Oracle Integration**
   - Chainlink or Pyth for event data
   - Automated event resolution

4. **Real-Time Updates**
   - WebSocket subscriptions to account changes
   - Live pool updates

5. **Advanced Features**
   - Multi-outcome events (>2 options)
   - Parlay bets (multiple events)
   - Cashout before resolution
   - Liquidity pools for instant settlement

## Testing Strategy

### Unit Tests (Anchor)
- Test each instruction independently
- Verify error conditions
- Check state transitions
- Validate authorization

### Integration Tests
- End-to-end bet lifecycle
- Multi-user scenarios
- Edge cases (insufficient funds, etc.)

### Frontend Testing
- Component unit tests
- Wallet connection flows
- Transaction error handling

## Known Limitations

1. **Bet Account Indexing** - Current PDA structure requires knowing bet index
2. **No Bet History Query** - Must fetch all event bets (gas expensive)
3. **Fixed Multiplier** - 1.8x payout regardless of odds
4. **Manual Resolution** - Requires admin intervention
5. **No Refund Mechanism** - If event cancelled
6. **Single Authority** - No multi-sig for admin

## Future Architecture

For production mainnet deployment, consider:

1. **Multi-tier architecture**
   - On-chain: Core betting logic only
   - Off-chain indexer: Event discovery and history
   - API layer: GraphQL for efficient queries
   - Cache layer: Redis for real-time data

2. **Decentralized governance**
   - DAO for platform decisions
   - Multi-sig for admin functions
   - Community event creation

3. **Advanced security**
   - Formal verification of program
   - Third-party security audit
   - Bug bounty program
   - Insurance fund for edge cases

---

This architecture provides a solid foundation for an MVP while remaining extensible for future enhancements.
