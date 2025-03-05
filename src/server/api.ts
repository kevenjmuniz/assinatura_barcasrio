import express from 'express';
import cors from 'cors';
import { query } from '../utils/db';
import { Request, Response } from 'express';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

import { testDatabaseConnection } from '../utils/db';

app.get('/api/signatures', async (req: Request, res: Response) => {
  try {
    const result = await query('SELECT * FROM signatures');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching signatures:', error);
    res.status(500).json({ error: 'Failed to fetch signatures' });
  }
});

app.post('/api/signatures', async (req: Request, res: Response) => {
  const { name, department, email, phone } = req.body;
  const date = new Date();

  try {
    const result = await query(
      'INSERT INTO signatures (name, department, date, email, phone) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, department, date, email, phone]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating signature:', error);
    res.status(500).json({ error: 'Failed to create signature' });
  }
});

app.get('/api/healthcheck', async (req, res) => {
  try {
    const status = await testDatabaseConnection();
    res.json(status);
  } catch (error) {
    res.status(500).json({ 
      connected: false, 
      message: `Erro ao verificar conexão com o banco: ${error instanceof Error ? error.message : String(error)}` 
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
