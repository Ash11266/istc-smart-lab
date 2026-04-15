const { createConnection } = require('mysql2/promise');
const { v4: uuidv4 } = require('uuid');
const { config } = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load env vars
const envPath = path.resolve(process.cwd(), '.env');
const envLocalPath = path.resolve(process.cwd(), '.env.local');

if (fs.existsSync(envLocalPath)) {
  config({ path: envLocalPath });
} else if (fs.existsSync(envPath)) {
  config({ path: envPath });
} else {
  console.log('No .env or .env.local file found.');
}

async function seed() {
  console.log('🌱 Starting database seeding...');

  let connection;

  try {
    // Create connection
    connection = await createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'smart_lab',
    });

    console.log('✅ Connected to MySQL');

    // Create table if not exists
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS experiments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        uuid VARCHAR(255) NOT NULL UNIQUE,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        components VARCHAR(500),
        dataValues VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create users table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);


    // Clear existing data (optional, but good for a fresh seed)
    await connection.execute('TRUNCATE TABLE experiments');
    await connection.execute('TRUNCATE TABLE users');
    console.log('🧹 Cleared existing experiments and users.');

    // Insert seeds
    for (const exp of experiments) {
      const uuid = uuidv4();

      await connection.execute(
        `INSERT INTO experiments (uuid, name, description, components, dataValues)
         VALUES (?, ?, ?, ?, ?)`,
        [uuid, exp.name, exp.description, exp.components, exp.dataValues]
      );

      console.log(`✅ Inserted: ${exp.name}`);
    }

    console.log('🎉 Seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error during seeding:', error.message);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Connection closed');
    }
  }
}

seed();