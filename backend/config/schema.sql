-- GullyKart Database Schema

-- USERS table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    is_verified BOOLEAN DEFAULT FALSE,
    email_verified BOOLEAN DEFAULT FALSE,
    phone_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- PRODUCTS table
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price FLOAT NOT NULL,
    image_url VARCHAR(255),
    occasion VARCHAR(100) DEFAULT 'general',
    seller_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CAMPAIGNS table
CREATE TABLE IF NOT EXISTS campaigns (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    generated_image_url VARCHAR(255),
    generated_ad_copy TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- USER_SESSIONS table (for session management)
CREATE TABLE IF NOT EXISTS user_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- OTP_VERIFICATIONS table (for email/SMS OTP)
CREATE TABLE IF NOT EXISTS otp_verifications (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255),
    phone VARCHAR(20),
    otp_code VARCHAR(10) NOT NULL,
    verification_type VARCHAR(20) NOT NULL, -- 'email' or 'phone'
    is_used BOOLEAN DEFAULT FALSE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample users with hashed passwords
INSERT INTO users (username, email, hashed_password, phone, email_verified) VALUES
  ('isha_vashisht', 'isha@test.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+919876543210', true), -- password: test123
  ('dibyangana_das', 'dibya@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+919876543211', true), -- password: xyz456
  ('princy_patwa', 'patwaprincy01@gmail.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+919876543212', true) -- password: hashed_dummy
ON CONFLICT (email) DO NOTHING;

-- Insert products
INSERT INTO products (name, description, price, image_url, occasion, seller_id) VALUES
  ('Yellow Silk Saree', 'Traditional saree made of pure silk.', 2499.99, 'https://i.ibb.co/mFyB2HP5/yellow-saree.jpg', 'diwali', 1),
  ('Yellow Silk Saree Premium', 'Traditional saree made of pure silk.', 1999.00, 'https://i.ibb.co/NdrDFM8T/bridal-yellow-designer-silk-saree-with-zari-embroidery.jpg', 'wedding', 2),
  ('Festive Kurta Set', 'Perfect for Diwali or weddings.', 2899.50, 'https://i.ibb.co/MQHSqQp/kurta-set.jpg', 'diwali', 3),
  ('Festive Kurta Set Premium', 'Perfect for Diwali or weddings.', 1599.50, 'https://i.ibb.co/ZzNB1h1D/festive-kurta.jpg', 'eid', 1),
  ('Trendy Dupatta', 'Bridal dupatta with latest design.', 1399.00, 'https://i.ibb.co/WW1jTHJY/dupatta.jpg', 'wedding', 2),
  ('Trendy Dupatta with Kurta Set', 'Punjabi Suit of tebby silk.', 1999.00, 'https://i.ibb.co/20dsZVGc/new-designer-top-pent-with-dupatta-collection.jpg', 'karva-chauth', 3),
  ('Orange Navratri Chaniya Choli', 'Vibrant chaniya choli for Navratri.', 4299.00, 'https://i.ibb.co/XxYh9rGp/Navratri-saree.jpg', 'navratri', 1)
ON CONFLICT DO NOTHING;

-- Insert campaigns
INSERT INTO campaigns (product_id, generated_image_url, generated_ad_copy) VALUES
  (1, 'https://i.ibb.co/gMb6ddfj/Diwali-trend-cultural-saree.png', 'Celebrate Diwali with elegance! Grab this Yellow Silk Saree today.'),
  (2, 'https://i.ibb.co/4Zv9BCyZ/Kol-Kata-trend-kurta.png', 'Festive vibes in full style. Shop now for Kurta Sets in Kolkata!'),
  (3, 'https://i.ibb.co/DDMJDgGR/Basant-Panchmi-kurta-set.jpg', 'Brighten up Basant Panchami with our vibrant Yellow Dupattas!'),
  (7, 'https://i.ibb.co/XxYh9rGp/Navratri-saree.png', 'Turn heads this Navratri with our beautiful Saree.')
ON CONFLICT DO NOTHING;
