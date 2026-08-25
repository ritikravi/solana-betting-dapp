const { Connection, PublicKey, Keypair, Transaction, SystemProgram, TransactionInstruction } = require("@solana/web3.js");
const fs = require("fs");

async function initialize() {
  // Setup connection
  const connection = new Connection("https://api.devnet.solana.com", "confirmed");
  
  // Load wallet
  const walletPath = process.env.HOME + "/.config/solana/id.json";
  const walletKeypair = Keypair.fromSecretKey(
    new Uint8Array(JSON.parse(fs.readFileSync(walletPath, "utf8")))
  );
  
  console.log("Wallet:", walletKeypair.publicKey.toString());
  
  const programId = new PublicKey("G8NhvwpScAqrX3wtc5jhGbPJYxGJh9eoeDBtLtxAxAqD");
  
  // Derive platform PDA
  const [platformPda, bump] = PublicKey.findProgramAddressSync(
    [Buffer.from("platform")],
    programId
  );
  
  console.log("Platform PDA:", platformPda.toString());
  console.log("Bump:", bump);
  
  // Build instruction data (8 bytes for Anchor discriminator)
  // initializePlatform discriminator is first 8 bytes of sha256("global:initialize_platform")
  const discriminator = Buffer.from([0xaf, 0xaf, 0x6d, 0x1f, 0x0d, 0x98, 0x9b, 0xed]);
  
  // Build instruction
  const instruction = new TransactionInstruction({
    keys: [
      { pubkey: platformPda, isSigner: false, isWritable: true },
      { pubkey: walletKeypair.publicKey, isSigner: true, isWritable: true },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    ],
    programId: programId,
    data: discriminator,
  });
  
  // Send transaction
  const transaction = new Transaction().add(instruction);
  
  console.log("Sending transaction...");
  
  try {
    const signature = await connection.sendTransaction(transaction, [walletKeypair]);
    console.log("Transaction sent:", signature);
    
    await connection.confirmTransaction(signature);
    console.log("✅ Platform initialized successfully!");
    console.log("View on explorer: https://explorer.solana.com/tx/" + signature + "?cluster=devnet");
  } catch (err) {
    console.error("❌ Error:", err.message);
    if (err.logs) {
      console.log("Logs:", err.logs);
    }
  }
}

initialize().catch(console.error);
