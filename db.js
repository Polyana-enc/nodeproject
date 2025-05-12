const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'kpinder',
  password: '1234',
  port: 5432, // default PostgreSQL port
});

module.exports = pool;
