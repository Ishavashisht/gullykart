# Email OTP Setup Guide

This guide explains how to set up the email OTP functionality using a master Gmail account.

## Prerequisites

1. A Gmail account dedicated for sending OTP emails
2. Google Cloud Console project (for Google OAuth)
3. Node.js backend service (for production)

## Frontend Setup (Current Implementation)

The current implementation simulates the email OTP functionality for demonstration purposes. The actual OTP is displayed in the console and via an alert dialog.

### Features:
- ✅ OTP generation (6-digit codes)
- ✅ OTP validation with expiration (5 minutes)
- ✅ Beautiful email templates
- ✅ Google OAuth simulation
- ✅ Resend OTP functionality

## Production Setup

### 1. Gmail Configuration

1. **Enable 2-Factor Authentication**
   - Go to [Google Account Security](https://myaccount.google.com/security)
   - Enable 2-Step Verification

2. **Generate App Password**
   - Go to [App Passwords](https://myaccount.google.com/apppasswords)
   - Select "Mail" and "Other (custom name)"
   - Copy the 16-character password

3. **Update Environment Variables**
   ```bash
   # Copy the example file
   cp .env.example .env
   
   # Edit the .env file with your credentials
   VITE_GMAIL_USER=your-master-gmail@gmail.com
   VITE_GMAIL_APP_PASSWORD=your-16-character-app-password
   ```

### 2. Backend Service Setup

Create a Node.js backend service with the following dependencies:

```bash
npm install express nodemailer cors dotenv
```

**Example Backend Implementation:**

```javascript
// backend/server.js
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Gmail transporter
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// OTP storage (use Redis in production)
const otpStore = new Map();

// Generate OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send OTP endpoint
app.post('/api/send-otp', async (req, res) => {
  const { email, name } = req.body;
  
  try {
    const otp = generateOTP();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes
    
    // Store OTP
    otpStore.set(email, { otp, expiresAt });
    
    // Email options
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: 'Your GullyKart Verification Code',
      html: generateEmailTemplate(otp, name),
    };
    
    // Send email
    await transporter.sendMail(mailOptions);
    
    res.json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ success: false, message: 'Failed to send OTP' });
  }
});

// Verify OTP endpoint
app.post('/api/verify-otp', (req, res) => {
  const { email, otp } = req.body;
  
  const stored = otpStore.get(email);
  if (!stored) {
    return res.json({ success: false, message: 'OTP not found' });
  }
  
  if (Date.now() > stored.expiresAt) {
    otpStore.delete(email);
    return res.json({ success: false, message: 'OTP expired' });
  }
  
  if (stored.otp === otp) {
    otpStore.delete(email);
    return res.json({ success: true, message: 'OTP verified successfully' });
  }
  
  res.json({ success: false, message: 'Invalid OTP' });
});

function generateEmailTemplate(otp, name) {
  return \`
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Welcome to GullyKart Vision!</h2>
      <p>Hello \${name || 'there'},</p>
      <p>Your verification code is:</p>
      <div style="font-size: 32px; font-weight: bold; text-align: center; padding: 20px; background: #f5f5f5; border-radius: 8px; margin: 20px 0;">
        \${otp}
      </div>
      <p>This code will expire in 5 minutes.</p>
      <p>If you didn't request this code, please ignore this email.</p>
    </div>
  \`;
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});
```

### 3. Frontend Integration

Update the EmailService to use the backend API:

```typescript
// src/services/emailService.ts
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export class EmailService {
  static async sendOTP(to: string, name?: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await axios.post(\`\${API_BASE_URL}/send-otp\`, {
        email: to,
        name,
      });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: 'Failed to send OTP. Please try again.',
      };
    }
  }

  static async verifyOTP(email: string, otp: string): Promise<boolean> {
    try {
      const response = await axios.post(\`\${API_BASE_URL}/verify-otp\`, {
        email,
        otp,
      });
      return response.data.success;
    } catch (error) {
      return false;
    }
  }
}
```

### 4. Google OAuth Setup

1. **Create Google Cloud Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one

2. **Enable Gmail API**
   - Go to APIs & Services > Library
   - Search for "Gmail API" and enable it

3. **Create OAuth 2.0 Credentials**
   - Go to APIs & Services > Credentials
   - Create OAuth 2.0 Client ID
   - Add your domain to authorized origins

4. **Update Environment Variables**
   ```bash
   VITE_GOOGLE_CLIENT_ID=your-google-client-id
   ```

## Security Considerations

1. **Rate Limiting**: Implement rate limiting for OTP requests
2. **Email Validation**: Validate email addresses before sending OTPs
3. **OTP Expiration**: Always set expiration times for OTPs
4. **Secure Storage**: Use Redis or encrypted database for OTP storage
5. **Environment Variables**: Never commit sensitive credentials to version control

## Testing

1. **Development Mode**: Currently shows OTP in console/alert
2. **Production Mode**: Sends actual emails via Gmail
3. **Email Templates**: Test with various email clients

## Troubleshooting

### Common Issues:

1. **"Less secure app access" error**
   - Use App Passwords instead of regular password
   - Enable 2-Factor Authentication first

2. **SMTP connection errors**
   - Check firewall settings
   - Verify Gmail credentials
   - Ensure App Password is correctly formatted

3. **OTP not received**
   - Check spam folder
   - Verify email address format
   - Check Gmail API quotas

### Support

For additional help:
- Check Gmail API documentation
- Review Nodemailer documentation
- Verify Google Cloud Console settings

## Current Demo Status

✅ **Working**: Frontend OTP flow with simulation
⏳ **Pending**: Backend integration for actual email sending
⏳ **Pending**: Google OAuth integration
⏳ **Pending**: Production deployment
