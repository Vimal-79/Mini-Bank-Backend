
import { Client } from "pg";
import dotenv from "dotenv";
dotenv.config();

export const connection = new Client({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT,
});

try {
  await connection.connect().then(() => {
    console.log("Connected to PostgreSQL database");
  })
} catch (err) {
  console.error("Error connecting to PostgreSQL database", err);
}