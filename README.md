# GullyKart Vision

## 🔍 Project Info

**Live URL**: http://localhost:8080/ (Frontend), http://localhost:3001/ (Email API), http://localhost:8001/ (AI API)

GullyKart Vision is a web-based platform designed to forecast hyperlocal fashion trends and assist sellers in creating AI-powered marketing campaigns — personalized for their audience.

## 💻 Tech Stack

This project is built using:

- **React**
- **TypeScript**
- **Vite**
- **Tailwind CSS**
- **shadcn/ui** component library
- **Node.js + Express** (Email service)
- **FastAPI + Python** (AI service)
- **Gmail SMTP** (Email delivery)

## 🚀 Getting Started (Local Development)

GullyKart Vision runs on multiple servers for different services. Follow these steps to set up the complete development environment:

### Prerequisites:
- [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed (preferably via [nvm](https://github.com/nvm-sh/nvm))
- [Python 3.8+](https://www.python.org/downloads/) installed
- Git installed
- **Gmail account** with 2FA enabled for email service

### Quick Setup (Recommended):
```bash
# Step 1: Clone the repository
git clone https://github.com/Ishavashisht/gullykart.git

# Step 2: Navigate into the project directory
cd gullykart

# Step 3: Install frontend dependencies
npm install

# Step 4: Install backend dependencies
cd backend && npm install && cd ..

# Step 5: Set up environment variables (see Environment Configuration below)

# Step 6: Start all services with one command
npm run dev:both
```

**That's it!** All services will start automatically:
- **Frontend**: http://localhost:8080/
- **Email Backend**: http://localhost:3001/
- **Real OTP emails** will be sent to users during signup

### Manual Setup (Alternative):

If you prefer to start services separately:

### Frontend Setup (React + Vite):
```bash
# Install frontend dependencies
npm install

# Start the frontend development server
npm run dev
# Frontend will be available at: http://localhost:8080/
```

### Backend Setup - Email Service (Node.js + Express):
```bash
# Navigate to backend directory
cd backend

# Install Node.js backend dependencies
npm install

# Set up environment variables (see below)
# Create backend/.env with Gmail credentials

# Start the email service backend
npm start
# Email service will be available at: http://localhost:3001/
# API endpoints: http://localhost:3001/api
# Health check: http://localhost:3001/health
```

### Backend Setup - AI Service (FastAPI + Python):
```bash
# Navigate to backend directory
cd backend

# Create Python virtual environment (if not exists)
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt

# Start the FastAPI server
uvicorn main:app --host 0.0.0.0 --port 8001 --reload
# AI service will be available at: http://localhost:8001/
# API documentation: http://localhost:8001/docs
```

### Quick Start - All Servers:
```bash
# Option 1: Start all servers with one command (RECOMMENDED)
npm run dev:both

# Option 2: Start servers individually in separate terminals
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Email Backend
cd backend && npm start

# Terminal 3 - AI Backend (Optional)
cd backend && source venv/bin/activate && uvicorn main:app --host 0.0.0.0 --port 8001 --reload
```

### Development Commands:
- `npm run dev:both` - Start frontend + email backend (recommended)
- `npm run dev:ordered` - Start backend first, then frontend with delay
- `npm run dev` - Start only frontend
- `npm run dev:backend` - Start only email backend

### Server URLs:
- **Frontend (React)**: http://localhost:8080/
- **Email Backend (Node.js)**: http://localhost:3001/
- **AI Backend (FastAPI)**: http://localhost:8001/
  - API Documentation: http://localhost:8001/docs


## 🔧 Environment Configuration

### Required Environment Variables:

You need to create environment files for both frontend and backend:

#### Step 1: Root `.env` file:
Create a `.env` file in the root directory (copy from `.env.example`):
```bash
# Copy the example file and edit it
cp .env.example .env
```

Then edit `.env`:
```env
# Frontend configuration
VITE_API_URL=http://localhost:3001/api
VITE_AI_API_URL=http://localhost:8001
```

#### Step 2: Backend `.env` file:
Create a `backend/.env` file (copy from `backend/.env.example`):
```bash
# Copy the example file and edit it
cp backend/.env.example backend/.env
```

Then edit `backend/.env`:
```env
# Email Service Configuration
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-gmail-app-password
PORT=3001
NODE_ENV=development

# AI Service Configuration (Optional)
GOOGLE_API_KEY=your-google-gemini-api-key
STABILITY_API_KEY=your-stability-ai-api-key

# CORS Configuration
FRONTEND_URL=http://localhost:8080
```

### Gmail Setup for OTP Emails:

**⚠️ Important**: You need a Gmail account to send OTP emails.

1. **Enable 2-Factor Authentication**:
   - Go to [Google Account Settings](https://myaccount.google.com/security)
   - Enable 2-Factor Authentication

2. **Generate App Password**:
   - Go to [Google App Passwords](https://myaccount.google.com/apppasswords)
   - Generate a new app password for "Mail"
   - Copy the 16-character password

3. **Update Backend .env**:
   ```env
   GMAIL_USER=your-email@gmail.com
   GMAIL_APP_PASSWORD=your-16-char-app-password
   ```

### Optional API Keys:
1. **Google Gemini AI**: Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. **Stability AI**: Get your API key from [Stability AI](https://platform.stability.ai/account/keys)

## 🏗️ Project Architecture

This is a full-stack application with three main components:

### Frontend (Port 8080)
- **Framework**: React + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Features**: User authentication, trend visualization, campaign generation UI
- **OTP Integration**: Real-time email verification during signup

### Email Backend (Port 3001)
- **Framework**: Node.js + Express
- **Features**: OTP generation and email sending, user authentication
- **Dependencies**: nodemailer, cors, dotenv, body-parser
- **Email Service**: Gmail SMTP integration for real email delivery
- **Security**: 6-digit OTP with 5-minute expiration

### AI Backend (Port 8001) - Optional
- **Framework**: FastAPI + Python
- **Features**: AI-powered campaign generation, image analysis, trend forecasting
- **AI Services**: Google Gemini AI, Stability AI for image generation

## ✨ Key Features

### 🔐 Email Authentication
- **Real OTP Emails**: No demo mode - actual emails sent via Gmail
- **Professional Templates**: Beautiful HTML email templates
- **Security**: 5-minute OTP expiration, secure verification
- **User Experience**: Smooth signup flow with email verification

### 🎨 Modern UI
- **shadcn/ui Components**: Professional, accessible UI components
- **Responsive Design**: Works on desktop and mobile
- **TypeScript**: Full type safety throughout the application

### 📧 Email System Features
- Real Gmail SMTP integration
- Professional email templates with branding
- OTP generation and verification
- Secure email delivery
- Error handling and fallbacks
## 🧪 Testing the Setup

### 1. Verify Services are Running:
```bash
# Check if all services are running
curl http://localhost:8080          # Frontend should respond
curl http://localhost:3001/health   # Backend health check
```

### 2. Test Email Service:
```bash
# Test email connection
curl http://localhost:3001/api/test-email

# Test OTP sending (replace with your email)
curl -X POST http://localhost:3001/api/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"your-email@gmail.com","name":"Test User"}'
```

### 3. Test Full Signup Flow:
1. Go to: http://localhost:8080
2. Click "Sign Up"
3. Enter your email and details
4. Submit the form
5. Check your email for the OTP
6. Enter the OTP to complete signup

### 4. Verify Git Configuration:
The project includes proper `.gitignore` files that exclude:
- Python virtual environments (`venv/`)
- Python cache files (`__pycache__/`)
- Environment files (`.env`)
- Node.js dependencies (`node_modules/`)
- Build artifacts and temporary files

## � Troubleshooting

### Common Issues:

#### "Unable to connect to email service"
- Ensure backend is running on port 3001
- Check if `VITE_API_URL` is set correctly in root `.env`
- Restart frontend: `npm run dev`

#### "Port already in use"
```bash
# Kill processes using the ports
lsof -ti:3001 | xargs kill -9
lsof -ti:8080 | xargs kill -9

# Then restart
npm run dev:both
```

#### Gmail authentication errors
- Verify 2FA is enabled on your Gmail account
- Check that you're using an App Password, not your regular password
- Ensure `GMAIL_USER` and `GMAIL_APP_PASSWORD` are correct in `backend/.env`

#### OTP not received
- Check spam/junk folder
- Verify email address is typed correctly
- Check backend logs for error messages
- Test email connection: `curl http://localhost:3001/api/test-email`

#### Python virtual environment issues
```bash
# If you get permission errors or venv doesn't work:
# On Ubuntu/Debian:
sudo apt update && sudo apt install python3-venv python3-pip

# On macOS:
brew install python

# On Windows:
# Install Python from python.org with "Add to PATH" checked

# Create virtual environment
cd backend
python3 -m venv venv

# Activate it
source venv/bin/activate  # Linux/Mac
# OR
venv\Scripts\activate     # Windows

# Install dependencies
pip install -r requirements.txt
```

#### Missing dependencies
```bash
# If npm install fails:
rm -rf node_modules package-lock.json
npm install

# If Python packages fail:
cd backend
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
```

### Debug Commands:
```bash
# View backend logs
cd backend && npm start

# Check backend health
curl http://localhost:3001/health

# Test email connectivity
curl http://localhost:3001/api/test-email

# View all running processes
ps aux | grep node
```

## ✅ Quick Verification Checklist

After following the setup instructions, verify everything is working:

### ✓ Environment Files:
- [ ] Root `.env` file exists with `VITE_API_URL=http://localhost:3001/api`
- [ ] `backend/.env` file exists with Gmail credentials
- [ ] All environment variables are set (no empty values)

### ✓ Dependencies:
- [ ] Frontend: `npm install` completed successfully
- [ ] Backend: `cd backend && npm install` completed successfully  
- [ ] Python: Virtual environment created and packages installed

### ✓ Services Running:
- [ ] Frontend accessible at http://localhost:8080
- [ ] Backend health check: http://localhost:3001/health returns OK
- [ ] Email test: http://localhost:3001/api/test-email returns success

### ✓ Gmail Configuration:
- [ ] Gmail 2FA is enabled
- [ ] App Password generated (16 characters)
- [ ] `GMAIL_USER` and `GMAIL_APP_PASSWORD` set in `backend/.env`

### ✓ OTP Email Flow:
- [ ] Sign up form submits successfully
- [ ] OTP email received in inbox (check spam folder)
- [ ] OTP verification works correctly

If any item fails, refer to the troubleshooting section above.

## 🚀 Deployment

### Development
All servers support hot-reload for development:
- Frontend: Vite HMR (Hot Module Replacement)
- Email Backend: nodemon auto-restart
- AI Backend: uvicorn auto-reload

### Production Deployment Options:

#### Frontend:
- **Vercel**: `npm run build` + deploy to Vercel
- **Netlify**: `npm run build` + deploy to Netlify  
- **GitHub Pages**: Static deployment

#### Backend Services:
- **Railway/Render**: Deploy FastAPI and Node.js services
- **Docker**: Containerized deployment (Docker configuration coming soon)
- **VPS/Cloud**: Manual deployment on cloud providers

### Environment Variables for Production:
Update the URLs in production `.env` files:
```env
# Production Frontend .env
VITE_API_URL=https://your-backend-domain.com/api
VITE_AI_API_URL=https://your-ai-backend-domain.com

# Production Backend .env
FRONTEND_URL=https://your-frontend-domain.com
PORT=3001
NODE_ENV=production
```

## 📡 API Endpoints

### Email Service (Node.js - Port 3001):
- `GET /health` - Health check
- `GET /api/test-email` - Test email connection
- `POST /api/send-otp` - Send OTP to email
  ```json
  {
    "email": "user@example.com",
    "name": "User Name"
  }
  ```
- `POST /api/verify-otp` - Verify OTP code
  ```json
  {
    "email": "user@example.com", 
    "otp": "123456"
  }
  ```

### AI Service (FastAPI - Port 8001):
- `POST /generate-kit` - Generate marketing campaign
- `POST /auth/*` - Authentication routes
- `GET /docs` - Interactive API documentation

## 🛠️ Technologies Used

### Frontend:
- **React 18** - UI framework with hooks
- **TypeScript** - Type safety and better development experience
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern, accessible component library
- **React Router** - Client-side routing
- **Sonner** - Toast notifications

### Backend:
- **Node.js + Express** - Email service API
- **FastAPI + Python** - AI service API
- **Gmail SMTP** - Real email delivery service
- **nodemailer** - Email sending functionality
- **dotenv** - Environment variable management
- **cors** - Cross-origin resource sharing
- **body-parser** - Request body parsing

### AI Services:
- **Google Gemini AI** - Text generation and image analysis
- **Stability AI** - Image generation

### Development Tools:
- **concurrently** - Run multiple commands simultaneously
- **nodemon** - Auto-restart backend on changes
- **ESLint** - Code linting
- **TypeScript** - Static type checking

## 📦 Project Structure

```
gullykart/
├── src/                          # Frontend source code
│   ├── components/              # React components
│   │   ├── ui/                 # shadcn/ui components
│   │   └── ...                 # Custom components
│   ├── pages/                  # Page components
│   ├── services/               # API services
│   │   └── emailService.ts     # Email/OTP service
│   ├── hooks/                  # Custom React hooks
│   └── lib/                    # Utility functions
├── backend/                     # Backend services
│   ├── server.js               # Email service (Node.js)
│   ├── main.py                 # AI service entry point (FastAPI)
│   ├── auth/                   # Authentication modules
│   ├── requirements.txt        # Python dependencies
│   ├── package.json           # Node.js dependencies
│   ├── venv/                  # Python virtual environment
│   └── .env                   # Backend environment variables
├── ai_engine/                  # Additional AI modules
│   ├── insights_engine.py     # AI trend insights
│   ├── magic.py               # AI utilities
│   ├── trend_researcher.py    # Trend analysis
│   └── requirements.txt       # Python dependencies
├── public/                     # Static assets
├── .env                       # Frontend environment variables
├── package.json              # Frontend dependencies
└── README.md                 # This file
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Test the email functionality
5. Commit changes: `git commit -am 'Add feature'`
6. Push to branch: `git push origin feature-name`
7. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔗 Links

- **Frontend**: http://localhost:8080/
- **Email API**: http://localhost:3001/
- **AI API**: http://localhost:8001/
- **Email API Docs**: http://localhost:3001/health
- **AI API Docs**: http://localhost:8001/docs

---

**✨ Ready to build the future of e-commerce!** 🚀


