import { createConnection } from 'mysql2/promise';
import { v4 as uuidv4 } from 'uuid';
import { config } from 'dotenv';
import path from 'path';
import fs from 'fs';
import db from "@/lib/db";

// Load env vars
// const envPath = path.resolve(process.cwd(), '.env');
// const envLocalPath = path.resolve(process.cwd(), '.env.local');

// if (fs.existsSync(envLocalPath)) {
//   config({ path: envLocalPath });
// } else if (fs.existsSync(envPath)) {
//   config({ path: envPath });
// } else {
//   console.log('No .env or .env.local file found.');
// }

async function seed() {
  console.log('🌱 Starting database seeding...');

  try {
    const connection = await createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'smart_lab',
    });

    console.log('✅ Connected to MySQL database.');

    // Temporary data
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

    // Optional: Create table if it doesn't exist just in case
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

    // Clear existing data (optional, but good for a fresh seed)
    await connection.execute('TRUNCATE TABLE experiments');
    console.log('🧹 Cleared existing experiments.');

    // Insert seeds
    for (const exp of experiments) {
      const uuid = uuidv4();
      await connection.execute(`
        INSERT INTO experiments (uuid, name, description, components, dataValues)
         VALUES (?, ?, ?, ?, ?)`,
        [uuid, exp.name, exp.description, exp.components, exp.dataValues]
      );
      console.log(`✅ Inserted: ${exp.name}`);
    }

    console.log('🎉 Seeding completed successfully!');
    await connection.end();

  } catch (error) {
    console.error('❌ Seeding failed:', error);
  }
}

seed();
