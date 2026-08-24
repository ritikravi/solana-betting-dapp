import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get all bets with filtering
router.get('/', async (req, res, next) => {
  try {
    const { eventId, bettor, claimed, limit = '50', offset = '0' } = req.query;

    const where: any = {};
    if (eventId) where.eventId = parseInt(eventId as string);
    if (bettor) where.bettor = bettor;
    if (claimed !== undefined) where.claimed = claimed === 'true';

    const bets = await prisma.bet.findMany({
      where,
      include: {
        event: {
          select: {
            eventId: true,
            title: true,
            status: true,
            winningOutcome: true,
          },
        },
      },
      orderBy: { timestamp: 'desc' },
      take: parseInt(limit as string),
      skip: parseInt(offset as string),
    });

    const total = await prisma.bet.count({ where });

    res.json({
      bets,
      pagination: {
        total,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
      },
    });
  } catch (error) {
    next(error);
  }
});

// Get user's bets
router.get('/user/:wallet', async (req, res, next) => {
  try {
    const { wallet } = req.params;
    const { limit = '50', offset = '0' } = req.query;

    const bets = await prisma.bet.findMany({
      where: { bettor: wallet },
      include: {
        event: true,
      },
      orderBy: { timestamp: 'desc' },
      take: parseInt(limit as string),
      skip: parseInt(offset as string),
    });

    const total = await prisma.bet.count({ where: { bettor: wallet } });

    // Calculate user statistics
    const totalWagered = bets.reduce((sum, bet) => sum + Number(bet.amount), 0);
    const activeBets = bets.filter(b => b.event.status === 'OPEN' || b.event.status === 'CLOSED');
    const wonBets = bets.filter(b => b.event.status === 'RESOLVED' && b.event.winningOutcome === b.outcomeIndex);
    const lostBets = bets.filter(b => b.event.status === 'RESOLVED' && b.event.winningOutcome !== b.outcomeIndex);
    const totalWinnings = wonBets.reduce((sum, bet) => sum + Number(bet.potentialPayout), 0);

    res.json({
      bets,
      statistics: {
        totalBets: total,
        activeBets: activeBets.length,
        wonBets: wonBets.length,
        lostBets: lostBets.length,
        totalWagered: totalWagered.toString(),
        totalWinnings: totalWinnings.toString(),
        winRate: lostBets.length + wonBets.length > 0 
          ? ((wonBets.length / (wonBets.length + lostBets.length)) * 100).toFixed(2)
          : '0.00',
      },
      pagination: {
        total,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
      },
    });
  } catch (error) {
    next(error);
  }
});

// Get bet by transaction signature
router.get('/tx/:signature', async (req, res, next) => {
  try {
    const { signature } = req.params;

    const bet = await prisma.bet.findUnique({
      where: { txSignature: signature },
      include: {
        event: true,
      },
    });

    if (!bet) {
      return res.status(404).json({ error: 'Bet not found' });
    }

    res.json(bet);
  } catch (error) {
    next(error);
  }
});

export default router;
