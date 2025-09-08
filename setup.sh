#!/bin/bash

echo "🚀 Setting up EduChain Platform"
echo "================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if MySQL is installed
if ! command -v mysql &> /dev/null; then
    echo "⚠️  MySQL is not installed. Please install MySQL and create a database."
    echo "   You can install MySQL from: https://dev.mysql.com/downloads/mysql/"
    echo "   After installation, create a database: CREATE DATABASE educhain_db;"
fi

echo "📦 Installing backend dependencies..."
cd backend
npm install

echo "📦 Installing frontend dependencies..."
cd ../educhain-frontend
npm install

cd ..

echo "📝 Setting up environment files..."
if [ ! -f "backend/.env" ]; then
    cp backend/.env.example backend/.env
    echo "✅ Created backend/.env - Please edit with your configuration"
fi

if [ ! -f "educhain-frontend/.env" ]; then
    cp educhain-frontend/.env.example educhain-frontend/.env
    echo "✅ Created educhain-frontend/.env - Please edit with your configuration"
fi

echo ""
echo "🎯 Setup Complete!"
echo "=================="
echo ""
echo "Next steps:"
echo "1. Edit backend/.env with your MySQL credentials"
echo "2. Edit educhain-frontend/.env with your API URL"
echo "3. Create MySQL database: CREATE DATABASE educhain_db;"
echo "4. Run database migrations: cd backend && npm run migrate"
echo "5. Start the backend: cd backend && npm run dev"
echo "6. Start the frontend: cd educhain-frontend && npm run dev"
echo ""
echo "Happy coding! 🎓🚀"