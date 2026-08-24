'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Navbar } from '@/components/nav bar';
import { Shield, Zap, TrendingUp, Wallet, CheckCircle2, Activity } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-background/80">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-20 mt-8">
          <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20">
            <span className="text-sm font-medium text-primary">Powered by Solana</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-primary bg-clip-text text-transparent">
            Decentralized Betting
            <br />
            On Solana
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Place bets on events with complete transparency. All transactions secured by Solana blockchain.
            Connect your wallet and start betting in seconds.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/events">
              <Button size="lg" className="text-base px-8">
                Explore Events
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline" className="text-base px-8">
                View Dashboard
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardHeader>
              <Shield className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Secure & Trustless</CardTitle>
              <CardDescription>
                All bets recorded on Solana blockchain. No intermediaries, complete transparency.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardHeader>
              <Zap className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Lightning Fast</CardTitle>
              <CardDescription>
                Powered by Solana's high-speed network. Place bets and claim payouts instantly.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardHeader>
              <TrendingUp className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Real-Time Odds</CardTitle>
              <CardDescription>
                Live pool tracking and transparent payout calculations. Know your potential winnings.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* How It Works */}
        <div className="max-w-4xl mx-auto mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Wallet className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">1. Connect Wallet</h3>
              <p className="text-sm text-muted-foreground">
                Connect your Solana wallet (Phantom, Solflare, or Backpack)
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Activity className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">2. Choose Event</h3>
              <p className="text-sm text-muted-foreground">
                Browse active events and select your preferred outcome
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">3. Place Bet</h3>
              <p className="text-sm text-muted-foreground">
                Enter amount and confirm transaction through your wallet
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">4. Claim Winnings</h3>
              <p className="text-sm text-muted-foreground">
                When event resolves, winners can claim their payouts
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <Card className="bg-gradient-to-br from-primary/10 via-purple-500/5 to-background border-primary/20">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-primary mb-2">100%</div>
                <div className="text-sm text-muted-foreground">Transparent</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">&lt;1s</div>
                <div className="text-sm text-muted-foreground">Transaction Time</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">Devnet</div>
                <div className="text-sm text-muted-foreground">Test Network</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">SOL</div>
                <div className="text-sm text-muted-foreground">Native Token</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <footer className="mt-20 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>Built on Solana Devnet • This is a demo application for testing purposes only</p>
          <p className="mt-2">No real money involved • Always bet responsibly</p>
        </footer>
      </main>
    </div>
  );
}
