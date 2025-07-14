const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
require('dotenv').config();

// Import database connection and auth routes
const pool = require('./config/database');
const authRoutes = require('./routes/auth');
const { cleanExpiredSessions } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:8080', 'http://localhost:3001'], // All possible frontend ports
  credentials: true
}));
app.use(bodyParser.json());

// Clean expired sessions every hour
setInterval(cleanExpiredSessions, 60 * 60 * 1000);

// Initialize database on startup
const initializeDatabase = async () => {
  try {
    await pool.query('SELECT NOW()');
    console.log('🐘 PostgreSQL database connected successfully');
  } catch (error) {
    console.error('💥 Database connection failed:', error);
    process.exit(1);
  }
};

// OTP storage (now using database)

// Gmail transporter configuration
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD
    }
  });
};

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Store OTP in database with 5-minute expiration
const storeOTP = async (email, phone, otp, verificationType) => {
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
  
  try {
    // Clean expired OTPs first
    await pool.query('DELETE FROM otp_verifications WHERE expires_at < NOW()');
    
    // Store new OTP
    await pool.query(
      'INSERT INTO otp_verifications (email, phone, otp_code, verification_type, expires_at) VALUES ($1, $2, $3, $4, $5)',
      [email, phone, otp, verificationType, expiresAt]
    );
    
    console.log(`OTP stored for ${email || phone}: ${otp} (expires at ${expiresAt})`);
  } catch (error) {
    console.error('Error storing OTP:', error);
    throw error;
  }
};

// Verify OTP from database
const verifyOTP = async (email, phone, inputOTP, verificationType) => {
  try {
    const query = verificationType === 'email' 
      ? 'SELECT * FROM otp_verifications WHERE email = $1 AND verification_type = $2 AND is_used = FALSE AND expires_at > NOW() ORDER BY created_at DESC LIMIT 1'
      : 'SELECT * FROM otp_verifications WHERE phone = $1 AND verification_type = $2 AND is_used = FALSE AND expires_at > NOW() ORDER BY created_at DESC LIMIT 1';
    
    const identifier = verificationType === 'email' ? email : phone;
    const result = await pool.query(query, [identifier, verificationType]);
    
    if (result.rows.length === 0) {
      console.log(`No valid OTP found for ${identifier}`);
      return false;
    }
    
    const storedOTP = result.rows[0];
    
    if (storedOTP.otp_code === inputOTP) {
      // Mark OTP as used
      await pool.query(
        'UPDATE otp_verifications SET is_used = TRUE WHERE id = $1',
        [storedOTP.id]
      );
      
      console.log(`OTP verified successfully for ${identifier}`);
      return true;
    }
    
    console.log(`Invalid OTP for ${identifier}. Expected: ${storedOTP.otp_code}, Got: ${inputOTP}`);
    return false;
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return false;
  }
};

// Generate HTML email template
const generateOTPEmailTemplate = (otp, name) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>GullyKart Verification Code</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 20px; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .header { text-align: center; margin-bottom: 30px; }
          .logo { font-size: 28px; font-weight: bold; color: #2563eb; margin-bottom: 10px; }
          .otp-code { font-size: 32px; font-weight: bold; color: #059669; text-align: center; background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; letter-spacing: 4px; }
          .warning { background: #fef3cd; padding: 15px; border-radius: 6px; margin: 20px 0; color: #856404; }
          .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">🛒 GullyKart</div>
            <h2>Email Verification</h2>
          </div>
          
          <p>Hello ${name || 'there'},</p>
          
          <p>Thank you for signing up with GullyKart! To complete your registration, please use the verification code below:</p>
          
          <div class="otp-code">${otp}</div>
          
          <p>This code will expire in <strong>5 minutes</strong> for security reasons.</p>
          
          <div class="warning">
            <strong>Important:</strong> Never share this code with anyone. GullyKart will never ask for your verification code via phone or email.
          </div>
          
          <p>If you didn't request this verification code, please ignore this email.</p>
          
          <p>Welcome to the GullyKart family!</p>
          
          <div class="footer">
            <p>© 2025 GullyKart. All rights reserved.</p>
            <p>This is an automated message, please do not reply to this email.</p>
          </div>
        </div>
      </body>
    </html>
  `;
};

// API Routes

// Auth routes
app.use('/api/auth', authRoutes);

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'GullyKart Backend API is running!', timestamp: new Date().toISOString() });
});

// Test email connection
app.get('/api/test-email', async (req, res) => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    res.json({ success: true, message: 'Email connection successful!' });
  } catch (error) {
    console.error('Email connection test failed:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Email connection failed',
      error: error.message 
    });
  }
});

// Send OTP endpoint (supports both email and phone)
app.post('/api/send-otp', async (req, res) => {
  try {
    const { email, phone, name, type = 'email' } = req.body;

    if (!email && !phone) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email or phone number is required' 
      });
    }

    // Generate and store OTP
    const otp = generateOTP();
    await storeOTP(email, phone, otp, type);

    if (type === 'email' && email) {
      // Send email OTP
      const transporter = createTransporter();
      const mailOptions = {
        from: {
          name: 'GullyKart Team',
          address: process.env.GMAIL_USER
        },
        to: email,
        subject: 'GullyKart - Your Verification Code',
        html: generateOTPEmailTemplate(otp, name)
      };

      console.log(`Sending OTP email to ${email}...`);
      const result = await transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', result.messageId);

      res.json({
        success: true,
        message: `OTP sent successfully to ${email}`,
        messageId: result.messageId
      });
    } else if (type === 'phone' && phone) {
      // For SMS implementation, you would integrate with SMS service here
      // For now, we'll just return success (you can add Twilio, AWS SNS, etc.)
      console.log(`SMS OTP would be sent to ${phone}: ${otp}`);
      
      res.json({
        success: true,
        message: `OTP sent successfully to ${phone}`,
        note: 'SMS integration not implemented yet'
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid verification type or missing contact information'
      });
    }

  } catch (error) {
    console.error('Failed to send OTP:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send OTP. Please try again.',
      error: error.message
    });
  }
});

// Verify OTP endpoint (supports both email and phone)
app.post('/api/verify-otp', async (req, res) => {
  try {
    const { email, phone, otp, type = 'email' } = req.body;

    if (!otp) {
      return res.status(400).json({
        success: false,
        message: 'OTP is required'
      });
    }

    if (!email && !phone) {
      return res.status(400).json({
        success: false,
        message: 'Email or phone number is required'
      });
    }

    const isValid = await verifyOTP(email, phone, otp, type);

    if (isValid) {
      // Update user verification status if they exist
      if (type === 'email' && email) {
        await pool.query(
          'UPDATE users SET email_verified = TRUE WHERE email = $1',
          [email]
        );
      } else if (type === 'phone' && phone) {
        await pool.query(
          'UPDATE users SET phone_verified = TRUE WHERE phone = $1',
          [phone]
        );
      }

      res.json({
        success: true,
        message: 'OTP verified successfully'
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP'
      });
    }

  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({
      success: false,
      message: 'OTP verification failed',
      error: error.message
    });
  }
});

// Products API endpoints

// Get all products
app.get('/api/products', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*, u.username as seller_name 
      FROM products p 
      LEFT JOIN users u ON p.seller_id = u.id 
      ORDER BY p.id DESC
    `);
    
    res.json({
      success: true,
      products: result.rows
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error.message
    });
  }
});

