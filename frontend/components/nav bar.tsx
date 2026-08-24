'use client';

import Link from 'next/link';
import { WalletButton } from './wallet/wallet-button';
import { TrendingUp } from 'lucide-react';

export function Navbar() {
  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                SolBet
              </span>
            </Link>
            
            <div className="hidden md:flex items-center gap-6">
              <Link href="/events" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Events
              </Link>
              <Link href="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Dashboard
              </Link>
              <Link href="/admin" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Admin
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20">
              <span className="text-xs font-medium text-orange-500">Devnet</span>
            </div>
            <WalletButton />
          </div>
        </div>
      </div>
    </nav>
  );
}
