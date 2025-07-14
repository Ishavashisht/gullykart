const pool = require('./config/database');

const addBasantProduct = async () => {
  try {
    console.log('➕ Adding Basant Panchami product...');
    
    // Add a Basant product
    const insertResult = await pool.query(`
      INSERT INTO products (name, description, price, image_url, occasion, seller_id) 
      VALUES ($1, $2, $3, $4, $5, $6) 
      RETURNING id
    `, [
      'Yellow Dupatta for Basant Panchami',
      'Brighten up Basant Panchami with our vibrant Yellow Dupatta perfect for the spring festival!',
      1399.00,
      'https://i.ibb.co/DDMJDgGR/Basant-Panchmi-kurta-set.jpg', // Using the campaign image as product image
      'basant',
      2 // jane_smith as seller
    ]);
    
    const newProductId = insertResult.rows[0].id;
    console.log(`✅ Basant product created with ID: ${newProductId}`);
    
    // Update the campaign to point to the new Basant product
    await pool.query(`
      UPDATE campaigns 
      SET product_id = $1 
      WHERE generated_ad_copy LIKE '%Basant Panchami%'
    `, [newProductId]);
    
    console.log('✅ Campaign updated to point to the new Basant product');
    
    // Verify the result
    const verification = await pool.query(`
      SELECT p.name, p.occasion, c.generated_ad_copy 
      FROM products p 
      JOIN campaigns c ON p.id = c.product_id 
      WHERE p.occasion = 'basant'
    `);
    
    console.log('✅ Verification:');
    verification.rows.forEach(row => {
      console.log(`- Product: ${row.name} (${row.occasion})`);
      console.log(`- Campaign: ${row.generated_ad_copy}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

addBasantProduct();
