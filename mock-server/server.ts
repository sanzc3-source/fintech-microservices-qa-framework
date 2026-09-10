import express from 'express';
import cors from 'cors';
import userRoutes from './users.routes';
import transactionRoutes from './transactions.routes';
import notificationRoutes from './notifications.routes';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/notifications', notificationRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Mock server (Gateway) running on http://localhost:${PORT}`);
});
