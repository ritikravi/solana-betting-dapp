'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { Navbar } from '@/components/nav bar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wallet, TrendingUp, Clock, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { formatSOL, formatDate, getExplorerUrl, shortenAddress } from '@/lib/utils';

export default function DashboardPage() {
  const { publicKey, connected } = useWallet();

  // Mock user data for MVP
  const userStats = {
    totalBets: 12,
    activeBets: 8,
    wonBets: 3,
    lostBets: 1,
    totalWagered: 1200000000, // 1.2 SOL
    totalWinnings: 450000000, // 0.45 SOL
  };

  const userBets = [
    {
      eventId: 1,
      eventTitle: 'India vs Australia',
      outcome: 'India',
      amount: 100000000,
      potentialPayout: 180000000,
      status: 'active',
      timestamp: Math.floor(Date.now() / 1000) - 3600,
      txSignature: '5Gx...abc',
    },
    {
      eventId: 2,
      eventTitle: 'Team Alpha vs Team Beta',
      outcome: 'Team Alpha',
      amount: 200000000,
      potentialPayout: 360000000,
      status: 'active',
      timestamp: Math.floor(Date.now() / 1000) - 7200,
      txSignature: '7Kp...def',
    },
    {
      eventId: 3,
      eventTitle: 'Bitcoin Price Prediction',
      outcome: 'Above $50k',
      amount: 150000000,
      potentialPayout: 270000000,
      status: 'won',
      timestamp: Math.floor(Date.now() / 1000) - 86400,
      txSignature: '9Mp...ghi',
    },
  ];

  if (!connected || !publicKey) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-16">
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-12 pb-12 text-center">
              <Wallet className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-2xl font-bold mb-2">Connect Your Wallet</h2>
              <p className="text-muted-foreground mb-6">
                Connect your Solana wallet to view your betting dashboard
              </p>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">My Dashboard</h1>
          <p className="text-muted-foreground">Track your bets and manage your winnings</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Bets</CardDescription>
              <CardTitle className="text-3xl">{userStats.totalBets}</CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Active Bets</CardDescription>
              <CardTitle className="text-3xl text-primary">{userStats.activeBets}</CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Wagered</CardDescription>
              <CardTitle className="text-3xl">{formatSOL(userStats.totalWagered)} SOL</CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Winnings</CardDescription>
              <CardTitle className="text-3xl text-green-500">{formatSOL(userStats.totalWinnings)} SOL</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Win/Loss Summary */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Won</p>
                  <p className="text-2xl font-bold text-green-500">{userStats.wonBets}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Lost</p>
                  <p className="text-2xl font-bold text-red-500">{userStats.lostBets}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-red-500 rotate-180" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Win Rate</p>
                  <p className="text-2xl font-bold">
                    {((userStats.wonBets / (userStats.wonBets + userStats.lostBets)) * 100).toFixed(0)}%
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bet History */}
        <Card>
          <CardHeader>
            <CardTitle>Bet History</CardTitle>
            <CardDescription>Your recent betting activity</CardDescription>
          </CardHeader>
          <CardContent>
            {userBets.length === 0 ? (
              <div className="text-center py-12">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No Bets Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start betting on events to see your history here
                </p>
                <Link href="/events">
                  <Button>Browse Events</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {userBets.map((bet, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold">{bet.eventTitle}</h4>
                        {bet.status === 'active' && (
                          <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 text-xs font-medium">
                            Active
                          </span>
                        )}
                        {bet.status === 'won' && (
                          <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 text-xs font-medium">
                            Won
                          </span>
                        )}
                        {bet.status === 'lost' && (
                          <span className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-500 text-xs font-medium">
                            Lost
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Outcome: <span className="text-foreground font-medium">{bet.outcome}</span></span>
                        <span>•</span>
                        <span>Bet: <span className="text-foreground font-medium font-mono">{formatSOL(bet.amount)} SOL</span></span>
                        <span>•</span>
                        <span>Potential: <span className="text-primary font-medium font-mono">{formatSOL(bet.potentialPayout)} SOL</span></span>
                      </div>
                      <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{formatDate(bet.timestamp)}</span>
                        <span>•</span>
                        <a
                          href={getExplorerUrl(bet.txSignature)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 hover:text-primary transition-colors"
                        >
                          <span className="font-mono">{shortenAddress(bet.txSignature, 3)}</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>

                    <div className="text-right">
                      {bet.status === 'active' && (
                        <Link href={`/events/${bet.eventId}`}>
                          <Button variant="outline" size="sm">
                            View Event
                          </Button>
                        </Link>
                      )}
                      {bet.status === 'won' && (
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          Claim Payout
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
