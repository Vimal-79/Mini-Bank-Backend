// import pkg from 'pg'
// const { Pool } = pkg

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL
//   // or: host, user, password, database, port individually
// })

// // Create table if it doesn't exist
// async function initDB() {
//   await pool.query(`
//     CREATE TABLE IF NOT EXISTS users (
//       id        SERIAL PRIMARY KEY,
//       name      VARCHAR(255) NOT NULL,
//       email     VARCHAR(255) UNIQUE NOT NULL,
//       created_at TIMESTAMP DEFAULT NOW()
//     )
//   `)
// }

// initDB()

// // Insert data coming from Next.js
// app.post('/api/users', async (req, res) => {
//   const { name, email } = req.body

//   try {
//     const result = await pool.query(
//       'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
//       [name, email]
//     )
//     res.json({ success: true, user: result.rows[0] })
//   } catch (err) {
//     res.status(500).json({ error: err.message })
//   }
// })

