#!/bin/bash

echo "🤝 EduChain Team Setup Script"
echo "============================"

# Check if .env files exist
if [ ! -f "backend/.env" ]; then
    echo "📋 Setting up backend environment..."
    cp backend/.env.example backend/.env
    echo "✅ Created backend/.env - Please edit with your database credentials"
fi

if [ ! -f "educhain-frontend/.env" ]; then
    echo "📋 Setting up frontend environment..."
    cp educhain-frontend/.env.example educhain-frontend/.env
    echo "✅ Created educhain-frontend/.env - Please edit with your API URL"
fi

echo ""
echo "📝 Next Steps:"
echo "1. Edit backend/.env with your MySQL credentials"
echo "2. Edit educhain-frontend/.env with your API URL"
echo "3. Run: cd backend && npm install && npm run migrate"
echo "4. Run: cd educhain-frontend && npm install"
echo "5. Start backend: cd backend && npm run dev"
echo "6. Start frontend: cd educhain-frontend && npm run dev"
echo ""
echo "🔗 API will be available at: http://localhost:3001"
echo "🌐 Frontend will be available at: http://localhost:5173"
echo ""
echo "📚 For detailed setup instructions, see README.md"