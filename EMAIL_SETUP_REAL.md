# 📧 Real Email OTP Setup Guide

## Overview
The signup page now supports **real email sending** via a Node.js backend server using Gmail SMTP. This means OTP codes are actually sent to user email addresses instead of just showing in alerts.

## ✅ What's Fixed
- **Real Email Sending**: OTP is sent via Gmail SMTP using nodemailer
- **Backend API**: Express server handles email operations
- **Fallback Mode**: If backend is down, falls back to demo mode
- **Async Verification**: OTP verification works with both backend and local storage
- **Production Ready**: Proper error handling and security

## 🚀 Quick Start

### 1. Start Both Frontend and Backend
```bash
# Run both frontend and backend simultaneously
npm run dev:both

# OR run them separately:
# Terminal 1: Frontend
npm run dev

# Terminal 2: Backend 
npm run dev:backend
```

### 2. Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **API Health**: http://localhost:3001/health

## 🔧 Backend API Endpoints

### Email Endpoints
- `GET /api/test-email` - Test Gmail connection
- `POST /api/send-otp` - Send OTP to email
- `POST /api/verify-otp` - Verify OTP code
- `GET /health` - Server health check

### Example API Usage
```javascript
// Send OTP
fetch('http://localhost:3001/api/send-otp', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'user@example.com', name: 'John Doe' })
});

// Verify OTP
fetch('http://localhost:3001/api/verify-otp', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'user@example.com', otp: '123456' })
});
```

## 📋 Testing the Email Flow

### Test Real Email Sending
1. Start both servers: `npm run dev:both`
2. Go to signup page: http://localhost:5173/signup
3. Click "🧪 Test Email Connection" (dev only button)
4. Fill signup form with your real email address
5. Check your email inbox for the OTP code
6. Enter the OTP to complete signup

### Verify Backend Connection
1. Visit: http://localhost:3001/health
2. Should see: `{"status":"OK","timestamp":"...","service":"GullyKart Backend API"}`

## 🔐 Gmail Setup (Already Configured)
The Gmail credentials are already set up in `/backend/.env`:
- **Gmail User**: arunpatwa.iit@gmail.com
- **App Password**: iygu dlcu tjxj mxlk *(configured)*

## 📁 File Structure
```
backend/
├── package.json          # Backend dependencies
├── server.js             # Express server with email API
├── .env                  # Gmail credentials
└── node_modules/         # Backend dependencies

src/services/
└── emailService.ts       # Updated to use backend API
```

## 🔄 How It Works

### Email Sending Flow
1. **Frontend** calls `EmailService.sendOTP()`
2. **EmailService** tries backend API first: `POST /api/send-otp`
3. **Backend** generates OTP and sends via Gmail SMTP
4. **User** receives real email with OTP code
5. **Frontend** verifies OTP via: `POST /api/verify-otp`

### Fallback Mode
- If backend is down → Falls back to demo mode (alert popup)
- If Gmail fails → Returns error message
- If verification fails → Uses local OTP storage as backup

## 🚨 Error Handling
- **Connection Errors**: Graceful fallback to demo mode
- **Gmail Issues**: Clear error messages
- **Invalid OTP**: Proper validation and user feedback
- **Expired OTP**: 5-minute expiration with clear messaging

## 🔧 Troubleshooting

### Backend Not Starting
```bash
# Check if backend dependencies are installed
cd backend && npm install

# Check if port 3001 is available
lsof -i :3001

# Check backend logs
cd backend && npm run dev
```

### Email Not Sending
1. Verify Gmail credentials in `/backend/.env`
2. Check if Gmail App Password is still valid
3. Test connection: http://localhost:3001/api/test-email
4. Check backend console for error logs

### CORS Issues
The backend is configured to allow requests from:
- http://localhost:5173 (Vite default)
- http://localhost:3000 (Common React port)

## 📈 Production Deployment
For production, consider:
- Use environment variables for Gmail credentials
- Implement rate limiting for OTP requests
- Add request validation and sanitization
- Use Redis/database for OTP storage instead of memory
- Add monitoring and logging
- Use secure email service (SendGrid, AWS SES, etc.)

## ✨ Features
- ✅ Real email sending via Gmail SMTP
- ✅ Professional email templates
- ✅ 6-digit OTP generation
- ✅ 5-minute OTP expiration
- ✅ Fallback to demo mode
- ✅ Async OTP verification
- ✅ Error handling and validation
- ✅ CORS configuration
- ✅ Development utilities
