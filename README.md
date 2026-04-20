# FD Mitra

FD Mitra is a multi-language, voice-enabled advisory platform that helps users make smarter Fixed Deposit decisions through natural conversations—either by chat or voice, in regional languages.

Working MVP : https://fd-mitra.vercel.app/

# Problem

Fixed Deposits are widely used, but:

Many users don’t fully understand interest rates, returns, or tenure options
Financial platforms are often complex and English-centric
Regional language users face accessibility barriers

# Solution

FD Mitra simplifies FD decision-making using:

 Voice + Chat Interface
 Multi-language support (including 4 regional languages)
 Smart FD guidance based on user input
 Simple, conversational experience instead of complex forms

# Key Features

 Voice-enabled interaction (speak instead of typing)
 Chat-based advisory system
 Regional language support
 Intelligent responses for FD-related queries
 Fast, responsive UI

## Prerequisites
- Node.js 18+
- Python 3.10+

## Backend Setup

1. Navigate to the `backend` directory: `cd backend`
2. Install Python dependencies: `pip install -r requirements.txt`
3. Configure environment variables in `.env`
4. Start the backend server: `uvicorn main:app --reload`

The backend will run on `http://localhost:8000`.

## Frontend Setup

1. Navigate to the `frontend` directory: `cd frontend`
2. Install Node dependencies: `npm install`
3. Start the Vite development server: `npm run dev`

The frontend will run on `http://localhost:5173`. Open this URL in your browser.
