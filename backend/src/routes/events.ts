import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const router = Router();
const prisma = new PrismaClient();

// Get all events with filtering
router.get('/', async (req, res, next) => {
  try {
    const { status, category, limit = '50', offset = '0' } = req.query;

    const where: any = {};
    if (status) where.status = status;
    if (category) where.category = category;

    const events = await prisma.event.findMany({
      where,
      include: {
        _count: {
          select: { bets: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit as string),
      skip: parseInt(offset as string),
    });

    const total = await prisma.event.count({ where });

    res.json({
      events,
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

// Get single event by ID
router.get('/:eventId', async (req, res, next) => {
  try {
    const eventId = parseInt(req.params.eventId);

    const event = await prisma.event.findUnique({
      where: { eventId },
      include: {
        bets: {
          orderBy: { timestamp: 'desc' },
          take: 20,
        },
      },
    });

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json(event);
  } catch (error) {
    next(error);
  }
});

// Get event statistics
router.get('/:eventId/stats', async (req, res, next) => {
  try {
    const eventId = parseInt(req.params.eventId);

    const event = await prisma.event.findUnique({
      where: { eventId },
    });

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const betsCount = await prisma.bet.count({
      where: { eventId },
    });

    const uniqueBettors = await prisma.bet.findMany({
      where: { eventId },
      select: { bettor: true },
      distinct: ['bettor'],
    });

    const outcomeDistribution = await prisma.bet.groupBy({
      by: ['outcomeIndex'],
      where: { eventId },
      _count: true,
      _sum: {
        amount: true,
      },
    });

    res.json({
      eventId,
      totalBets: betsCount,
      uniqueBettors: uniqueBettors.length,
      totalPool: event.totalPool.toString(),
      outcomeDistribution: outcomeDistribution.map(d => ({
        outcomeIndex: d.outcomeIndex,
        betsCount: d._count,
        totalAmount: d._sum.amount?.toString() || '0',
      })),
    });
  } catch (error) {
    next(error);
  }
});

export default router;
