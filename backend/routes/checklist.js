const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const pool = require('../config/db'); // Use shared pool
require('dotenv').config();

// 1. GET ALL ITEMS (Specific to the logged-in user)
router.get('/', auth, async (req, res) => {
  try {
    // We rename columns to match your Frontend (item_name -> label, is_checked -> checked)
    const result = await pool.query(
      'SELECT id, item_name as label, is_checked as checked FROM checklists WHERE user_id = $1 ORDER BY id ASC',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// 2. ADD ITEM
router.post('/', auth, async (req, res) => {
  try {
    const { label } = req.body; // Frontend sends 'label'
    const newItem = await pool.query(
      'INSERT INTO checklists (user_id, item_name, is_checked) VALUES ($1, $2, $3) RETURNING id, item_name as label, is_checked as checked',
      [req.user.id, label, false]
    );
    res.json(newItem.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// 3. TOGGLE CHECK/UNCHECK
router.put('/:id', auth, async (req, res) => {
  try {
    const { checked } = req.body;
    await pool.query(
      'UPDATE checklists SET is_checked = $1 WHERE id = $2 AND user_id = $3',
      [checked, req.params.id, req.user.id]
    );
    res.json({ message: 'Updated' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// 4. DELETE ITEM
router.delete('/:id', auth, async (req, res) => {
  try {
    await pool.query(
      'DELETE FROM checklists WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;