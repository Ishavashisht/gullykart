const pool = require('./config/database');

const checkOccasions = async () => {
  try {
    console.log('🔍 Checking current occasions in database...');
    
    const result = await pool.query('SELECT DISTINCT occasion, COUNT(*) as count FROM products GROUP BY occasion ORDER BY occasion');
    console.log('Current occasions in database:');
    result.rows.forEach(row => {
      console.log(`- ${row.occasion}: ${row.count} products`);
    });
    
    const campaigns = await pool.query('SELECT id, product_id, generated_ad_copy FROM campaigns');
    console.log('\nCampaigns:');
    campaigns.rows.forEach(row => {
      console.log(`- Product ${row.product_id}: ${row.generated_ad_copy}`);
    });
    
    // Check if there's a basant product
    const basantCheck = await pool.query("SELECT * FROM products WHERE occasion ILIKE '%basant%'");
    console.log(`\nBasant products found: ${basantCheck.rows.length}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkOccasions();
