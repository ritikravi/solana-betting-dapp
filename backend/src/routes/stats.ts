import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get platform statistics
router.get('/platform', async (req, res, next) => {
  try {
    const totalEvents = await prisma.event.count();
    const totalBets = await prisma.bet.count();
    
    const totalVolumeResult = await prisma.bet.aggregate({
      _sum: {
        amount: true,
      },
    });

    const activeEvents = await prisma.event.count({
      where: { status: 'OPEN' },
    });

    const uniqueBettors = await prisma.bet.findMany({
      select: { bettor: true },
      distinct: ['bettor'],
    });

    const recentBets = await prisma.bet.findMany({
      take: 10,
      orderBy: { timestamp: 'desc' },
      include: {
        event: {
          select: {
            title: true,
            eventId: true,
          },
        },
      },
    });

    res.json({
      totalEvents,
      totalBets,
      totalVolume: totalVolumeResult._sum.amount?.toString() || '0',
      activeEvents,
      uniqueBettors: uniqueBettors.length,
      recentBets: recentBets.map(bet => ({
        txSignature: bet.txSignature,
        bettor: bet.bettor,
        amount: bet.amount.toString(),
        eventTitle: bet.event.title,
        eventId: bet.event.eventId,
        timestamp: bet.timestamp,
      })),
    });
  } catch (error) {
    next(error);
  }
});

// Get category statistics
router.get('/categories', async (req, res, next) => {
  try {
    const categories = await prisma.event.groupBy({
      by: ['category'],
      _count: true,
      _sum: {
        totalPool: true,
        totalBets: true,
      },
    });

    res.json({
      categories: categories.map(c => ({
        category: c.category,
        eventCount: c._count,
        totalPool: c._sum.totalPool?.toString() || '0',
        totalBets: c._sum.totalBets || 0,
      })),
    });
  } catch (error) {
    next(error);
  }
});

// Get leaderboard
router.get('/leaderboard', async (req, res, next) => {
  try {
    const { limit = '10' } = req.query;

    const bets = await prisma.bet.findMany({
      include: {
        event: true,
      },
    });

    // Calculate user statistics
    const userStats = new Map<string, {
      bettor: string;
      totalBets: number;
      totalWagered: bigint;
      wonBets: number;
      totalWinnings: bigint;
    }>();

    bets.forEach(bet => {
      if (!userStats.has(bet.bettor)) {
        userStats.set(bet.bettor, {
          bettor: bet.bettor,
          totalBets: 0,
          totalWagered: BigInt(0),
          wonBets: 0,
          totalWinnings: BigInt(0),
        });
      }

      const stats = userStats.get(bet.bettor)!;
      stats.totalBets++;
      stats.totalWagered += bet.amount;

      if (bet.event.status === 'RESOLVED' && bet.event.winningOutcome === bet.outcomeIndex) {
        stats.wonBets++;
        stats.totalWinnings += bet.potentialPayout;
      }
    });

    const leaderboard = Array.from(userStats.values())
      .sort((a, b) => Number(b.totalWinnings - a.totalWinnings))
      .slice(0, parseInt(limit as string))
      .map((stats, index) => ({
        rank: index + 1,
        bettor: stats.bettor,
        totalBets: stats.totalBets,
        totalWagered: stats.totalWagered.toString(),
        wonBets: stats.wonBets,
        totalWinnings: stats.totalWinnings.toString(),
        winRate: stats.totalBets > 0 ? ((stats.wonBets / stats.totalBets) * 100).toFixed(2) : '0.00',
      }));

    res.json({ leaderboard });
  } catch (error) {
    next(error);
  }
});

export default router;
