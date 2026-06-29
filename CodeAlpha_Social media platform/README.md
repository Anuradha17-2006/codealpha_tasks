# ConnectSphere - Social Media Platform

A production-ready, full-stack social media platform built with modern web technologies. ConnectSphere enables users to create profiles, share content, engage with others, and build meaningful connections in a safe and inclusive environment.

## 🎯 Features

### Core Features
- ✅ **User Authentication** - JWT-based auth with refresh tokens
- ✅ **User Profiles** - Customizable profiles with bio, location, interests
- ✅ **Posts** - Text, images, videos, polls, and GIFs
- ✅ **Engagement** - Likes, comments, shares, and reactions
- ✅ **Real-time Messaging** - Socket.IO powered instant messaging
- ✅ **Notifications** - Real-time notifications for interactions
- ✅ **Follow System** - Follow/unfollow and blocking features
- ✅ **Feed Algorithm** - Personalized feed based on interests
- ✅ **Search & Discovery** - Global search with filters
- ✅ **Admin Dashboard** - User and content management

### Advanced Features
- 🎨 **Dark/Light Mode** - Theme toggle
- 🎮 **Gamification** - Badges, levels, and leaderboards
- 📚 **Stories** - 24-hour disappearing stories
- ✔️ **Verification System** - Verified badges
- 🔍 **AI Content Moderation** - Spam and offensive content detection
- 📊 **Analytics Dashboard** - User engagement metrics
- 📱 **Progressive Web App** - Installable on mobile devices
- 🔐 **Security** - HTTPS, CORS, rate limiting, XSS protection

## 🛠 Tech Stack

### Frontend
- HTML5, CSS3, Vanilla JavaScript
- Responsive design (Mobile-first)
- Socket.IO client for real-time features
- PWA support

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL with Sequelize ORM
- **Real-time**: Socket.IO
- **Authentication**: JWT + Refresh Tokens
- **Security**: Helmet.js, CORS, rate limiting
- **File Storage**: Local uploads with cloud support

### DevOps
- **Containerization**: Docker & Docker Compose
- **Orchestration**: Docker Compose
- **Web Server**: Nginx
- **Caching**: Redis

## 📋 Prerequisites

- Node.js >= 16.0.0
- npm >= 8.0.0
- Docker & Docker Compose (optional, for containerized setup)
- MySQL 8.0+ (if not using Docker)
- Redis (if not using Docker)

## 🚀 Quick Start

### Using Docker Compose (Recommended)

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/connectsphere.git
   cd connectsphere
   ```

2. **Create environment file**
   ```bash
   cp server/.env.example server/.env
   ```

3. **Update environment variables**
   ```bash
   nano server/.env
   # Update database credentials, JWT secrets, email config, etc.
   ```

4. **Start the application**
   ```bash
   docker-compose up -d
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - API Docs: http://localhost:5000/api/docs

### Manual Setup

#### Backend Setup

1. **Install dependencies**
   ```bash
   cd server
   npm install
   ```

2. **Create environment file**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Initialize database**
   ```bash
   npm run migrate
   npm run seed
   ```

4. **Start server**
   ```bash
   npm run dev  # Development with nodemon
   npm start    # Production
   ```

#### Frontend Setup

1. **Open frontend in browser**
   ```bash
   # Simply open client/index.html in your browser
   # Or use a local development server
   npx http-server client
   ```

## 📁 Project Structure

```
connectsphere/
├── client/                    # Frontend files
│   ├── index.html            # Landing page
│   ├── pages/                # HTML pages
│   │   ├── login.html
│   │   ├── register.html
│   │   ├── home.html
│   │   └── ...
│   ├── css/                  # Stylesheets
│   │   ├── styles.css
│   │   ├── auth.css
│   │   └── responsive.css
│   └── js/                   # JavaScript
│       ├── api.js           # API client
│       ├── auth.js          # Auth logic
│       └── main.js          # Main functionality
│
├── server/                    # Backend API
│   ├── server.js            # Main server file
│   ├── config/              # Configuration
│   │   └── database.js
│   ├── models/              # Sequelize models
│   │   ├── User.js
│   │   ├── Post.js
│   │   └── index.js
│   ├── controllers/         # Request handlers
│   │   └── authController.js
│   ├── routes/              # API routes
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   └── ...
│   ├── middleware/          # Express middleware
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── requestLogger.js
│   ├── services/            # Business logic
│   │   ├── emailService.js
│   │   └── socketService.js
│   ├── package.json
│   └── Dockerfile
│
├── database/                 # Database files
│   ├── init.sql            # Schema initialization
│   └── mysql_data/         # MySQL data volume
│
├── docker/                   # Docker configuration
│   ├── nginx.conf          # Nginx configuration
│   └── Dockerfile          # Backend Dockerfile
│
├── docs/                     # Documentation
│   ├── API.md              # API documentation
│   ├── DATABASE.md         # Database schema
│   └── DEPLOYMENT.md       # Deployment guide
│
├── docker-compose.yml       # Docker Compose configuration
└── README.md               # This file
```

