import { Router } from 'express';

const router = Router();

interface Notification {
  id: string;
  userId: string;
  message: string;
  createdAt: string;
}

const notifications: Notification[] = [];
let nextId = 1;

// Called internally by the Transaction Service when a transaction is created
export function createNotification(userId: string, message: string) {
  const notification: Notification = {
    id: String(nextId++),
    userId,
    message,
    createdAt: new Date().toISOString(),
  };
  notifications.push(notification);
  return notification;
}

// GET /api/notifications/:userId - fetch notifications for a user (used by tests to verify the side-effect happened)
router.get('/:userId', (req, res) => {
  const userNotifications = notifications.filter((n) => n.userId === req.params.userId);
  res.status(200).json(userNotifications);
});

export default router;
