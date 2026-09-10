import { Router } from 'express';
import { requireAuth } from './auth.middleware';

const router = Router();

interface User {
  id: string;
  name: string;
  email: string;
  accountType: string;
}

const users: User[] = [];
let nextId = 1;

// POST /api/users - Create user (public — no auth required to register)
router.post('/', (req, res) => {
  const { name, email, accountType } = req.body;

  if (!name || !email || !accountType) {
    return res.status(400).json({ error: 'name, email, and accountType are required' });
  }

  const newUser: User = {
    id: String(nextId++),
    name,
    email,
    accountType,
  };

  users.push(newUser);
  res.status(201).json(newUser);
});

// GET /api/users/:id - Get user details (protected)
router.get('/:id', requireAuth, (req, res) => {
  const user = users.find((u) => u.id === req.params.id);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.status(200).json(user);
});

export default router;
