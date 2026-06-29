# Projex - Production-Ready Project Management Platform

A modern, full-stack project management application built with React 19, Node.js/Express, and MySQL. Features real-time collaboration, role-based access control, and a beautiful, responsive UI.

## 🚀 Features

- **Authentication**: JWT + Google OAuth + Email verification
- **Projects**: Create, manage, duplicate, and organize projects
- **Kanban Boards**: Drag-and-drop task management with real-time updates
- **Tasks**: Full-featured task management with assignments, priorities, and tracking
- **Real-time Notifications**: Socket.IO powered instant updates
- **Role-Based Access Control**: Super Admin, Admin, Manager, Team Member, Viewer roles
- **Teams**: Invite members, manage permissions
- **Dashboard**: Analytics, activity feed, quick stats
- **Global Search**: Debounced project, board, task, and user search
- **File Attachments**: Upload files to tasks
- **Activity Logging**: Complete audit trail
- **Responsive Design**: Mobile-friendly interface

## 📋 Tech Stack

### Frontend
- React 19 with TypeScript
- Vite for fast development
- React Router for navigation
- Tailwind CSS + shadcn/ui for styling
- Zustand for state management
- React Query (TanStack) for server state
- Socket.IO Client for real-time updates
- Axios for API requests
- React Hook Form + Zod for validation

### Backend
- Node.js + Express.js
- TypeScript
- Prisma ORM
- Socket.IO for real-time features
- JWT authentication
- bcryptjs for password hashing
- Joi for validation
- Nodemailer for emails
- Bull for job queues

### Database
- MySQL 8.0+
- Prisma migrations

### DevOps
- Docker & Docker Compose
- GitHub Actions for CI/CD
- Vercel (Frontend)
- Render/Railway (Backend)

## 📁 Project Structure

```
projex/
├── frontend/                 # React application
│   ├── src/
│   │   ├── api/             # API client and hooks
│   │   ├── assets/          # Images, fonts, icons
│   │   ├── components/      # Reusable components
│   │   │   ├── ui/          # shadcn/ui components
│   │   │   ├── layout/      # Layout components
│   │   │   ├── auth/        # Auth components
│   │   │   ├── projects/    # Project components
│   │   │   ├── boards/      # Board components
│   │   │   ├── tasks/       # Task components
│   │   │   └── notifications/ # Notification components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── pages/           # Page components
│   │   ├── routes/          # Route definitions
│   │   ├── store/           # Zustand stores
│   │   ├── types/           # TypeScript types
│   │   ├── utils/           # Utility functions
│   │   ├── validations/     # Zod schemas
│   │   ├── App.tsx          # Main app component
│   │   └── main.tsx         # Entry point
│   ├── public/              # Static assets
│   ├── vite.config.ts       # Vite configuration
│   ├── tsconfig.json        # TypeScript config
│   ├── tailwind.config.js   # Tailwind config
│   ├── package.json
│   └── .env.example
│
├── backend/                 # Express application
│   ├── src/
│   │   ├── config/          # Configuration files
│   │   ├── controllers/     # Request handlers
│   │   ├── middleware/      # Express middleware
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── sockets/         # Socket.IO handlers
│   │   ├── prisma/          # Database migrations
│   │   ├── utils/           # Utility functions
│   │   ├── jobs/            # Background jobs
│   │   ├── validations/     # Request validation
│   │   ├── types/           # TypeScript types
│   │   └── app.ts           # Express app setup
│   ├── src/server.ts        # Server entry point
│   ├── .env.example
│   ├── tsconfig.json
│   ├── package.json
│   └── Dockerfile
│
├── .github/
│   └── workflows/           # CI/CD pipelines
│
├── docker-compose.yml       # Local development setup
├── .gitignore
└── SETUP.md                 # Detailed setup guide

```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- Docker & Docker Compose (for local MySQL)
- Git

### 1. Clone & Setup

```bash
# Clone the repository
git clone <repo-url>
cd projex

# Install dependencies
cd frontend && npm install
cd ../backend && npm install
cd ..
```

### 2. Environment Setup

```bash
# Copy environment files
cp frontend/.env.example frontend/.env.local
cp backend/.env.example backend/.env

# Edit backend/.env with your configuration
nano backend/.env
```

### 3. Start Services

```bash
# Start MySQL (requires Docker)
docker-compose up -d

# Run database migrations
cd backend
npm run migrate
npm run seed

cd ../frontend
npm run dev

cd ../backend
npm run dev
```

Visit:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- API Docs: http://localhost:3000/api/docs

## 🔐 Default Credentials

```
Admin Account:
Email: admin@projex.com
Password: Password@123

Manager Account:
Email: manager@projex.com
Password: Password@123

Developer Account:
Email: developer@projex.com
Password: Password@123
```

## 📚 API Documentation

API documentation is available at `/api/docs` when the backend is running (Swagger UI).

Key endpoints:
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/register` - Register
- `GET /api/v1/projects` - List projects
- `POST /api/v1/projects` - Create project
- `GET /api/v1/projects/:id/boards` - Get project boards
- `GET /api/v1/boards/:id/tasks` - Get board tasks
- `GET /api/v1/tasks/:id` - Get task details

## 🔄 Real-Time Features

The application uses Socket.IO for real-time updates:

```javascript
// Connected to ws://localhost:3000
// Events:
- 'task:updated' - Task changes
- 'task:created' - New task
- 'notification:new' - New notification
- 'presence' - User presence updates
```

## 🧪 Testing

```bash
# Frontend tests
cd frontend
npm run test
npm run test:coverage

# Backend tests
cd ../backend
npm run test
npm run test:integration
npm run test:coverage
```

## 🐳 Docker Deployment

```bash
# Build images
docker-compose build

# Run with Docker
docker-compose up

# For production, use:
docker-compose -f docker-compose.prod.yml up
```

## 📦 Database Schema

Key models:
- **User**: Authentication and profile
- **Project**: Project container
- **ProjectMember**: Team members with roles
- **Board**: Kanban boards
- **Column**: Board columns
- **Task**: Tasks with full tracking
- **Comment**: Task comments
- **Notification**: Real-time notifications
- **Label**: Task labels/tags
- **Attachment**: File attachments
- **ActivityLog**: Audit trail

## 🔐 Security

- ✅ Password hashing (bcryptjs)
- ✅ JWT with refresh tokens
- ✅ HttpOnly secure cookies
- ✅ CORS protection
- ✅ CSRF tokens
- ✅ Rate limiting
- ✅ Input validation & sanitization
- ✅ XSS protection with DOMPurify
- ✅ SQL injection prevention (Prisma)
- ✅ Environment variable validation

## 📈 Deployment

### Frontend (Vercel)
```bash
# Connect GitHub repo to Vercel
# Set environment variables in Vercel dashboard
# Deploy: git push to main branch
```

### Backend (Render/Railway)
```bash
# Connect GitHub repo
# Set environment variables
# Deploy: git push to main branch
```

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/amazing-feature`
2. Commit changes: `git commit -m 'Add amazing feature'`
3. Push to branch: `git push origin feature/amazing-feature`
4. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For issues, questions, or suggestions:
1. Check existing issues
2. Create a new issue with detailed information
3. Contact: support@projex.com

## 📞 Contact

- Website: https://projex.com
- Email: hello@projex.com
- Twitter: @projex_app

---

**Happy Project Managing! 🎉**
