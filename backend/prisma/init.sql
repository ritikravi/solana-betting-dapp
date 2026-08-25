-- Create enum for event status
CREATE TYPE "EventStatus" AS ENUM ('CREATED', 'OPEN', 'CLOSED', 'RESOLVED', 'CANCELLED');

-- Create platforms table
CREATE TABLE IF NOT EXISTS "platforms" (
    "id" TEXT NOT NULL,
    "publicKey" TEXT NOT NULL,
    "authority" TEXT NOT NULL,
    "totalEvents" INTEGER NOT NULL DEFAULT 0,
    "totalBets" INTEGER NOT NULL DEFAULT 0,
    "totalVolume" BIGINT NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "platforms_pkey" PRIMARY KEY ("id")
);

-- Create events table
CREATE TABLE IF NOT EXISTS "events" (
    "id" TEXT NOT NULL,
    "eventId" INTEGER NOT NULL,
    "publicKey" TEXT NOT NULL,
    "authority" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "outcomes" TEXT[],
    "outcomePools" BIGINT[],
    "status" "EventStatus" NOT NULL DEFAULT 'OPEN',
    "startTime" TIMESTAMP(3) NOT NULL,
    "closeTime" TIMESTAMP(3) NOT NULL,
    "winningOutcome" INTEGER,
    "totalPool" BIGINT NOT NULL DEFAULT 0,
    "totalBets" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- Create bets table
CREATE TABLE IF NOT EXISTS "bets" (
    "id" TEXT NOT NULL,
    "publicKey" TEXT NOT NULL,
    "bettor" TEXT NOT NULL,
    "eventId" INTEGER NOT NULL,
    "outcomeIndex" INTEGER NOT NULL,
    "amount" BIGINT NOT NULL,
    "potentialPayout" BIGINT NOT NULL,
    "claimed" BOOLEAN NOT NULL DEFAULT false,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "txSignature" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bets_pkey" PRIMARY KEY ("id")
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS "transactions" (
    "id" TEXT NOT NULL,
    "signature" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "blockTime" TIMESTAMP(3),
    "slot" BIGINT,
    "fee" BIGINT,
    "signer" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- Create unique indexes
CREATE UNIQUE INDEX IF NOT EXISTS "platforms_publicKey_key" ON "platforms"("publicKey");
CREATE UNIQUE INDEX IF NOT EXISTS "events_eventId_key" ON "events"("eventId");
CREATE UNIQUE INDEX IF NOT EXISTS "events_publicKey_key" ON "events"("publicKey");
CREATE UNIQUE INDEX IF NOT EXISTS "bets_publicKey_key" ON "bets"("publicKey");
CREATE UNIQUE INDEX IF NOT EXISTS "bets_txSignature_key" ON "bets"("txSignature");
CREATE UNIQUE INDEX IF NOT EXISTS "transactions_signature_key" ON "transactions"("signature");

-- Create regular indexes
CREATE INDEX IF NOT EXISTS "events_status_idx" ON "events"("status");
CREATE INDEX IF NOT EXISTS "events_category_idx" ON "events"("category");
CREATE INDEX IF NOT EXISTS "events_closeTime_idx" ON "events"("closeTime");
CREATE INDEX IF NOT EXISTS "bets_bettor_idx" ON "bets"("bettor");
CREATE INDEX IF NOT EXISTS "bets_eventId_idx" ON "bets"("eventId");
CREATE INDEX IF NOT EXISTS "bets_claimed_idx" ON "bets"("claimed");
CREATE INDEX IF NOT EXISTS "transactions_signature_idx" ON "transactions"("signature");
CREATE INDEX IF NOT EXISTS "transactions_type_idx" ON "transactions"("type");
CREATE INDEX IF NOT EXISTS "transactions_signer_idx" ON "transactions"("signer");

-- Add foreign key constraint
ALTER TABLE "bets" DROP CONSTRAINT IF EXISTS "bets_eventId_fkey";
ALTER TABLE "bets" ADD CONSTRAINT "bets_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("eventId") ON DELETE RESTRICT ON UPDATE CASCADE;
