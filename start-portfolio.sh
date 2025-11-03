#!/bin/bash

# Cybersecurity Portfolio Launch Script
echo "🔥 Starting Cybersecurity Portfolio System..."
echo ""

# Check if Node.js is available
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js first."
    exit 1
fi

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo "❌ npm not found. Please install npm first."
    exit 1
fi

# Create uploads directory if it doesn't exist
if [ ! -d "public/uploads" ]; then
    echo "📁 Creating uploads directory..."
    mkdir -p public/uploads
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

echo "🌟 System Information:"
echo "- Portfolio URL: http://localhost:3089"
echo "- Admin Username: rafael-root"
echo "- Admin Password: 123456"
echo ""

echo "🚀 Features Ready:"
echo "- Cybersecurity-focused home page ✅"
echo "- CTF & Flipper Zero categories ✅" 
echo "- Rich text editor with image uploads ✅"
echo "- Authentication-protected blog management ✅"
echo "- Multi-image upload system ✅"
echo ""

echo "🎯 Starting development server..."
echo "Press Ctrl+C to stop the server"
echo ""

# Start the development server
npm run dev
