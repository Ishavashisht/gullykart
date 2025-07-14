const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: 'postgres', // Connect to default database first
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
});

const dbName = process.env.DB_NAME || 'gullykart';

async function initializeDatabase() {
  try {
    console.log('🔄 Initializing GullyKart database...');

    // Check if database exists, create if not
    const checkDb = await pool.query(
      `SELECT 1 FROM pg_database WHERE datname = '${dbName}'`
    );
    
    if (checkDb.rows.length === 0) {
      console.log(`📦 Creating database: ${dbName}`);
      await pool.query(`CREATE DATABASE ${dbName}`);
    } else {
      console.log(`✅ Database ${dbName} already exists`);
    }

    // Connect to the gullykart database
    const gullykartPool = new Pool({
      user: process.env.DB_USER || 'postgres',
      host: process.env.DB_HOST || 'localhost',
      database: dbName,
      password: process.env.DB_PASSWORD || 'password',
      port: process.env.DB_PORT || 5432,
    });

    // Read and execute schema
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('🏗️ Creating tables and inserting sample data...');
    await gullykartPool.query(schema);
    
    console.log('✅ Database initialized successfully!');
    console.log('📊 Sample data inserted:');
    
    // Show what was created
    const users = await gullykartPool.query('SELECT count(*) FROM users');
    const products = await gullykartPool.query('SELECT count(*) FROM products');
    const campaigns = await gullykartPool.query('SELECT count(*) FROM campaigns');
    
    console.log(`   👥 Users: ${users.rows[0].count}`);
    console.log(`   📦 Products: ${products.rows[0].count}`);
    console.log(`   📢 Campaigns: ${campaigns.rows[0].count}`);
    
    await gullykartPool.end();
    await pool.end();
    
  } catch (error) {
    console.error('💥 Database initialization failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  initializeDatabase();
}

module.exports = { initializeDatabase };
