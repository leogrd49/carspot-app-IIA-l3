import express from 'express';
import { db } from '../config/database.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM trims ORDER BY name');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM trims WHERE id_trim = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Trim not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    const [result] = await db.query('INSERT INTO trims (name) VALUES (?)', [name]);
    res.status(201).json({ id: result.insertId, name });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { name } = req.body;
    await db.query('UPDATE trims SET name = ? WHERE id_trim = ?', [name, req.params.id]);
    res.json({ id: req.params.id, name });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM trims WHERE id_trim = ?', [req.params.id]);
    res.json({ message: 'Trim deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
