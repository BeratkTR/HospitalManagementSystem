require("dotenv").config();
const { Pool } = require('pg');

const pool = new Pool();   // process.env.password

module.exports = {
  query: (text, params) => pool.query(text, params)
};