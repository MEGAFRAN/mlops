// server.js
const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
app.use(express.json()); // for parsing application/json

// Database connection pool
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST, 
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });


// Initialize "kitchen_elements" table
const initTable = async () => {
  const queryText = `
    CREATE TABLE IF NOT EXISTS kitchen_elements (
      id SERIAL PRIMARY KEY,
      name VARCHAR(50),
      quantity INT,
      notes TEXT
    )`;
  try {
    await pool.query(queryText);
    console.log("Table 'kitchen_elements' initialized");
  } catch (err) {
    console.error(err);
  }
};

initTable();

// Routes
app.get('/elements', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM kitchen_elements');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

app.post('/elements', async (req, res) => {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const insertPromises = req.body.map(async ({ name, quantity, notes }) => {
        const { rows } = await client.query('INSERT INTO kitchen_elements(name, quantity, notes) VALUES($1, $2, $3) RETURNING *', [name, quantity, notes]);
        return rows[0];
      });
      const insertedElements = await Promise.all(insertPromises);
      await client.query('COMMIT');
      res.status(201).json(insertedElements);
    } catch (err) {
      await client.query('ROLLBACK');
      console.error(err);
      res.status(500).send('Server error');
    } finally {
      client.release();
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
