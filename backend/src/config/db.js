require("dotenv").config();

const { Pool } = require("pg");

//postgre connection setup
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

pool
  .connect()
  .then(() => console.log("connected to postgreSQL"))
  .catch((err) => console.error("Connection error:", err));

module.exports = pool;
