import { createConnection } from 'mysql2/promise';
import { v4 as uuidv4 } from 'uuid';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

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

    console.log('📦 Table ready');

    // Clear old data
    await connection.execute('TRUNCATE TABLE experiments');
    console.log('🧹 Old data cleared');

    // Seed data
    const experiments = [
      {
        name: 'Alpha Node Sensor Diagnostic',
        description: 'Testing latency and packet loss under heavy load.',
        components: 'ESP32, DHT22, MPU6050',
        dataValues: 'temperature, humidity, acceleration',
      },
      {
        name: 'Thermal Camera Calibration',
        description: 'Detect hotspot anomalies using thermal sensors.',
        components: 'Raspberry Pi 4, MLX90640',
        dataValues: 'temperature, status',
      },
      {
        name: 'Battery Discharge Test',
        description: 'Analyze Li-Po battery voltage drop.',
        components: 'INA219, Arduino Nano',
        dataValues: 'voltage, current, power',
      },
      {
        name: 'Smart Greenhouse',
        description: 'Automated humidity & soil moisture control.',
        components: 'NodeMCU, Soil Sensor, Relay',
        dataValues: 'humidity, soil_moisture, temperature',
      },
      {
        name: 'ML Edge Inference',
        description: 'Detect sound anomalies using ML model.',
        components: 'Jetson Nano, Microphone',
        dataValues: 'noise_level, classification',
      },
      {
        name: 'Distance Measurement',
        description: 'Measure distance using ultrasonic sensor.',
        components: 'ESP8266, Ultrasonic Sensor',
        dataValues: 'distance',
      }
    ];

    // Insert data
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