import express from 'express';
import { db } from '../config/database.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM specs');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM specs WHERE id_specs = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Specs not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { price, engine, weight, horse_power } = req.body;
    const [result] = await db.query(
      'INSERT INTO specs (price, engine, weight, horse_power) VALUES (?, ?, ?, ?)',
      [price, engine, weight, horse_power]
    );
    res.status(201).json({ id: result.insertId, price, engine, weight, horse_power });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { price, engine, weight, horse_power } = req.body;
    await db.query(
      'UPDATE specs SET price = ?, engine = ?, weight = ?, horse_power = ? WHERE id_specs = ?',
      [price, engine, weight, horse_power, req.params.id]
    );
    res.json({ id: req.params.id, price, engine, weight, horse_power });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM specs WHERE id_specs = ?', [req.params.id]);
    res.json({ message: 'Specs deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
