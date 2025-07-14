const pool = require('./config/database');

const fixProducts = async () => {
  try {
    console.log('🔍 Checking current products...');
    
    // Check current products by occasion
    const diwaliProducts = await pool.query("SELECT * FROM products WHERE occasion = 'diwali' ORDER BY id");
    console.log('\nDiwali products:');
    diwaliProducts.rows.forEach(row => {
      console.log(`- ID: ${row.id}, Name: ${row.name}, Seller: ${row.seller_id}`);
    });
    
    const eidProducts = await pool.query("SELECT * FROM products WHERE occasion = 'eid' ORDER BY id");
    console.log('\nEid products:');
    eidProducts.rows.forEach(row => {
      console.log(`- ID: ${row.id}, Name: ${row.name}, Seller: ${row.seller_id}`);
    });
    
    // Remove jane_smith products from eid (seller_id = 2)
    console.log('\n🗑️ Removing jane_smith products from eid...');
    
    // First, delete campaigns for jane_smith eid products
    await pool.query(`
      DELETE FROM campaigns 
      WHERE product_id IN (
        SELECT id FROM products 
        WHERE occasion = 'eid' AND seller_id = 2
      )
    `);
    console.log('Deleted campaigns for jane_smith eid products');
    
    // Then delete the products
    const deleteResult = await pool.query(`
      DELETE FROM products 
      WHERE occasion = 'eid' AND seller_id = 2
    `);
    console.log(`Deleted ${deleteResult.rowCount} jane_smith products from eid`);
    
    // Remove duplicate diwali products (keep only one of each)
    console.log('\n🗑️ Removing duplicate diwali products...');
    const duplicateCheck = await pool.query(`
      SELECT name, COUNT(*) as count 
      FROM products 
      WHERE occasion = 'diwali' 
      GROUP BY name 
      HAVING COUNT(*) > 1
    `);
    
    for (const duplicate of duplicateCheck.rows) {
      console.log(`Found ${duplicate.count} copies of "${duplicate.name}"`);
      // Keep the first one, delete the rest
      await pool.query(`
        DELETE FROM products 
        WHERE id NOT IN (
          SELECT MIN(id) 
          FROM products 
          WHERE name = $1 AND occasion = 'diwali'
        ) 
        AND name = $1 AND occasion = 'diwali'
      `, [duplicate.name]);
      console.log(`Removed duplicates of "${duplicate.name}"`);
    }
    
    // Add the festive kurta to eid with the specified image
    console.log('\n➕ Adding Festive Kurta to eid with correct thumbnail...');
    await pool.query(`
      INSERT INTO products (name, description, price, image_url, occasion, seller_id) 
      VALUES ($1, $2, $3, $4, $5, $6)
    `, [
      'Festive Kurta Set Premium',
      'Perfect for Eid celebrations with premium quality.',
      1599.50,
      'https://i.ibb.co/ZzNB1h1D/festive-kurta.jpg',
      'eid',
      1 // isha_vashisht as seller
    ]);
    
    console.log('\n✅ Final check:');
    const finalDiwali = await pool.query("SELECT name, image_url FROM products WHERE occasion = 'diwali'");
    console.log('Diwali products:');
    finalDiwali.rows.forEach(row => {
      console.log(`- ${row.name}: ${row.image_url}`);
    });
    
    const finalEid = await pool.query("SELECT name, image_url FROM products WHERE occasion = 'eid'");
    console.log('Eid products:');
    finalEid.rows.forEach(row => {
      console.log(`- ${row.name}: ${row.image_url}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

fixProducts();
