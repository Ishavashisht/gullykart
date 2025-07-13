const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:8080', 'http://localhost:3001'], // All possible frontend ports
  credentials: true
}));
app.use(bodyParser.json());

// OTP storage (in production, use Redis or database)
const otpStore = new Map();

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

// Store OTP with 5-minute expiration
const storeOTP = (email, otp) => {
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes
  otpStore.set(email, { otp, expiresAt });
  console.log(`OTP stored for ${email}: ${otp} (expires at ${new Date(expiresAt)})`);
};

// Verify OTP
const verifyOTP = (email, inputOTP) => {
  const stored = otpStore.get(email);
  if (!stored) {
    console.log(`No OTP found for ${email}`);
    return false;
  }

  if (Date.now() > stored.expiresAt) {
    console.log(`OTP expired for ${email}`);
    otpStore.delete(email);
    return false;
  }

  if (stored.otp === inputOTP) {
    console.log(`OTP verified successfully for ${email}`);
    otpStore.delete(email);
    return true;
  }

  console.log(`Invalid OTP for ${email}. Expected: ${stored.otp}, Got: ${inputOTP}`);
  return false;
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

// Send OTP endpoint
app.post('/api/send-otp', async (req, res) => {
  try {
    const { email, name } = req.body;

    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email is required' 
      });
    }

    // Generate and store OTP
    const otp = generateOTP();
    storeOTP(email, otp);

    // Create transporter
    const transporter = createTransporter();

    // Email options
    const mailOptions = {
      from: {
        name: 'GullyKart Team',
        address: process.env.GMAIL_USER
      },
      to: email,
      subject: 'GullyKart - Your Verification Code',
      html: generateOTPEmailTemplate(otp, name)
    };

    // Send email
    console.log(`Sending OTP email to ${email}...`);
    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);

    res.json({
      success: true,
      message: `OTP sent successfully to ${email}`,
      messageId: result.messageId
    });

  } catch (error) {
    console.error('Failed to send OTP:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send OTP. Please try again.',
      error: error.message
    });
  }
});

// Verify OTP endpoint
app.post('/api/verify-otp', (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP are required'
      });
    }

    const isValid = verifyOTP(email, otp);

    if (isValid) {
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

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'GullyKart Backend API'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 GullyKart Backend Server running on port ${PORT}`);
  console.log(`📧 Gmail User: ${process.env.GMAIL_USER}`);
  console.log(`🔗 API URL: http://localhost:${PORT}/api`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
});

module.exports = app;
