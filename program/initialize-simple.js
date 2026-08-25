const { Connection, Keypair, SystemProgram, Transaction, TransactionInstruction, PublicKey } = require('@solana/web3.js');
const fs = require('fs');
const path = require('path');

const PROGRAM_ID = new PublicKey('G8NhvwpScAqrX3wtc5jhGbPJYxGJh9eoeDBtLtxAxAqD');
const RPC_URL = 'https://api.devnet.solana.com';

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  const keypairPath = path.join(process.env.HOME, '.config/solana/id.json');
  const keypairData = JSON.parse(fs.readFileSync(keypairPath, 'utf8'));
  const wallet = Keypair.fromSecretKey(new Uint8Array(keypairData));
  
  console.log('Wallet:', wallet.publicKey.toString());
  
  const connection = new Connection(RPC_URL, { commitment: 'confirmed', confirmTransactionInitialTimeout: 60000 });
  
  try {
    const version = await connection.getVersion();
    console.log('Connected to Solana Devnet');
  } catch (err) {
    console.error('Cannot connect:', err.message);
    return;
  }
  
  const balance = await connection.getBalance(wallet.publicKey);
  console.log('Balance:', balance / 1e9, 'SOL');
  
  const [platformPda, bump] = PublicKey.findProgramAddressSync([Buffer.from('platform')], PROGRAM_ID);
  console.log('Platform PDA:', platformPda.toString());
  
  const accountInfo = await connection.getAccountInfo(platformPda);
  if (accountInfo) {
    console.log('✅ Platform already initialized!');
    return;
  }
  
  const discriminator = Buffer.from([0x9b, 0x01, 0xef, 0x6b, 0x2e, 0x8c, 0x3e, 0x4d]);
  const instruction = new TransactionInstruction({
    keys: [
      { pubkey: platformPda, isSigner: false, isWritable: true },
      { pubkey: wallet.publicKey, isSigner: true, isWritable: true },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    ],
    programId: PROGRAM_ID,
    data: discriminator,
  });
  
  for (let i = 0; i < 3; i++) {
    try {
      console.log('Attempt', i+1, '/3...');
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('finalized');
      const transaction = new Transaction({ feePayer: wallet.publicKey, blockhash, lastValidBlockHeight }).add(instruction);
      transaction.sign(wallet);
      
      const signature = await connection.sendRawTransaction(transaction.serialize(), { skipPreflight: false, maxRetries: 3 });
      console.log('Transaction sent:', signature);
      
      const confirmation = await connection.confirmTransaction({ signature, blockhash, lastValidBlockHeight }, 'confirmed');
      
      if (!confirmation.value.err) {
        console.log('🎉 Platform initialized!');
        console.log('Explorer: https://explorer.solana.com/tx/' + signature + '?cluster=devnet');
        return;
      }
    } catch (error) {
      console.log('Error:', error.message);
      if (i < 2) await sleep(3000);
    }
  }
}

main().catch(console.error);
