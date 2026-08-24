'use client';

import { useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { PublicKey, SystemProgram } from '@solana/web3.js';
import { Program, AnchorProvider, BN } from '@coral-xyz/anchor';
import { Navbar } from '@/components/nav bar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Plus, CheckCircle2, XCircle } from 'lucide-react';
import { PROGRAM_ID } from '@/lib/solana/config';
import { IDL } from '@/lib/solana/idl';

export default function AdminPage() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Form state for create event
  const [eventId, setEventId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Sports');
  const [outcome1, setOutcome1] = useState('');
  const [outcome2, setOutcome2] = useState('');
  const [hoursUntilClose, setHoursUntilClose] = useState('24');

  async function handleCreateEvent() {
    if (!wallet.publicKey || !wallet.signTransaction) {
      setError('Please connect your wallet');
      return;
    }

    if (!eventId || !title || !description || !outcome1 || !outcome2) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const provider = new AnchorProvider(connection, wallet as any, {});
      const program = new Program(IDL, new PublicKey(PROGRAM_ID), provider);

      const eventIdBn = new BN(parseInt(eventId));
      const currentTime = Math.floor(Date.now() / 1000);
      const closeTime = currentTime + (parseInt(hoursUntilClose) * 3600);

      const [platformPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('platform')],
        program.programId
      );

      const [eventPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('event'), eventIdBn.toArrayLike(Buffer, 'le', 8)],
        program.programId
      );

      const tx = await program.methods
        .createEvent(
          eventIdBn,
          title,
          description,
          category,
          [outcome1, outcome2],
          new BN(currentTime),
          new BN(closeTime)
        )
        .accounts({
          platform: platformPda,
          event: eventPda,
          authority: wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      setSuccess(`Event created successfully! TX: ${tx.slice(0, 8)}...`);
      
      // Reset form
      setEventId('');
      setTitle('');
      setDescription('');
      setOutcome1('');
      setOutcome2('');
      setHoursUntilClose('24');

    } catch (err: any) {
      console.error('Error creating event:', err);
      setError(err.message || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  }

  async function handleInitializePlatform() {
    if (!wallet.publicKey || !wallet.signTransaction) {
      setError('Please connect your wallet');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const provider = new AnchorProvider(connection, wallet as any, {});
      const program = new Program(IDL, new PublicKey(PROGRAM_ID), provider);

      const [platformPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('platform')],
        program.programId
      );

      const tx = await program.methods
        .initializePlatform()
        .accounts({
          platform: platformPda,
          authority: wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      setSuccess(`Platform initialized! TX: ${tx.slice(0, 8)}...`);

    } catch (err: any) {
      console.error('Error initializing platform:', err);
      if (err.message?.includes('already in use')) {
        setError('Platform already initialized');
      } else {
        setError(err.message || 'Failed to initialize platform');
      }
    } finally {
      setLoading(false);
    }
  }

  if (!wallet.connected || !wallet.publicKey) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-16">
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-12 pb-12 text-center">
              <Shield className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-2xl font-bold mb-2">Admin Access Required</h2>
              <p className="text-muted-foreground mb-6">
                Connect your wallet to access the admin panel
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
          <div className="flex items-center gap-3 mb-2">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold">Admin Panel</h1>
          </div>
          <p className="text-muted-foreground">Manage events and platform configuration</p>
        </div>

        {/* Alerts */}
        {success && (
          <div className="mb-6 p-4 rounded-lg bg-green-500/10 border border-green-500/20 flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
            <p className="text-sm text-green-500">{success}</p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20 flex items-start gap-3">
            <XCircle className="h-5 w-5 text-destructive mt-0.5" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Platform Management */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Platform Setup</CardTitle>
              <CardDescription>One-time initialization</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Initialize the platform before creating events. This only needs to be done once.
              </p>
              <Button
                className="w-full"
                onClick={handleInitializePlatform}
                disabled={loading}
              >
                {loading ? 'Initializing...' : 'Initialize Platform'}
              </Button>
            </CardContent>
          </Card>

          {/* Create Event Form */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Create New Event
              </CardTitle>
              <CardDescription>Set up a new betting event</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => { e.preventDefault(); handleCreateEvent(); }} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Event ID</label>
                    <input
                      type="number"
                      value={eventId}
                      onChange={(e) => setEventId(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      placeholder="1"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option value="Sports">Sports</option>
                      <option value="Esports">Esports</option>
                      <option value="Prediction">Prediction</option>
                      <option value="Demo">Demo</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Event Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="Team A vs Team B"
                    maxLength={100}
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="Describe the event..."
                    rows={3}
                    maxLength={500}
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Outcome 1</label>
                    <input
                      type="text"
                      value={outcome1}
                      onChange={(e) => setOutcome1(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      placeholder="Team A"
                      maxLength={50}
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Outcome 2</label>
                    <input
                      type="text"
                      value={outcome2}
                      onChange={(e) => setOutcome2(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      placeholder="Team B"
                      maxLength={50}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Hours Until Close</label>
                  <input
                    type="number"
                    value={hoursUntilClose}
                    onChange={(e) => setHoursUntilClose(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="24"
                    min="1"
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Event will automatically close for betting after this time
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? 'Creating Event...' : 'Create Event'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Admin Info */}
        <Card className="mt-6 bg-orange-500/5 border-orange-500/20">
          <CardContent className="pt-6">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Shield className="h-4 w-4 text-orange-500" />
              <span>Admin Guidelines</span>
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Only the platform authority can create and manage events</li>
              <li>• Event IDs must be unique across the platform</li>
              <li>• Events cannot be deleted once created</li>
              <li>• Manually close events before resolving them</li>
              <li>• Resolution is final and cannot be changed</li>
              <li>• Always verify event details before creation</li>
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
