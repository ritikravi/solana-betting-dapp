import { Router } from 'express';
import { indexTransaction } from '../services/indexer';

const router = Router();

// Trigger manual indexing of a transaction
router.post('/sync/:signature', async (req, res, next) => {
  try {
    const { signature } = req.params;
    
    const result = await indexTransaction(signature);
    
    res.json({
      success: true,
      signature,
      result,
    });
  } catch (error) {
    next(error);
  }
});

// Get indexer status
router.get('/status', async (req, res, next) => {
  try {
    // This would check the last indexed block/transaction
    // For MVP, just return a simple status
    res.json({
      status: 'running',
      network: process.env.SOLANA_NETWORK || 'devnet',
      lastSync: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
});

export default router;
