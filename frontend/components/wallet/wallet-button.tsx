'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { shortenAddress } from '@/lib/utils';

export function WalletButton() {
  const { publicKey, connected } = useWallet();

  return (
    <div className="flex items-center gap-2">
      {connected && publicKey && (
        <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          <span className="font-mono">{shortenAddress(publicKey.toString())}</span>
        </div>
      )}
      <WalletMultiButton />
    </div>
  );
}
