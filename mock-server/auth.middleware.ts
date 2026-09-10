import { Request, Response, NextFunction } from 'express';
import { config } from '../src/config/env';

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const apiKey = req.header('x-api-key');

  if (!apiKey) {
    return res.status(401).json({ error: 'Missing API key' });
  }

  if (apiKey !== config.apiKey) {
    return res.status(403).json({ error: 'Invalid API key' });
  }

  next();
}
