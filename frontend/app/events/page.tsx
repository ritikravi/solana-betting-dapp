'use client';

import { useState, useEffect } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { Program, AnchorProvider } from '@coral-xyz/anchor';
import { Navbar } from '@/components/nav bar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, TrendingUp, Users } from 'lucide-react';
import Link from 'next/link';
import { PROGRAM_ID, SOLANA_NETWORK } from '@/lib/solana/config';
import { IDL } from '@/lib/solana/idl';
import { formatSOL, formatDate } from '@/lib/utils';

interface EventData {
  eventId: number;
  title: string;
  description: string;
  category: string;
  outcomes: string[];
  outcomePools: number[];
  status: any;
  startTime: number;
  closeTime: number;
  totalPool: number;
  totalBets: number;
  publicKey: string;
}

export default function EventsPage() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, [connection, wallet]);

  async function loadEvents() {
    try {
      setLoading(true);
      
      if (!wallet.publicKey) {
        // If wallet not connected, try to fetch without wallet
        try {
          const provider = new AnchorProvider(
            connection,
            {} as any,
            { commitment: 'confirmed' }
          );
          const program = new Program(IDL, new PublicKey(PROGRAM_ID), provider);
          
          // Fetch all event accounts
          const eventAccounts = await program.account.Event.all();
          
          const loadedEvents: EventData[] = eventAccounts.map((account: any) => ({
            eventId: account.account.eventId.toNumber(),
            title: account.account.title,
            description: account.account.description,
            category: account.account.category,
            outcomes: account.account.outcomes,
            outcomePools: account.account.outcomePools.map((p: any) => p.toNumber()),
            status: account.account.status,
            startTime: account.account.startTime.toNumber(),
            closeTime: account.account.closeTime.toNumber(),
            totalPool: account.account.outcomePools.reduce((sum: any, p: any) => sum + p.toNumber(), 0),
            totalBets: account.account.totalBets,
            publicKey: account.publicKey.toString(),
          }));
          
          setEvents(loadedEvents);
        } catch (err) {
          console.error('Error loading events without wallet:', err);
          setEvents([]);
        }
      } else {
        // Load with wallet
        const provider = new AnchorProvider(connection, wallet as any, { commitment: 'confirmed' });
        const program = new Program(IDL, new PublicKey(PROGRAM_ID), provider);
        
        // Fetch all event accounts
        const eventAccounts = await program.account.Event.all();
        
        const loadedEvents: EventData[] = eventAccounts.map((account: any) => ({
          eventId: account.account.eventId.toNumber(),
          title: account.account.title,
          description: account.account.description,
          category: account.account.category,
          outcomes: account.account.outcomes,
          outcomePools: account.account.outcomePools.map((p: any) => p.toNumber()),
          status: account.account.status,
          startTime: account.account.startTime.toNumber(),
          closeTime: account.account.closeTime.toNumber(),
          totalPool: account.account.outcomePools.reduce((sum: any, p: any) => sum + p.toNumber(), 0),
          totalBets: account.account.totalBets,
          publicKey: account.publicKey.toString(),
        }));
        
        setEvents(loadedEvents);
      }
    } catch (error) {
      console.error('Error loading events:', error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }

  function getStatusBadge(status: any) {
    if (status.open) return <span className="px-2 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-medium">Open</span>;
    if (status.closed) return <span className="px-2 py-1 rounded-full bg-yellow-500/10 text-yellow-500 text-xs font-medium">Closed</span>;
    if (status.resolved) return <span className="px-2 py-1 rounded-full bg-blue-500/10 text-blue-500 text-xs font-medium">Resolved</span>;
    return <span className="px-2 py-1 rounded-full bg-gray-500/10 text-gray-500 text-xs font-medium">Unknown</span>;
  }

  function getCategoryColor(category: string) {
    const colors: Record<string, string> = {
      Sports: 'bg-blue-500/10 text-blue-500',
      Esports: 'bg-purple-500/10 text-purple-500',
      Prediction: 'bg-orange-500/10 text-orange-500',
      Demo: 'bg-gray-500/10 text-gray-500',
    };
    return colors[category] || 'bg-gray-500/10 text-gray-500';
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Betting Events</h1>
          <p className="text-muted-foreground">Browse active events and place your bets</p>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                </CardHeader>
                <CardContent>
                  <div className="h-20 bg-muted rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : events.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <TrendingUp className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No Events Available</h3>
              <p className="text-muted-foreground mb-4">
                There are no betting events at the moment. Check back soon!
              </p>
              <Link href="/admin">
                <Button>Create Event (Admin)</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <Card key={event.eventId} className="hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(event.category)}`}>
                      {event.category}
                    </span>
                    {getStatusBadge(event.status)}
                  </div>
                  <CardTitle className="text-xl">{event.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{event.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <TrendingUp className="h-4 w-4" />
                        <span>Pool: {formatSOL(event.totalPool)} SOL</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>{event.totalBets} bets</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>Closes {formatDate(event.closeTime)}</span>
                    </div>

                    <div className="pt-2 space-y-2">
                      {event.outcomes.map((outcome, i) => (
                        <div key={i} className="flex items-center justify-between text-sm">
                          <span>{outcome}</span>
                          <span className="font-mono text-primary">
                            {event.outcomePools[i] > 0 
                              ? `${formatSOL(event.outcomePools[i])} SOL`
                              : '0 SOL'}
                          </span>
                        </div>
                      ))}
                    </div>

                    <Link href={`/events/${event.eventId}`}>
                      <Button className="w-full mt-4">
                        Place Bet
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
