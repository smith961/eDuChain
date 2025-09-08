# EduChain - Decentralized Learning Platform

A comprehensive blockchain-based education platform built with React, Express.js, MySQL, and Sui blockchain.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- MySQL (v8.0+)
- Git

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd educhain
```

### 2. Run Setup Script
```bash
# For first-time setup (includes dependencies)
chmod +x setup.sh
./setup.sh

# For team members (after cloning)
chmod +x scripts/setup-team.sh
./scripts/setup-team.sh
```

### 3. Configure Environment
```bash
# Backend configuration
cp backend/.env.example backend/.env
# Edit backend/.env with your settings

# Frontend configuration
cp educhain-frontend/.env.example educhain-frontend/.env
# Edit educhain-frontend/.env with your settings
```

### 4. Start Development Servers
```bash
# Terminal 1: Backend
cd backend
npm run migrate  # Setup database
npm run dev

# Terminal 2: Frontend
cd educhain-frontend
npm run dev
```

### 5. Verify Setup
```bash
# Check if everything is working
./scripts/health-check.sh
```

## 🏗️ Project Structure

```
educhain/
├── backend/                 # Express.js API server
│   ├── src/
│   │   ├── controllers/     # Route handlers
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Custom middleware
│   │   └── utils/          # Helper functions
│   ├── scripts/            # Database migrations
│   └── .env.example        # Environment template
├── educhain-frontend/      # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── contexts/       # React contexts
│   │   ├── services/       # API services
│   │   └── utils/          # Helper functions
│   └── .env.example        # Environment template
├── sources/                # Sui Move contracts
├── tests/                  # Contract tests
└── setup.sh               # Setup automation
```

## 🔧 Environment Setup

### Backend (.env)
```env
# Server
PORT=3001
NODE_ENV=development

# Database
DB_HOST=localhost
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=educhain_db

# JWT
JWT_SECRET=your_super_secret_key
JWT_EXPIRE=7d

# Blockchain
SUI_RPC_URL=https://fullnode.testnet.sui.io:443
PACKAGE_ID=your_package_id
ADMIN_CAP_ID=your_admin_cap_id
REGISTRY_ID=your_registry_id
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3001/api
VITE_SUI_RPC_URL=https://fullnode.testnet.sui.io:443
VITE_PACKAGE_ID=your_package_id
VITE_ADMIN_CAP_ID=your_admin_cap_id
VITE_EDUCHAINRegistry=your_registry_id
```

## 🛠️ Development Tools

### Health Check
```bash
# Verify all services are running
./scripts/health-check.sh
```

### Team Setup
```bash
# For new team members
./scripts/setup-team.sh
```

## 🤝 Team Collaboration Guide

### Git Workflow

#### 1. Branch Strategy
```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Create bug fix branch
git checkout -b bugfix/issue-description

# Create hotfix branch
git checkout -b hotfix/critical-fix
```

#### 2. Commit Convention
```bash
# Feature commits
git commit -m "feat: add user authentication"

# Bug fixes
git commit -m "fix: resolve wallet connection issue"

# Documentation
git commit -m "docs: update API documentation"

# Refactoring
git commit -m "refactor: optimize database queries"
```

#### 3. Pull Request Process
1. **Create PR** from your feature branch to `main`
2. **Add description** with:
   - What was changed
   - Why it was changed
   - How to test
3. **Request review** from team members
4. **Address feedback** and make necessary changes
5. **Merge** after approval

### Environment Setup for Team Members

#### New Team Member Setup
```bash
# 1. Clone repository
git clone <repo-url>
cd educhain

# 2. Run setup script
./setup.sh

# 3. Configure environment
cp backend/.env.example backend/.env
cp educhain-frontend/.env.example educhain-frontend/.env

# 4. Edit .env files with personal credentials
# - Database credentials
# - JWT secret
# - API keys (if any)

# 5. Install dependencies
cd backend && npm install
cd ../educhain-frontend && npm install

# 6. Setup database
cd ../backend
npm run migrate

# 7. Start development
npm run dev &
cd ../educhain-frontend && npm run dev
```

### Database Setup
```bash
# Create MySQL database
mysql -u root -p
CREATE DATABASE educhain_db;
EXIT;

# Run migrations
cd backend
npm run migrate
```

## 🔒 Security & Best Practices

### Environment Variables
- ✅ **Never commit** `.env` files to Git
- ✅ **Use strong secrets** for JWT and database passwords
- ✅ **Document required** environment variables
- ✅ **Provide examples** in `.env.example` files

### API Testing
```bash
# Backend must be running for API testing
cd backend && npm run dev

# Test endpoints
curl http://localhost:3001/health
curl http://localhost:3001/api/courses/published
```

### Database Management
```bash
# Run migrations
npm run migrate

# Reset database (development only)
mysql -u root -p educhain_db < reset.sql
```

## 🚀 Deployment

### Development
```bash
# Backend
cd backend && npm run dev

# Frontend
cd educhain-frontend && npm run dev
```

### Production
```bash
# Backend
cd backend && npm start

# Frontend (after build)
cd educhain-frontend
npm run build
npm run preview
```

## 📚 API Documentation

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile

### Courses
- `GET /api/courses/published` - Get published courses
- `GET /api/courses/:id` - Get course details

### Development
- `GET /health` - Health check

## 🐛 Troubleshooting

### Common Issues

#### Backend Won't Start
```bash
# Check if port is available
lsof -i :3001

# Check database connection
cd backend && npm run migrate
```

#### Frontend API Errors
```bash
# Ensure backend is running
curl http://localhost:3001/health

# Check API URL in frontend .env
cat educhain-frontend/.env
```

#### Database Connection Issues
```bash
# Test MySQL connection
mysql -u your_user -p -h localhost educhain_db

# Reset database
cd backend && npm run migrate
```

## 📞 Support

- **Issues**: Create GitHub issues for bugs/features
- **Discussions**: Use GitHub discussions for questions
- **Documentation**: Update this README for improvements

## 📋 Development Checklist

### Before Pushing Code
- [ ] Run tests: `npm test`
- [ ] Lint code: `npm run lint`
- [ ] Update documentation
- [ ] Test API endpoints
- [ ] Check environment variables

### Before Merging to Main
- [ ] Code review completed
- [ ] All tests passing
- [ ] Documentation updated
- [ ] Environment variables documented
- [ ] Migration scripts tested

---

**Happy coding! 🎓🚀**

For detailed API documentation, see `backend/README.md` and `educhain-frontend/README.md`.
