const anchor = require("@coral-xyz/anchor");
const { PublicKey, Keypair } = require("@solana/web3.js");
const fs = require("fs");

async function initialize() {
  // Setup
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  
  const programId = new PublicKey("G8NhvwpScAqrX3wtc5jhGbPJYxGJh9eoeDBtLtxAxAqD");
  
  // Load IDL
  const idl = JSON.parse(fs.readFileSync("./target/idl/betting.json", "utf8"));
  const program = new anchor.Program(idl, programId, provider);
  
  // Derive platform PDA
  const [platformPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("platform")],
    programId
  );
  
  console.log("Initializing platform...");
  console.log("Platform PDA:", platformPda.toString());
  console.log("Authority:", provider.wallet.publicKey.toString());
  
  try {
    const tx = await program.methods
      .initializePlatform()
      .accounts({
        platform: platformPda,
        authority: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();
    
    console.log("✅ Platform initialized!");
    console.log("Transaction:", tx);
  } catch (err) {
    console.error("Error:", err.message);
  }
}

initialize().catch(console.error);
