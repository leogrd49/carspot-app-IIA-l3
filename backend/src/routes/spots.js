import express from 'express';
import { db } from '../config/database.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        Spot.*,
        users.username,
        users.email,
        brands.name as brand_name,
        models.name as model_name,
        trims.name as trim_name,
        specs.price,
        specs.engine,
        specs.weight,
        specs.horse_power
      FROM Spot
      JOIN users ON users.id_user = Spot.id_user
      JOIN cars ON cars.id_car = Spot.id_car
      JOIN brands ON brands.id_brand = cars.id_brand
      JOIN models ON models.id_model = cars.id_model
      JOIN trims ON trims.id_trim = cars.id_trim
      JOIN specs ON specs.id_specs = cars.id_specs
      ORDER BY Spot.spoted_at DESC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/stats/locations', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT location, COUNT(*) as count
      FROM Spot
      GROUP BY location
      ORDER BY count DESC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/stats/brands', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT brands.name as brand_name, COUNT(*) as count
      FROM Spot
      JOIN cars ON cars.id_car = Spot.id_car
      JOIN brands ON brands.id_brand = cars.id_brand
      GROUP BY brands.name
      ORDER BY count DESC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { id_user, id_car, location } = req.body;
    await db.query(
      'INSERT INTO Spot (id_user, id_car, spoted_at, location) VALUES (?, ?, NOW(), ?)',
      [id_user, id_car, location]
    );
    res.status(201).json({ id_user, id_car, location });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id_user/:id_car', async (req, res) => {
  try {
    const { location } = req.body;
    await db.query(
      'UPDATE Spot SET location = ?, spoted_at = NOW() WHERE id_user = ? AND id_car = ?',
      [location, req.params.id_user, req.params.id_car]
    );
    res.json({ id_user: req.params.id_user, id_car: req.params.id_car, location });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id_user/:id_car', async (req, res) => {
  try {
    await db.query('DELETE FROM Spot WHERE id_user = ? AND id_car = ?', [req.params.id_user, req.params.id_car]);
    res.json({ message: 'Spot deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
