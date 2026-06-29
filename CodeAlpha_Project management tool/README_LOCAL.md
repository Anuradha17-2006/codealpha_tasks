# Projex - Project Management Platform

A modern, full-stack project management application built with React, Node.js, Express, Prisma, and Socket.IO. This version is configured for **local development without Docker**.

## ✨ Features

- 🔐 **Secure Authentication** - JWT-based auth with refresh tokens
- 📊 **Dashboard** - Overview of projects and tasks
- 📁 **Project Management** - Create, manage, and organize projects
- 🎯 **Task Management** - Kanban board with drag-and-drop
- 👥 **Team Collaboration** - Real-time updates via WebSocket
- 🔔 **Notifications** - Real-time task and project notifications
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 🎨 **Modern UI** - Built with Tailwind CSS and Lucide icons

## 🏗️ Architecture

### Frontend
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **State Management**: Zustand
- **Query Client**: TanStack Query (React Query)
- **Styling**: Tailwind CSS
- **Real-time**: Socket.IO
- **Form Handling**: React Hook Form + Zod

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL
- **ORM**: Prisma
- **Authentication**: JWT
- **Real-time**: Socket.IO
- **Caching**: Redis (optional)

## 📋 Prerequisites

- **Node.js**: v18 or higher
- **npm**: v9 or higher
- **MySQL**: v8.0 or higher (local installation)
- **Git**: For version control

**Optional:**
- Redis (v6+) - For caching/jobs
- Postman - For API testing

## 🚀 Quick Start

### Option 1: Automatic Setup (Recommended)

**macOS/Linux:**
```bash
chmod +x quickstart.sh
./quickstart.sh
```

**Windows:**
```bash
quickstart.bat
```

This script will:
- ✓ Verify prerequisites (Node.js, npm, MySQL)
- ✓ Install all dependencies
- ✓ Setup database and run migrations
- ✓ Seed test data
- ✓ Provide instructions for running the app

### Option 2: Manual Setup

See [SETUP_LOCAL.md](./SETUP_LOCAL.md) for detailed step-by-step instructions.

## 🎯 Running the Application

Once setup is complete, you need **two terminal windows**:

### Terminal 1: Backend Server
```bash
cd backend
npm run dev
```

Expected output:
```
✓ Server running on http://localhost:3000
✓ API documentation at http://localhost:3000/api/docs
```

### Terminal 2: Frontend Application
```bash
cd frontend
npm run dev
```

Expected output:
```
✓ VITE ready in xxx ms

  ➜  Local:   http://localhost:5173/
```

## 🌐 Accessing the Application

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:5173 | Main application |
| Backend API | http://localhost:3000 | API endpoints |
| API Docs | http://localhost:3000/api/docs | Swagger documentation |
| WebSocket | ws://localhost:3000 | Real-time updates |

## 🔑 Default Credentials

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

## 📁 Project Structure

```
projex/
├── backend/                    # Express.js server
│   ├── src/
│   │   ├── app.ts             # Express configuration
│   │   ├── server.ts          # Server entry point
│   │   ├── routes/            # API routes
│   │   ├── middleware/        # Auth, error handling
│   │   ├── sockets/           # WebSocket handlers
│   │   └── prisma/            # Database schema
│   ├── .env                   # Environment variables
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                   # React application
│   ├── src/
│   │   ├── pages/             # Page components
│   │   ├── components/        # Reusable components
│   │   ├── api/               # API client & hooks
│   │   ├── store/             # Zustand state stores
│   │   ├── types/             # TypeScript types
│   │   ├── App.tsx            # Main App component
│   │   └── main.tsx           # Entry point
│   ├── .env.local             # Environment variables
│   ├── package.json
│   ├── vite.config.ts         # Vite configuration
│   └── tailwind.config.js     # Tailwind CSS config
│
├── SETUP_LOCAL.md             # Detailed setup guide
├── README.md                  # This file
└── quickstart.sh / .bat       # Quick setup scripts
```

## 🛠️ Development Commands

### Backend
```bash
cd backend

# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Run type checking
npm run typecheck

# Format code
npm run format

# Lint code
npm run lint

# Database migration
npm run migrate

# Database seeding
npm run seed
```

### Frontend
```bash
cd frontend

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check

# Format code
npm run format

# Lint code
npm run lint
```

## 🔧 Configuration

### Backend (.env)
```
NODE_ENV=development
PORT=3000
DATABASE_URL=mysql://root:@localhost:3306/projex_dev
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key
CORS_ORIGIN=http://localhost:5173
```

### Frontend (.env.local)
```
VITE_API_BASE_URL=http://localhost:3000
VITE_SOCKET_URL=http://localhost:3000
```

## 📚 Database

The application uses MySQL with Prisma ORM. The database schema includes:

- **Users** - User accounts and profiles
- **Projects** - Project information and metadata
- **Tasks** - Individual tasks and work items
- **Boards** - Kanban boards for projects
- **Notifications** - User notifications
- **Activities** - Activity logs and history

### Database Operations

```bash
# Create new migration
npm run migrate -- --name <migration_name>

# Seed with test data
npm run seed

# Reset database (careful!)
npm run migrate -- reset

# View database
mysql -u root projex_dev
```

## 🧪 Testing

```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test

# Coverage reports
npm run test:coverage
```

## 🐛 Troubleshooting

### MySQL Connection Failed
- Ensure MySQL is running
- Verify DATABASE_URL in backend/.env
- Check MySQL credentials

### Port Already in Use
- Change PORT in backend/.env
- Update VITE_API_BASE_URL in frontend/.env.local

### Module Not Found
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Database Migration Failed
```bash
# Reset database and re-migrate
cd backend
npm run migrate -- reset
npm run seed
```

See [SETUP_LOCAL.md](./SETUP_LOCAL.md) for more detailed troubleshooting.

## 📦 Production Build

### Build Frontend
```bash
cd frontend
npm run build
# Output: dist/ folder
```

### Build Backend
```bash
cd backend
npm run build
# Output: dist/ folder
```

## 🔐 Security

**Development:**
- Uses default JWT secrets (change for production)
- CORS enabled for localhost
- Rate limiting configured

**Production:**
- Change JWT_SECRET and JWT_REFRESH_SECRET
- Set NODE_ENV=production
- Use strong database passwords
- Enable HTTPS
- Implement firewall rules
- Use environment variables for secrets

## 📚 API Documentation

When running locally, access the API documentation at:
```
http://localhost:3000/api/docs
```

This provides an interactive Swagger UI for all endpoints.

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For issues or questions:

1. Check [SETUP_LOCAL.md](./SETUP_LOCAL.md) troubleshooting section
2. Review API documentation at http://localhost:3000/api/docs
3. Check terminal output for error messages
4. Verify all prerequisites are installed

## 🎯 Next Steps

1. ✅ Complete setup using quickstart script
2. ✅ Start backend and frontend servers
3. ✅ Login with demo credentials
4. ✅ Create your first project
5. ✅ Add tasks and team members
6. ✅ Explore real-time collaboration features

---

**Happy Project Managing! 🚀**

**Last Updated:** June 2026  
**Node.js Version:** 18+  
**React Version:** 19+