## 🔐 Security Features

- **JWT Authentication** - Secure token-based auth with refresh mechanism
- **Password Hashing** - bcrypt with configurable rounds
- **CORS** - Configured CORS headers
- **Helmet.js** - Sets various HTTP headers for security
- **Rate Limiting** - Prevents brute force attacks
- **Input Validation** - Server-side validation
- **XSS Prevention** - Input sanitization
- **SQL Injection Prevention** - Parameterized queries with Sequelize
- **CSRF Protection** - Token-based protection
- **Secure Cookies** - httpOnly, Secure, SameSite flags
- **File Upload Security** - Validation and sanitization

## 📚 API Documentation

### Authentication Endpoints

```
POST   /api/v1/auth/register         - Register new user
POST   /api/v1/auth/login            - Login user
POST   /api/v1/auth/logout           - Logout user
POST   /api/v1/auth/verify-email     - Verify email
POST   /api/v1/auth/forgot-password  - Send password reset email
POST   /api/v1/auth/reset-password   - Reset password
POST   /api/v1/auth/refresh-token    - Get new access token
```

### User Endpoints

```
GET    /api/v1/users/:id             - Get user profile
PUT    /api/v1/users/:id             - Update profile
DELETE /api/v1/users/:id             - Delete account
GET    /api/v1/users/:id/followers   - Get followers
GET    /api/v1/users/:id/following   - Get following list
```

### Post Endpoints

```
GET    /api/v1/posts                 - Get feed
POST   /api/v1/posts                 - Create post
GET    /api/v1/posts/:id             - Get post
PUT    /api/v1/posts/:id             - Update post
DELETE /api/v1/posts/:id             - Delete post
POST   /api/v1/posts/:id/bookmark    - Bookmark post
```

### Engagement Endpoints

```
POST   /api/v1/likes/post/:postId    - Like post
DELETE /api/v1/likes/post/:postId    - Unlike post
GET    /api/v1/comments/:postId      - Get comments
POST   /api/v1/comments              - Create comment
```

### Real-time Features (Socket.IO)

```
Socket Events:
- user:online                - User comes online
- message:send              - Send message
- typing:start              - User typing
- notification:send         - Send notification
- post:liked                - Post liked
```

## 🗄 Database Schema

The application uses the following main tables:

- **users** - User accounts
- **posts** - Posts/tweets
- **comments** - Comments on posts
- **likes** - Like records
- **followers** - Follow relationships
- **messages** - Direct messages
- **conversations** - Message conversations
- **notifications** - User notifications
- **stories** - Story content (24hr expiry)
- **hashtags** - Hashtag tracking
- **bookmarks** - Saved posts
- **reports** - Content reports
- **user_analytics** - User engagement metrics

See `database/init.sql` for complete schema.

## 🚢 Deployment

### Docker Deployment

1. **Build images**
   ```bash
   docker-compose build
   ```

2. **Start containers**
   ```bash
   docker-compose up -d
   ```

3. **View logs**
   ```bash
   docker-compose logs -f backend
   ```

4. **Stop application**
   ```bash
   docker-compose down
   ```

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Update `JWT_SECRET` and `JWT_REFRESH_SECRET`
- [ ] Configure email service (SMTP)
- [ ] Set up SSL/HTTPS
- [ ] Configure database backups
- [ ] Set up monitoring and logging
- [ ] Enable rate limiting
- [ ] Configure CORS properly
- [ ] Set secure cookies
- [ ] Disable debug logging

## 📊 Database Backups

```bash
# Backup database
docker-compose exec db mysqldump -u connectsphere -pconnectsphere connectsphere > backup.sql

# Restore database
docker-compose exec -T db mysql -u connectsphere -pconnectsphere connectsphere < backup.sql
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run linting
npm run lint
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.


## 🗺 Roadmap

- [ ] Mobile app (React Native)
- [ ] Live streaming
- [ ] Video calls
- [ ] Blockchain integration
- [ ] Advanced analytics
- [ ] Machine learning recommendations
- [ ] Cryptocurrency payments


Made with ❤️ by the ConnectSphere Team
