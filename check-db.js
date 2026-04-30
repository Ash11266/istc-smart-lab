
const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

async function checkUsers() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: 3306
  });

  try {
    const [rows] = await connection.execute('SELECT id, email, is_admin FROM users');
    console.log('Users in DB:', rows);
  } catch (err) {
    console.error('Error fetching users:', err);
  } finally {
    await connection.end();
  }
}

checkUsers();
