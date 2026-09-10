import { Router } from 'express';
import { createNotification } from './notifications.routes';

const router = Router();

interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: string;
  recipientId: string;
}

const transactions: Transaction[] = [];
let nextId = 1;

// POST /api/transactions - Create transaction
router.post('/', (req, res) => {
  const { userId, amount, type, recipientId } = req.body;

  if (!userId || amount === undefined || !type || !recipientId) {
    return res.status(400).json({ error: 'userId, amount, type, and recipientId are required' });
  }

  if (typeof amount !== 'number' || amount <= 0) {
    return res.status(400).json({ error: 'amount must be a positive number' });
  }

  const newTransaction: Transaction = {
    id: String(nextId++),
    userId,
    amount,
    type,
    recipientId,
  };

  transactions.push(newTransaction);

  // Side-effect: trigger a notification, same as a real message-queue event would
  createNotification(userId, `Your ${type} of $${amount} was processed.`);

  res.status(201).json(newTransaction);
});

// GET /api/transactions/:userId - Get user transactions
router.get('/:userId', (req, res) => {
  const userTransactions = transactions.filter((t) => t.userId === req.params.userId);
  res.status(200).json(userTransactions);
});

export default router;
