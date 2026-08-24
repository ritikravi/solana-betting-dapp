'use client';

import { useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { PublicKey, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Program, AnchorProvider, BN, web3 } from '@coral-xyz/anchor';
import { Navbar } from '@/components/nav bar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, TrendingUp, ExternalLink, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { PROGRAM_ID } from '@/lib/solana/config';
import { IDL } from '@/lib/solana/idl';
import { formatSOL, formatDate, getExplorerUrl } from '@/lib/utils';

export default function EventDetailsPage({ params }: { params: { id: string } }) {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [selectedOutcome, setSelectedOutcome] = useState<number>(0);
  const [betAmount, setBetAmount] = useState('0.1');
  const [loading, setLoading] = useState(false);
  const [txSignature, setTxSignature] = useState('');
  const [error, setError] = useState('');

  // Mock event data for MVP
  const event = {
    eventId: parseInt(params.id),
    title: params.id === '1' ? 'India vs Australia' : params.id === '2' ? 'Team Alpha vs Team Beta' : 'Bitcoin Price Prediction',
    description: params.id === '1' ? 'Cricket World Cup Final - Who will win the championship?' : params.id === '2' ? 'Esports Championship - Finals match' : 'Will BTC close above $50k this week?',
    category: params.id === '1' ? 'Sports' : params.id === '2' ? 'Esports' : 'Prediction',
    outcomes: params.id === '3' ? ['Above $50k', 'Below $50k'] : params.id === '1' ? ['India', 'Australia'] : ['Team Alpha', 'Team Beta'],
    outcomePools: [1500000000, 2000000000],
    status: { open: {} },
    startTime: Math.floor(Date.now() / 1000),
    closeTime: Math.floor(Date.now() / 1000) + 86400,
    totalPool: 3500000000,
    totalBets: 35,
  };

  async function handlePlaceBet() {
    if (!wallet.publicKey || !wallet.signTransaction) {
      setError('Please connect your wallet');
      return;
    }

    const amount = parseFloat(betAmount);
    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setTxSignature('');

      const provider = new AnchorProvider(connection, wallet as any, {});
      const program = new Program(IDL, new PublicKey(PROGRAM_ID), provider);

      const eventId = new BN(event.eventId);
      const lamports = new BN(amount * LAMPORTS_PER_SOL);

      const [platformPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('platform')],
        program.programId
      );

      const [eventPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('event'), eventId.toArrayLike(Buffer, 'le', 8)],
        program.programId
      );

      const [vaultPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('vault'), eventId.toArrayLike(Buffer, 'le', 8)],
        program.programId
      );

      // Fetch platform account to get total bets for bet PDA
      const platformAccount = await program.account.Platform.fetch(platformPda);
      const totalBets = platformAccount.totalBets as BN;

      const [betPda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from('bet'),
          eventId.toArrayLike(Buffer, 'le', 8),
          wallet.publicKey.toBuffer(),
          totalBets.toArrayLike(Buffer, 'le', 8),
        ],
        program.programId
      );

      const tx = await program.methods
        .placeBet(eventId, selectedOutcome, lamports)
        .accounts({
          platform: platformPda,
          event: eventPda,
          bet: betPda,
          bettor: wallet.publicKey,
          vault: vaultPda,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      setTxSignature(tx);
      setBetAmount('0.1');
      
    } catch (err: any) {
      console.error('Error placing bet:', err);
      setError(err.message || 'Failed to place bet. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const potentialPayout = (parseFloat(betAmount) * 1.8).toFixed(4);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <Link href="/events" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Events
        </Link>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Event Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 rounded-full bg-blue-500/10 text-blue-500 text-xs font-medium">
                    {event.category}
                  </span>
                  <span className="px-2 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-medium">
                    Open
                  </span>
                </div>
                <CardTitle className="text-3xl">{event.title}</CardTitle>
                <CardDescription className="text-base">{event.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Total Pool</div>
                    <div className="text-2xl font-bold text-primary">{formatSOL(event.totalPool)} SOL</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Total Bets</div>
                    <div className="text-2xl font-bold">{event.totalBets}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Closes In</div>
                    <div className="text-2xl font-bold">24h</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                  <Clock className="h-4 w-4" />
                  <span>Betting closes: {formatDate(event.closeTime)}</span>
                </div>

                <div className="border-t border-border pt-6">
                  <h3 className="font-semibold mb-4">Outcomes & Pools</h3>
                  <div className="space-y-3">
                    {event.outcomes.map((outcome, i) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                        <span className="font-medium">{outcome}</span>
                        <div className="text-right">
                          <div className="font-mono text-primary">{formatSOL(event.outcomePools[i])} SOL</div>
                          <div className="text-xs text-muted-foreground">
                            {((event.outcomePools[i] / event.totalPool) * 100).toFixed(1)}% of pool
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Betting Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Place Your Bet</CardTitle>
                <CardDescription>Select an outcome and enter your wager</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!wallet.connected ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">Connect your wallet to place a bet</p>
                  </div>
                ) : txSignature ? (
                  <div className="text-center py-8">
                    <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Bet Placed Successfully!</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Your bet has been recorded on-chain
                    </p>
                    <a
                      href={getExplorerUrl(txSignature)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                    >
                      View on Explorer <ExternalLink className="h-4 w-4" />
                    </a>
                    <Button
                      className="w-full mt-4"
                      onClick={() => setTxSignature('')}
                    >
                      Place Another Bet
                    </Button>
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Select Outcome</label>
                      <div className="space-y-2">
                        {event.outcomes.map((outcome, i) => (
                          <button
                            key={i}
                            onClick={() => setSelectedOutcome(i)}
                            className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                              selectedOutcome === i
                                ? 'border-primary bg-primary/10'
                                : 'border-border hover:border-primary/50'
                            }`}
                          >
                            <div className="font-medium">{outcome}</div>
                            <div className="text-sm text-muted-foreground mt-1">
                              Multiplier: 1.80x
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Bet Amount (SOL)</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        value={betAmount}
                        onChange={(e) => setBetAmount(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        placeholder="0.1"
                      />
                    </div>

                    <div className="p-4 rounded-lg bg-muted/50">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Bet Amount</span>
                        <span className="font-mono">{betAmount} SOL</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Potential Payout</span>
                        <span className="font-mono text-primary font-semibold">{potentialPayout} SOL</span>
                      </div>
                    </div>

                    {error && (
                      <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                        <p className="text-sm text-destructive">{error}</p>
                      </div>
                    )}

                    <Button
                      className="w-full"
                      onClick={handlePlaceBet}
                      disabled={loading}
                    >
                      {loading ? 'Processing...' : 'Place Bet'}
                    </Button>

                    <p className="text-xs text-muted-foreground text-center">
                      By placing a bet, you agree to the terms and conditions
                    </p>
                  </>
                )}
              </CardContent>
            </Card>

            <Card className="bg-orange-500/5 border-orange-500/20">
              <CardContent className="pt-6">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-orange-500" />
                  <span>Betting Info</span>
                </h4>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Minimum bet: 0.01 SOL</li>
                  <li>• Fixed multiplier: 1.80x</li>
                  <li>• Winners claim after resolution</li>
                  <li>• All transactions on-chain</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
