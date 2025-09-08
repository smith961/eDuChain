#!/bin/bash

echo "🏥 EduChain Health Check"
echo "========================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check service
check_service() {
    local url=$1
    local service_name=$2

    if curl -s --max-time 5 "$url" > /dev/null; then
        echo -e "${GREEN}✅ $service_name is running${NC}"
        return 0
    else
        echo -e "${RED}❌ $service_name is not responding${NC}"
        return 1
    fi
}

# Check if services are running
backend_status=1
frontend_status=1

echo "🔍 Checking services..."

# Check backend
if check_service "http://localhost:3001/health" "Backend API"; then
    backend_status=0

    # Test API endpoints
    echo "🔍 Testing API endpoints..."
    if curl -s "http://localhost:3001/api/courses/published" > /dev/null; then
        echo -e "${GREEN}✅ Courses API is working${NC}"
    else
        echo -e "${YELLOW}⚠️  Courses API not responding (backend may need data)${NC}"
    fi
fi

# Check frontend
if check_service "http://localhost:5173" "Frontend"; then
    frontend_status=0
fi

echo ""
echo "📊 Status Summary:"
echo "=================="

if [ $backend_status -eq 0 ] && [ $frontend_status -eq 0 ]; then
    echo -e "${GREEN}🎉 All services are running! EduChain is ready.${NC}"
    echo ""
    echo "🌐 Access your application:"
    echo "   Frontend: http://localhost:5173"
    echo "   Backend:  http://localhost:3001"
    echo "   API Docs: http://localhost:3001/api"
elif [ $backend_status -eq 0 ]; then
    echo -e "${YELLOW}⚠️  Backend is running, but frontend is not${NC}"
    echo "   Start frontend: cd educhain-frontend && npm run dev"
elif [ $frontend_status -eq 0 ]; then
    echo -e "${YELLOW}⚠️  Frontend is running, but backend is not${NC}"
    echo "   Start backend: cd backend && npm run dev"
else
    echo -e "${RED}❌ Neither service is running${NC}"
    echo ""
    echo "🚀 Quick start:"
    echo "   1. Start backend: cd backend && npm run dev"
    echo "   2. Start frontend: cd educhain-frontend && npm run dev"
fi

echo ""
echo "🔧 Troubleshooting:"
echo "==================="
echo "• Check backend logs: cd backend && npm run dev"
echo "• Check frontend logs: cd educhain-frontend && npm run dev"
echo "• Verify .env files are configured correctly"
echo "• Ensure MySQL is running and database is created"
echo "• Check if ports 3001 and 5173 are available"