import { Pool } from "pg";
import config from "../config";

export const pool = new Pool({
  connectionString: config.connection_string,
});
export const initDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users(
        id SERIAL UNIQUE PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password TEXT NOT NULL,

        role VARCHAR(20) NOT NULL DEFAULT 'contributor'
          CHECK (role IN ('contributor', 'maintainer')),

        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);


    await pool.query(`
  CREATE TABLE IF NOT EXISTS issues(
    id INT,

    title VARCHAR(150) NOT NULL
        CHECK (char_length(title) <= 150),

    description TEXT NOT NULL
        CHECK (char_length(description) >= 20),

    type VARCHAR(20) NOT NULL
        CHECK (type IN ('bug', 'feature_request')),

    status VARCHAR(20) DEFAULT 'open'
        CHECK (status IN ('open', 'in_progress', 'resolved')),

    reported_id INT NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
    `);

    console.log("Database connected successfully!");
  } catch (error) {
    console.log(error);
  }
};