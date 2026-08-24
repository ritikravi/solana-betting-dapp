export type BettingIDL = {
  "version": "0.1.0",
  "name": "betting",
  "instructions": [
    {
      "name": "initializePlatform",
      "accounts": [
        { "name": "platform", "isMut": true, "isSigner": false },
        { "name": "authority", "isMut": true, "isSigner": true },
        { "name": "systemProgram", "isMut": false, "isSigner": false }
      ],
      "args": []
    },
    {
      "name": "createEvent",
      "accounts": [
        { "name": "platform", "isMut": true, "isSigner": false },
        { "name": "event", "isMut": true, "isSigner": false },
        { "name": "authority", "isMut": true, "isSigner": true },
        { "name": "systemProgram", "isMut": false, "isSigner": false }
      ],
      "args": [
        { "name": "eventId", "type": "u64" },
        { "name": "title", "type": "string" },
        { "name": "description", "type": "string" },
        { "name": "category", "type": "string" },
        { "name": "outcomes", "type": { "vec": "string" } },
        { "name": "startTime", "type": "i64" },
        { "name": "closeTime", "type": "i64" }
      ]
    },
    {
      "name": "placeBet",
      "accounts": [
        { "name": "platform", "isMut": true, "isSigner": false },
        { "name": "event", "isMut": true, "isSigner": false },
        { "name": "bet", "isMut": true, "isSigner": false },
        { "name": "bettor", "isMut": true, "isSigner": true },
        { "name": "vault", "isMut": true, "isSigner": false },
        { "name": "systemProgram", "isMut": false, "isSigner": false }
      ],
      "args": [
        { "name": "eventId", "type": "u64" },
        { "name": "outcomeIndex", "type": "u8" },
        { "name": "amount", "type": "u64" }
      ]
    },
    {
      "name": "closeEvent",
      "accounts": [
        { "name": "event", "isMut": true, "isSigner": false },
        { "name": "authority", "isMut": false, "isSigner": true }
      ],
      "args": [
        { "name": "eventId", "type": "u64" }
      ]
    },
    {
      "name": "resolveEvent",
      "accounts": [
        { "name": "event", "isMut": true, "isSigner": false },
        { "name": "authority", "isMut": false, "isSigner": true }
      ],
      "args": [
        { "name": "eventId", "type": "u64" },
        { "name": "winningOutcomeIndex", "type": "u8" }
      ]
    },
    {
      "name": "claimPayout",
      "accounts": [
        { "name": "event", "isMut": false, "isSigner": false },
        { "name": "bet", "isMut": true, "isSigner": false },
        { "name": "bettor", "isMut": true, "isSigner": true },
        { "name": "vault", "isMut": true, "isSigner": false },
        { "name": "systemProgram", "isMut": false, "isSigner": false }
      ],
      "args": [
        { "name": "eventId", "type": "u64" }
      ]
    }
  ],
  "accounts": [
    {
      "name": "Platform",
      "type": {
        "kind": "struct",
        "fields": [
          { "name": "authority", "type": "publicKey" },
          { "name": "totalEvents", "type": "u64" },
          { "name": "totalBets", "type": "u64" },
          { "name": "totalVolume", "type": "u64" },
          { "name": "bump", "type": "u8" }
        ]
      }
    },
    {
      "name": "BettingEvent",
      "type": {
        "kind": "struct",
        "fields": [
          { "name": "eventId", "type": "u64" },
          { "name": "authority", "type": "publicKey" },
          { "name": "title", "type": "string" },
          { "name": "description", "type": "string" },
          { "name": "category", "type": "string" },
          { "name": "outcomes", "type": { "vec": "string" } },
          { "name": "outcomePools", "type": { "vec": "u64" } },
          { "name": "status", "type": { "defined": "EventStatus" } },
          { "name": "startTime", "type": "i64" },
          { "name": "closeTime", "type": "i64" },
          { "name": "winningOutcome", "type": { "option": "u8" } },
          { "name": "totalPool", "type": "u64" },
          { "name": "totalBets", "type": "u64" },
          { "name": "bump", "type": "u8" }
        ]
      }
    },
    {
      "name": "Bet",
      "type": {
        "kind": "struct",
        "fields": [
          { "name": "bettor", "type": "publicKey" },
          { "name": "eventId", "type": "u64" },
          { "name": "outcomeIndex", "type": "u8" },
          { "name": "amount", "type": "u64" },
          { "name": "potentialPayout", "type": "u64" },
          { "name": "claimed", "type": "bool" },
          { "name": "timestamp", "type": "i64" },
          { "name": "bump", "type": "u8" }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "EventStatus",
      "type": {
        "kind": "enum",
        "variants": [
          { "name": "Created" },
          { "name": "Open" },
          { "name": "Closed" },
          { "name": "Resolved" },
          { "name": "Cancelled" }
        ]
      }
    }
  ],
  "errors": [
    { "code": 6000, "name": "Unauthorized", "msg": "Unauthorized action" },
    { "code": 6001, "name": "EventNotOpen", "msg": "Event is not open for betting" },
    { "code": 6002, "name": "EventClosed", "msg": "Event has already closed" },
    { "code": 6003, "name": "InvalidOutcome", "msg": "Invalid outcome index" },
    { "code": 6004, "name": "InvalidBetAmount", "msg": "Bet amount must be greater than zero" },
    { "code": 6005, "name": "EventNotResolved", "msg": "Event has not been resolved yet" },
    { "code": 6006, "name": "BetNotWinner", "msg": "Bet is not a winner" },
    { "code": 6007, "name": "PayoutAlreadyClaimed", "msg": "Payout already claimed" },
    { "code": 6008, "name": "EventAlreadyResolved", "msg": "Event is already resolved" }
  ]
};

export const IDL: BettingIDL = {
  "version": "0.1.0",
  "name": "betting",
  "instructions": [
    {
      "name": "initializePlatform",
      "accounts": [
        { "name": "platform", "isMut": true, "isSigner": false },
        { "name": "authority", "isMut": true, "isSigner": true },
        { "name": "systemProgram", "isMut": false, "isSigner": false }
      ],
      "args": []
    },
    {
      "name": "createEvent",
      "accounts": [
        { "name": "platform", "isMut": true, "isSigner": false },
        { "name": "event", "isMut": true, "isSigner": false },
        { "name": "authority", "isMut": true, "isSigner": true },
        { "name": "systemProgram", "isMut": false, "isSigner": false }
      ],
      "args": [
        { "name": "eventId", "type": "u64" },
        { "name": "title", "type": "string" },
        { "name": "description", "type": "string" },
        { "name": "category", "type": "string" },
        { "name": "outcomes", "type": { "vec": "string" } },
        { "name": "startTime", "type": "i64" },
        { "name": "closeTime", "type": "i64" }
      ]
    },
    {
      "name": "placeBet",
      "accounts": [
        { "name": "platform", "isMut": true, "isSigner": false },
        { "name": "event", "isMut": true, "isSigner": false },
        { "name": "bet", "isMut": true, "isSigner": false },
        { "name": "bettor", "isMut": true, "isSigner": true },
        { "name": "vault", "isMut": true, "isSigner": false },
        { "name": "systemProgram", "isMut": false, "isSigner": false }
      ],
      "args": [
        { "name": "eventId", "type": "u64" },
        { "name": "outcomeIndex", "type": "u8" },
        { "name": "amount", "type": "u64" }
      ]
    },
    {
      "name": "closeEvent",
      "accounts": [
        { "name": "event", "isMut": true, "isSigner": false },
        { "name": "authority", "isMut": false, "isSigner": true }
      ],
      "args": [
        { "name": "eventId", "type": "u64" }
      ]
    },
    {
      "name": "resolveEvent",
      "accounts": [
        { "name": "event", "isMut": true, "isSigner": false },
        { "name": "authority", "isMut": false, "isSigner": true }
      ],
      "args": [
        { "name": "eventId", "type": "u64" },
        { "name": "winningOutcomeIndex", "type": "u8" }
      ]
    },
    {
      "name": "claimPayout",
      "accounts": [
        { "name": "event", "isMut": false, "isSigner": false },
        { "name": "bet", "isMut": true, "isSigner": false },
        { "name": "bettor", "isMut": true, "isSigner": true },
        { "name": "vault", "isMut": true, "isSigner": false },
        { "name": "systemProgram", "isMut": false, "isSigner": false }
      ],
      "args": [
        { "name": "eventId", "type": "u64" }
      ]
    }
  ],
  "accounts": [
    {
      "name": "Platform",
      "type": {
        "kind": "struct",
        "fields": [
          { "name": "authority", "type": "publicKey" },
          { "name": "totalEvents", "type": "u64" },
          { "name": "totalBets", "type": "u64" },
          { "name": "totalVolume", "type": "u64" },
          { "name": "bump", "type": "u8" }
        ]
      }
    },
    {
      "name": "BettingEvent",
      "type": {
        "kind": "struct",
        "fields": [
          { "name": "eventId", "type": "u64" },
          { "name": "authority", "type": "publicKey" },
          { "name": "title", "type": "string" },
          { "name": "description", "type": "string" },
          { "name": "category", "type": "string" },
          { "name": "outcomes", "type": { "vec": "string" } },
          { "name": "outcomePools", "type": { "vec": "u64" } },
          { "name": "status", "type": { "defined": "EventStatus" } },
          { "name": "startTime", "type": "i64" },
          { "name": "closeTime", "type": "i64" },
          { "name": "winningOutcome", "type": { "option": "u8" } },
          { "name": "totalPool", "type": "u64" },
          { "name": "totalBets", "type": "u64" },
          { "name": "bump", "type": "u8" }
        ]
      }
    },
    {
      "name": "Bet",
      "type": {
        "kind": "struct",
        "fields": [
          { "name": "bettor", "type": "publicKey" },
          { "name": "eventId", "type": "u64" },
          { "name": "outcomeIndex", "type": "u8" },
          { "name": "amount", "type": "u64" },
          { "name": "potentialPayout", "type": "u64" },
          { "name": "claimed", "type": "bool" },
          { "name": "timestamp", "type": "i64" },
          { "name": "bump", "type": "u8" }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "EventStatus",
      "type": {
        "kind": "enum",
        "variants": [
          { "name": "Created" },
          { "name": "Open" },
          { "name": "Closed" },
          { "name": "Resolved" },
          { "name": "Cancelled" }
        ]
      }
    }
  ],
  "errors": [
    { "code": 6000, "name": "Unauthorized", "msg": "Unauthorized action" },
    { "code": 6001, "name": "EventNotOpen", "msg": "Event is not open for betting" },
    { "code": 6002, "name": "EventClosed", "msg": "Event has already closed" },
    { "code": 6003, "name": "InvalidOutcome", "msg": "Invalid outcome index" },
    { "code": 6004, "name": "InvalidBetAmount", "msg": "Bet amount must be greater than zero" },
    { "code": 6005, "name": "EventNotResolved", "msg": "Event has not been resolved yet" },
    { "code": 6006, "name": "BetNotWinner", "msg": "Bet is not a winner" },
    { "code": 6007, "name": "PayoutAlreadyClaimed", "msg": "Payout already claimed" },
    { "code": 6008, "name": "EventAlreadyResolved", "msg": "Event is already resolved" }
  ]
};
