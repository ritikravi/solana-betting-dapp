import { Connection, PublicKey } from '@solana/web3.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const connection = new Connection(
  process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com',
  'confirmed'
);

const PROGRAM_ID = new PublicKey(
  process.env.PROGRAM_ID || 'BET1111111111111111111111111111111111111111'
);

export async function indexTransaction(signature: string) {
  try {
    // Fetch transaction from Solana
    const tx = await connection.getTransaction(signature, {
      maxSupportedTransactionVersion: 0,
    });

    if (!tx) {
      throw new Error('Transaction not found');
    }

    // Parse transaction and determine type
    const accountKeys = tx.transaction.message.staticAccountKeys || [];
    const programIndex = accountKeys.findIndex(key => key.equals(PROGRAM_ID));

    if (programIndex === -1) {
      throw new Error('Not a betting program transaction');
    }

    // Store transaction record
    await prisma.transaction.upsert({
      where: { signature },
      create: {
        signature,
        type: 'unknown', // Would parse instruction data to determine
        status: 'confirmed',
        blockTime: tx.blockTime ? new Date(tx.blockTime * 1000) : null,
        slot: BigInt(tx.slot),
        fee: BigInt(tx.meta?.fee || 0),
        signer: accountKeys[0].toString(),
        metadata: tx as any,
      },
      update: {
        status: 'confirmed',
        blockTime: tx.blockTime ? new Date(tx.blockTime * 1000) : null,
      },
    });

    return {
      signature,
      indexed: true,
      blockTime: tx.blockTime,
    };
  } catch (error) {
    console.error('Error indexing transaction:', error);
    throw error;
  }
}

// Function to continuously monitor and index new transactions
export async function startIndexer() {
  console.log('🔍 Starting transaction indexer...');
  
  // This would implement WebSocket subscription to program account changes
  // For MVP, transactions are indexed on-demand via API
  
  console.log('✅ Indexer ready (on-demand mode)');
}
