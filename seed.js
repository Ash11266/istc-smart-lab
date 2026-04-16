const { createConnection } = require('mysql2/promise');
const { v4: uuidv4 } = require('uuid');
const { config } = require('dotenv');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

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

    // Drop existing tables
    await connection.execute('DROP TABLE IF EXISTS experiments');
    await connection.execute('DROP TABLE IF EXISTS users');
    console.log('🧹 Dropped existing experiments and users tables.');

    // Create table if not exists
    await connection.execute(`
      CREATE TABLE experiments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        uuid VARCHAR(255) NOT NULL UNIQUE,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        components VARCHAR(500),
        dataValues VARCHAR(500),
        created_by INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create users table
    await connection.execute(`
      CREATE TABLE users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        name VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        is_admin BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Insert Admin User first to get its ID
    const adminPassword = await bcrypt.hash('admin123', 10);
    const [adminRow] = await connection.execute(
        `INSERT INTO users (email, name, password, is_admin)
         VALUES (?, ?, ?, ?)`,
        ['admin@smartlab.com', 'Admin User', adminPassword, true]
    );
    const adminId = adminRow.insertId;
    console.log(`✅ Default admin user created (admin@smartlab.com / admin123) with ID ${adminId}`);

    // Insert experiments seeds
    const experiments = [
      {
        name: 'Alpha Node Sensor Diagnostic',
        description: 'Testing latency and packet loss of the alpha node sensors under heavy load conditions.',
        components: 'ESP32, DHT22, MPU6050',
        dataValues: 'temperature, humidity, acceleration',
      },
      {
        name: 'Thermal Camera Array Calibration',
        description: 'Calibrating the thermal visualizer for the new smart lab monitoring dashboard to detect hotspot anomalies.',
        components: 'Raspberry Pi 4, MLX90640, Active Cooling Unit',
        dataValues: 'temperature, status',
      },
      {
        name: 'Battery Discharge Kinetics',
        description: 'Evaluating voltage drops on Li-Po batteries during sustained transmission intervals.',
        components: 'INA219, Arduino Nano 33 BLE, 18650 Cells',
        dataValues: 'voltage, current, power',
      },
      {
        name: 'Automated Greenhouse Climate Control',
        description: 'Regulating humidity and soil moisture for optimal plant growth in a controlled ecosystem.',
        components: 'NodeMCU, Soil Moisture Sensor, Relay Module, Water Pump',
        dataValues: 'humidity, soil_moisture, temperature',
      },
      {
        name: 'Machine Learning Edge Inference',
        description: 'Running a lightweight TensorFlow Lite model to classify acoustic anomalies in real-time.',
        components: 'Jetson Nano, USB Microphone Array',
        dataValues: 'noise_level, classification',
      },
      {
        name: 'Distance Measurement',
        description: 'Measuring Distance using an Ultrasonic Sensor and ESP8266',
        components: 'Esp8266, Ultrasonic Sensor',
        dataValues: 'distance',
      }
    ];

    for (const exp of experiments) {
      const uuid = uuidv4();

      await connection.execute(
        `INSERT INTO experiments (uuid, name, description, components, dataValues, created_by)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [uuid, exp.name, exp.description, exp.components, exp.dataValues, adminId]
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