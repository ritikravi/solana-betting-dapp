import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Betting } from "../target/types/betting";
import { assert } from "chai";

describe("betting", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Betting as Program<Betting>;
  const authority = provider.wallet.publicKey;

  const [platformPda] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("platform")],
    program.programId
  );

  const eventId = new anchor.BN(1);
  const [eventPda] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("event"), eventId.toArrayLike(Buffer, "le", 8)],
    program.programId
  );

  const [vaultPda] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("vault"), eventId.toArrayLike(Buffer, "le", 8)],
    program.programId
  );

  it("Initializes the platform", async () => {
    const tx = await program.methods
      .initializePlatform()
      .accounts({
        platform: platformPda,
        authority: authority,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    console.log("Platform initialized:", tx);

    const platformAccount = await program.account.platform.fetch(platformPda);
    assert.equal(
      platformAccount.authority.toString(),
      authority.toString()
    );
    assert.equal(platformAccount.totalEvents.toNumber(), 0);
    assert.equal(platformAccount.totalBets.toNumber(), 0);
  });

  it("Creates a betting event", async () => {
    const now = Math.floor(Date.now() / 1000);
    const startTime = new anchor.BN(now);
    const closeTime = new anchor.BN(now + 3600); // 1 hour later

    const tx = await program.methods
      .createEvent(
        eventId,
        "Team Alpha vs Team Beta",
        "Exciting match between two top teams",
        "Sports",
        ["Team Alpha", "Team Beta"],
        startTime,
        closeTime
      )
      .accounts({
        platform: platformPda,
        event: eventPda,
        authority: authority,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    console.log("Event created:", tx);

    const eventAccount = await program.account.bettingEvent.fetch(eventPda);
    assert.equal(eventAccount.eventId.toNumber(), eventId.toNumber());
    assert.equal(eventAccount.title, "Team Alpha vs Team Beta");
    assert.equal(eventAccount.outcomes.length, 2);
    assert.equal(eventAccount.totalPool.toNumber(), 0);
  });

  it("Places a bet on an event", async () => {
    const bettor = anchor.web3.Keypair.generate();
    
    // Airdrop SOL to bettor
    const signature = await provider.connection.requestAirdrop(
      bettor.publicKey,
      2 * anchor.web3.LAMPORTS_PER_SOL
    );
    await provider.connection.confirmTransaction(signature);

    const platformAccount = await program.account.platform.fetch(platformPda);
    const totalBets = platformAccount.totalBets;

    const [betPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("bet"),
        eventId.toArrayLike(Buffer, "le", 8),
        bettor.publicKey.toBuffer(),
        totalBets.toArrayLike(Buffer, "le", 8),
      ],
      program.programId
    );

    const betAmount = new anchor.BN(0.1 * anchor.web3.LAMPORTS_PER_SOL);
    const outcomeIndex = 0;

    const tx = await program.methods
      .placeBet(eventId, outcomeIndex, betAmount)
      .accounts({
        platform: platformPda,
        event: eventPda,
        bet: betPda,
        bettor: bettor.publicKey,
        vault: vaultPda,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([bettor])
      .rpc();

    console.log("Bet placed:", tx);

    const betAccount = await program.account.bet.fetch(betPda);
    assert.equal(betAccount.bettor.toString(), bettor.publicKey.toString());
    assert.equal(betAccount.amount.toNumber(), betAmount.toNumber());
    assert.equal(betAccount.outcomeIndex, outcomeIndex);
    assert.equal(betAccount.claimed, false);

    const eventAccount = await program.account.bettingEvent.fetch(eventPda);
    assert.equal(eventAccount.totalBets.toNumber(), 1);
    assert.isTrue(eventAccount.totalPool.toNumber() > 0);
  });

  it("Prevents betting with invalid outcome", async () => {
    const bettor = anchor.web3.Keypair.generate();
    
    const signature = await provider.connection.requestAirdrop(
      bettor.publicKey,
      2 * anchor.web3.LAMPORTS_PER_SOL
    );
    await provider.connection.confirmTransaction(signature);

    const platformAccount = await program.account.platform.fetch(platformPda);
    const totalBets = platformAccount.totalBets;

    const [betPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("bet"),
        eventId.toArrayLike(Buffer, "le", 8),
        bettor.publicKey.toBuffer(),
        totalBets.toArrayLike(Buffer, "le", 8),
      ],
      program.programId
    );

    const betAmount = new anchor.BN(0.1 * anchor.web3.LAMPORTS_PER_SOL);
    const invalidOutcomeIndex = 99;

    try {
      await program.methods
        .placeBet(eventId, invalidOutcomeIndex, betAmount)
        .accounts({
          platform: platformPda,
          event: eventPda,
          bet: betPda,
          bettor: bettor.publicKey,
          vault: vaultPda,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([bettor])
        .rpc();
      
      assert.fail("Should have thrown an error for invalid outcome");
    } catch (error) {
      assert.include(error.toString(), "InvalidOutcome");
    }
  });

  it("Closes an event", async () => {
    const tx = await program.methods
      .closeEvent(eventId)
      .accounts({
        event: eventPda,
        authority: authority,
      })
      .rpc();

    console.log("Event closed:", tx);

    const eventAccount = await program.account.bettingEvent.fetch(eventPda);
    assert.equal(eventAccount.status.closed, {});
  });

  it("Resolves an event", async () => {
    const winningOutcome = 0;

    const tx = await program.methods
      .resolveEvent(eventId, winningOutcome)
      .accounts({
        event: eventPda,
        authority: authority,
      })
      .rpc();

    console.log("Event resolved:", tx);

    const eventAccount = await program.account.bettingEvent.fetch(eventPda);
    assert.equal(eventAccount.status.resolved, {});
    assert.equal(eventAccount.winningOutcome, winningOutcome);
  });
});
