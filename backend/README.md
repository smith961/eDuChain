# EduChain Backend API

A comprehensive backend API for the EduChain learning platform built with Express.js and MySQL.

## 🚀 Features

- **User Authentication**: JWT-based authentication with wallet integration
- **Course Management**: CRUD operations for courses and lessons
- **Enrollment System**: Track user enrollments and progress
- **Progress Tracking**: Detailed learning progress analytics
- **Quiz System**: Question management and quiz submissions
- **Blockchain Integration**: Sync with Sui blockchain contracts

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Helmet, CORS, Rate Limiting
- **Validation**: Joi

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # Database connection
│   ├── controllers/
│   │   ├── auth/                # Authentication controllers
│   │   ├── courses/             # Course management
│   │   ├── enrollments/         # Enrollment handling
│   │   ├── progress/            # Progress tracking
│   │   └── quizzes/             # Quiz management
│   ├── models/
│   │   ├── auth/                # User models
│   │   ├── courses/             # Course models
│   │   ├── enrollments/         # Enrollment models
│   │   ├── progress/            # Progress models
│   │   └── quizzes/             # Quiz models
│   ├── routes/
│   │   ├── auth.js              # Authentication routes
│   │   ├── courses.js           # Course routes
│   │   ├── enrollments.js       # Enrollment routes
│   │   ├── progress.js          # Progress routes
│   │   └── quizzes.js           # Quiz routes
│   ├── middleware/
│   │   └── auth.js              # Authentication middleware
│   ├── utils/
│   │   └── jwt.js               # JWT utilities
│   └── server.js                # Main server file
├── scripts/
│   └── migrate.js               # Database migration
├── .env.example                 # Environment variables template
├── package.json                 # Dependencies and scripts
└── README.md                    # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

### Installation

1. **Clone and navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your configuration:
   ```env
   PORT=3001
   NODE_ENV=development
   DB_HOST=localhost
   DB_USER=your_mysql_user
   DB_PASSWORD=your_mysql_password
   DB_NAME=educhain_db
   JWT_SECRET=your_super_secret_jwt_key
   JWT_EXPIRE=7d
   FRONTEND_URL=http://localhost:5173
   ```

4. **Set up MySQL database**
   ```bash
   # Create database
   mysql -u root -p
   CREATE DATABASE educhain_db;
   EXIT;
   ```

5. **Run database migrations**
   ```bash
   npm run migrate
   ```

6. **Start the server**
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

The server will start on `http://localhost:3001`

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login` - User login/authentication
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Courses
- `GET /api/courses/published` - Get all published courses
- `GET /api/courses/:id` - Get course details with lessons
- `POST /api/courses/sync` - Sync course from blockchain

### Enrollments
- `GET /api/enrollments` - Get user enrollments
- `POST /api/enrollments` - Enroll in a course

### Progress
- `GET /api/progress` - Get user progress
- `POST /api/progress/update` - Update lesson progress

### Quizzes
- `GET /api/quizzes` - Get available quizzes
- `POST /api/quizzes/submit` - Submit quiz answers

## 🔒 Authentication

The API uses JWT (JSON Web Token) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## 🗄️ Database Schema

The database includes the following main tables:

- **users**: User accounts and profiles
- **courses**: Course information and metadata
- **lessons**: Individual lessons within courses
- **enrollments**: User course enrollments
- **lesson_progress**: Detailed lesson completion tracking
- **quizzes**: Quiz definitions
- **questions**: Quiz questions and answers
- **quiz_attempts**: User quiz submission history
- **xp_transactions**: XP earning history

## 🔧 Development

### Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with auto-reload
- `npm test` - Run tests
- `npm run migrate` - Run database migrations

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3001` |
| `NODE_ENV` | Environment mode | `development` |
| `DB_HOST` | MySQL host | `localhost` |
| `DB_USER` | MySQL username | `root` |
| `DB_PASSWORD` | MySQL password | `''` |
| `DB_NAME` | Database name | `educhain_db` |
| `JWT_SECRET` | JWT signing secret | Required |
| `JWT_EXPIRE` | JWT expiration time | `7d` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:5173` |

## 🔐 Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing control
- **Rate Limiting**: API rate limiting (100 requests/15min)
- **Input Validation**: Joi schema validation
- **SQL Injection Protection**: Parameterized queries
- **JWT Authentication**: Secure token-based auth

## 📈 Monitoring & Logging

- **Morgan**: HTTP request logging
- **Winston**: Advanced logging (can be added)
- **Health Check**: `/health` endpoint for monitoring

## 🚀 Deployment

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Configure production database
- [ ] Set strong `JWT_SECRET`
- [ ] Enable HTTPS/SSL
- [ ] Configure reverse proxy (nginx)
- [ ] Set up monitoring and alerts
- [ ] Configure backup strategy

### Docker Deployment

```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the API endpoints

---

**EduChain Backend API** - Powering the future of decentralized education! 🎓🚀