import express from 'express';
import { db } from '../config/database.js';
import { validateUser, validateId } from '../middleware/validation.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM users ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', validateId, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE id_user = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id/spots', validateId, async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        spot.*,
        brands.name as brand_name,
        models.name as model_name,
        trims.name as trim_name,
        specs.*
      FROM spot
      JOIN cars ON cars.id_car = spot.id_car
      JOIN brands ON brands.id_brand = cars.id_brand
      JOIN models ON models.id_model = cars.id_model
      JOIN trims ON trims.id_trim = cars.id_trim
      JOIN specs ON specs.id_specs = cars.id_specs
      WHERE spot.id_user = ?
      ORDER BY spot.spoted_at DESC
    `, [req.params.id]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', validateUser, async (req, res) => {
  try {
    const { username, email } = req.body;
    const [result] = await db.query(
      'INSERT INTO users (username, email, created_at, updated_at) VALUES (?, ?, NOW(), NOW())',
      [username, email]
    );
    res.status(201).json({ id: result.insertId, username, email });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', validateId, validateUser, async (req, res) => {
  try {
    const { username, email } = req.body;
    await db.query(
      'UPDATE users SET username = ?, email = ?, updated_at = NOW() WHERE id_user = ?',
      [username, email, req.params.id]
    );
    res.json({ id: req.params.id, username, email });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', validateId, async (req, res) => {
  try {
    await db.query('DELETE FROM users WHERE id_user = ?', [req.params.id]);
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