// Get products by occasion
app.get('/api/products/occasion/:occasion', async (req, res) => {
  try {
    const { occasion } = req.params;
    
    const result = await pool.query(`
      SELECT p.*, u.username as seller_name 
      FROM products p 
      LEFT JOIN users u ON p.seller_id = u.id 
      WHERE LOWER(p.occasion) = LOWER($1)
      ORDER BY p.id DESC
    `, [occasion]);
    
    res.json({
      success: true,
      occasion: occasion,
      products: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Error fetching products by occasion:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products for this occasion',
      error: error.message
    });
  }
});

// Get available occasions
app.get('/api/occasions', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT DISTINCT occasion, COUNT(*) as product_count 
      FROM products 
      WHERE occasion IS NOT NULL 
      GROUP BY occasion 
      ORDER BY occasion
    `);
    
    res.json({
      success: true,
      occasions: result.rows
    });
  } catch (error) {
    console.error('Error fetching occasions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch occasions',
      error: error.message
    });
  }
});

// Insights route - Get products by occasion for insights page
app.get('/insights/:occasion', async (req, res) => {
  try {
    const { occasion } = req.params;
    
    // Validate occasion parameter
    if (!occasion || occasion.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Occasion parameter is required'
      });
    }

    // Query products by occasion with user and campaign data
    const result = await pool.query(`
      SELECT 
        p.*,
        u.username as seller_name,
        u.email as seller_email,
        c.generated_image_url,
        c.generated_ad_copy,
        c.created_at as campaign_created_at
      FROM products p
      LEFT JOIN users u ON p.seller_id = u.id
      LEFT JOIN campaigns c ON p.id = c.product_id
      WHERE LOWER(p.occasion) = LOWER($1)
      ORDER BY p.id DESC
    `, [occasion]);

    // If no products found for this occasion
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No products found for occasion: ${occasion}`,
        occasion: occasion,
        products: [],
        count: 0
      });
    }

    // Process products to ensure thumbnail uses product image_url
    const processedProducts = result.rows.map(product => ({
      ...product,
      thumbnail_url: product.image_url, // Use product's original image as thumbnail
      campaign_image_url: product.generated_image_url, // Keep campaign image separate
      has_campaign: !!product.generated_image_url
    }));

    res.json({
      success: true,
      message: `Products found for ${occasion}`,
      occasion: occasion,
      products: processedProducts,
      count: processedProducts.length,
      insights: {
        total_products: processedProducts.length,
        avg_price: processedProducts.reduce((sum, product) => sum + parseFloat(product.price), 0) / processedProducts.length,
        campaigns_available: processedProducts.filter(product => product.has_campaign).length
      }
    });
  } catch (error) {
    console.error('Error fetching insights for occasion:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch insights for this occasion',
      error: error.message
    });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'GullyKart Backend API'
  });
});

// Start server
const startServer = async () => {
  await initializeDatabase();
  
  app.listen(PORT, () => {
    console.log(`🚀 GullyKart Backend Server running on port ${PORT}`);
    console.log(`📧 Gmail User: ${process.env.GMAIL_USER}`);
    console.log(`🔗 API URL: http://localhost:${PORT}/api`);
    console.log(`🔐 Auth API: http://localhost:${PORT}/api/auth`);
    console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
  });
};

startServer();

module.exports = app;
