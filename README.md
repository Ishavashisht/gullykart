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

## 🚀 Getting Started (Local Development)

GullyKart Vision runs on multiple servers for different services. Follow these steps to set up the complete development environment:

### Prerequisites:
- [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed (preferably via [nvm](https://github.com/nvm-sh/nvm))
- [Python 3.8+](https://www.python.org/downloads/) installed
- Git installed

### Environment Setup:
```bash
# Step 1: Clone the repository
git clone https://github.com/Ishavashisht/gullykart.git

# Step 2: Navigate into the project directory
cd gullykart

# Step 3: Set up environment variables
cp .env.example .env
# Edit .env file with your API keys and configuration
```

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

# Start the email service backend
npm run dev
# Email service will be available at: http://localhost:3001/
# API endpoints: http://localhost:3001/api
# Health check: http://localhost:3001/health
```

### Backend Setup - AI Service (FastAPI + Python):
```bash
# Navigate to backend directory (if not already there)
cd backend

# Create Python virtual environment
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
# Option 1: Start all servers with one command (requires concurrently)
npm install concurrently --save-dev
npm run dev:both

# Option 2: Start servers individually in separate terminals
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Email Backend
cd backend && npm run dev

# Terminal 3 - AI Backend
cd backend && source venv/bin/activate && uvicorn main:app --host 0.0.0.0 --port 8001 --reload
```

### Server URLs:
- **Frontend (React)**: http://localhost:8080/
- **Email Backend (Node.js)**: http://localhost:3001/
- **AI Backend (FastAPI)**: http://localhost:8001/
  - API Documentation: http://localhost:8001/docs


## 🔧 Environment Configuration

### Required Environment Variables:
Create a `.env` file in the root directory and another in the `backend/` directory with the following variables:

#### Root `.env` file:
```env
# Frontend configuration
VITE_API_URL=http://localhost:3001/api
VITE_AI_API_URL=http://localhost:8001
```

#### Backend `.env` file (`backend/.env`):
```env
# Email Service Configuration
GMAIL_USER=your-email@gmail.com
GMAIL_PASS=your-app-password
EMAIL_PORT=3001

# AI Service Configuration  
GOOGLE_API_KEY=your-google-gemini-api-key
STABILITY_API_KEY=your-stability-ai-api-key

# CORS Configuration
FRONTEND_URL=http://localhost:8080
```

### API Keys Setup:
1. **Google Gemini API**: Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. **Stability AI API**: Get your API key from [Stability AI](https://platform.stability.ai/account/keys)
3. **Gmail App Password**: Enable 2FA and generate an app password from [Google Account Settings](https://myaccount.google.com/security)

## 🏗️ Project Architecture

This is a full-stack application with three main components:

### Frontend (Port 8080)
- **Framework**: React + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Features**: User authentication, trend visualization, campaign generation UI

### Email Backend (Port 3001)
- **Framework**: Node.js + Express
- **Features**: OTP generation and email sending, user authentication
- **Dependencies**: nodemailer, cors, dotenv

### AI Backend (Port 8001)
- **Framework**: FastAPI + Python
- **Features**: AI-powered campaign generation, image analysis, trend forecasting
- **AI Services**: Google Gemini AI, Stability AI for image generation
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

## 📡 API Endpoints

### Email Service (Node.js - Port 3001):
- `POST /api/send-otp` - Send OTP to email
- `POST /api/verify-otp` - Verify OTP code
- `GET /health` - Health check

### AI Service (FastAPI - Port 8001):
- `POST /generate-kit` - Generate marketing campaign
- `POST /auth/*` - Authentication routes
- `GET /docs` - Interactive API documentation

## 🛠️ Technologies Used

### Frontend:
- **React** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern component library

### Backend:
- **Node.js + Express** - Email service API
- **FastAPI + Python** - AI service API
- **Google Gemini AI** - Text generation and image analysis
- **Stability AI** - Image generation
- **nodemailer** - Email sending functionality


