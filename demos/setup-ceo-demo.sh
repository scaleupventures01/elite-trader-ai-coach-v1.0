#!/bin/bash

# CEO Demo Setup Script
# This script sets up the localhost environment for CEO demo

echo "🚀 Setting up CEO Demo Environment"
echo "=================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Set up environment variables
echo "🔧 Setting up environment variables..."
cp .env.example .env

# Start backend server
echo "🔧 Starting backend server..."
npm run dev:backend &
BACKEND_PID=$!

# Wait for backend to start
sleep 5

# Start frontend server
echo "🎨 Starting frontend server..."
npm run dev:frontend &
FRONTEND_PID=$!

# Wait for frontend to start
sleep 5

echo "✅ Demo environment is ready!"
echo ""
echo "🌐 Access Points:"
echo "   Frontend: http://localhost:3000"
echo "   Backend: http://localhost:8000"
echo "   Documentation: http://localhost:3000/docs"
echo ""
echo "📋 Demo Scenarios:"
echo "   1. User Registration & Login"
echo "   2. User Profile Management"
echo "   3. Project Architecture Overview"
echo "   4. Sprint Progress & Roadmap"
echo "   5. Q&A and Feedback"
echo ""
echo "🛑 To stop the demo environment:"
echo "   kill $BACKEND_PID $FRONTEND_PID"
echo ""
echo "🎯 CEO Demo is ready for presentation!"
