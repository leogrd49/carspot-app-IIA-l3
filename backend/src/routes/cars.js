import express from 'express';
import { db } from '../config/database.js';
import { validateCar, validateId } from '../middleware/validation.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        cars.*,
        brands.name as brand_name,
        models.name as model_name,
        trims.name as trim_name,
        specs.price,
        specs.engine,
        specs.weight,
        specs.horse_power
      FROM cars
      JOIN brands ON brands.id_brand = cars.id_brand
      JOIN models ON models.id_model = cars.id_model
      JOIN trims ON trims.id_trim = cars.id_trim
      JOIN specs ON specs.id_specs = cars.id_specs
      ORDER BY brands.name, models.name
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', validateId, async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        cars.*,
        brands.name as brand_name,
        models.name as model_name,
        trims.name as trim_name,
        specs.price,
        specs.engine,
        specs.weight,
        specs.horse_power
      FROM cars
      JOIN brands ON brands.id_brand = cars.id_brand
      JOIN models ON models.id_model = cars.id_model
      JOIN trims ON trims.id_trim = cars.id_trim
      JOIN specs ON specs.id_specs = cars.id_specs
      WHERE cars.id_car = ?
    `, [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Car not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', validateCar, async (req, res) => {
  try {
    const { id_specs, id_trim, id_model, id_brand } = req.body;
    const [result] = await db.query(
      'INSERT INTO cars (id_specs, id_trim, id_model, id_brand) VALUES (?, ?, ?, ?)',
      [id_specs, id_trim, id_model, id_brand]
    );
    res.status(201).json({ id: result.insertId, id_specs, id_trim, id_model, id_brand });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', validateId, validateCar, async (req, res) => {
  try {
    const { id_specs, id_trim, id_model, id_brand } = req.body;
    await db.query(
      'UPDATE cars SET id_specs = ?, id_trim = ?, id_model = ?, id_brand = ? WHERE id_car = ?',
      [id_specs, id_trim, id_model, id_brand, req.params.id]
    );
    res.json({ id: req.params.id, id_specs, id_trim, id_model, id_brand });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', validateId, async (req, res) => {
  try {
    await db.query('DELETE FROM cars WHERE id_car = ?', [req.params.id]);
    res.json({ message: 'Car deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
