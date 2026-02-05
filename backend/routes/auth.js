const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { Pool } = require('pg');
require('dotenv').config();

// Connect to Database
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// REGISTRATION ROUTE
router.post('/register', async (req, res) => {
  // 1. Accept nativeLanguage from the frontend
  const { name, email, password, nativeLanguage } = req.body;

  try {
    const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists!' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 2. Update the INSERT query to include native_language
    const newUser = await pool.query(
      'INSERT INTO users (name, email, password, native_language) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, email, hashedPassword, nativeLanguage]
    );

    const token = jwt.sign({ id: newUser.rows[0].id }, 'secretKey123', { expiresIn: '1h' });

    // 3. Send back the language so the frontend can save it to localStorage
    res.json({ 
        token, 
        user: { 
            id: newUser.rows[0].id, 
            name, 
            email, 
            nativeLanguage: newUser.rows[0].native_language 
        } 
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// LOGIN ROUTE
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Check if user exists
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (user.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid Credentials (User not found)' });
    }

    // 2. Check if password matches (Compare encrypted passwords)
    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid Credentials (Wrong Password)' });
    }

    // 3. Generate Token
    const token = jwt.sign({ id: user.rows[0].id }, 'secretKey123', { expiresIn: '1h' });

    // 4. Send back success
    res.json({
      token,
      user: {
        id: user.rows[0].id,
        name: user.rows[0].name,
        email: user.rows[0].email,
        nativeLanguage: user.rows[0].native_language // Important for your Translator!
      }
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;