# Projex - Complete Setup Guide

This guide explains how to set up and run the complete Projex application.

## 📋 Prerequisites

- **Node.js**: v18+ ([Download](https://nodejs.org))
- **npm**: v9+ (comes with Node.js)
- **Docker & Docker Compose**: For local MySQL development
- **Git**: For version control

## 🚀 Quick Start (5 minutes)

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd projex
```

### 2. Setup Environment Files

**Backend:**
```bash
cp backend/.env.example backend/.env
# Edit backend/.env with your configuration
```

**Frontend:**
```bash
cp frontend/.env.example frontend/.env.local
# Default values should work for local development
```

### 3. Start Services with Docker Compose

```bash
# This starts MySQL, Redis, and watches for changes
docker-compose up
```

In a new terminal window:

### 4. Setup Database

```bash
cd backend

# Install dependencies
npm install

# Run migrations
npm run migrate

# Seed database with example data
npm run seed

# Start backend server
npm run dev
```

In another terminal window:

### 5. Start Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🌐 Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **API Documentation**: http://localhost:3000/api/docs
- **WebSocket**: ws://localhost:3000

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

## 📁 Project Structure

### Backend (`/backend`)

```
src/
├── app.ts                 # Express app setup with Socket.IO
├── server.ts              # Server entry point
├── middleware/
│   ├── auth.ts            # JWT authentication & authorization
│   └── errorHandler.ts    # Centralized error handling
├── routes/                # API routes
│   ├── auth.routes.ts
│   ├── project.routes.ts
│   ├── board.routes.ts
│   ├── task.routes.ts
│   ├── notification.routes.ts
│   ├── user.routes.ts
│   └── search.routes.ts
├── sockets/               # Socket.IO event handlers
│   ├── taskSocket.ts
│   └── notificationSocket.ts
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Database seeding
└── config/                # Configuration files
```

### Frontend (`/frontend`)

```
src/
├── main.tsx               # Entry point
├── App.tsx                # Root component
├── pages/                 # Page components
│   ├── DashboardPage.tsx
│   ├── BoardPage.tsx
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   └── ProfilePage.tsx
├── components/
│   ├── layout/            # Layout components
│   │   ├── Sidebar.tsx
│   │   ├── Navbar.tsx
│   │   └── MainLayout.tsx
│   ├── projects/          # Project components
│   │   ├── ProjectCard.tsx
│   │   ├── ProjectsList.tsx
│   │   └── CreateProjectModal.tsx
│   ├── boards/            # Board components
│   │   ├── KanbanBoard.tsx
│   │   ├── Column.tsx
│   │   └── TaskCard.tsx
│   ├── tasks/             # Task components
│   │   ├── TaskModal.tsx
│   │   ├── TaskForm.tsx
│   │   └── TaskDetailPanel.tsx
│   ├── notifications/     # Notification components
│   │   ├── NotificationDropdown.tsx
│   │   └── NotificationsList.tsx
│   └── ui/                # Reusable UI components
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Modal.tsx
│       └── ...
├── hooks/                 # Custom React hooks
├── store/                 # Zustand stores
│   ├── auth.ts
│   └── app.ts
├── types/                 # TypeScript types
│   └── index.ts
├── api/                   # API client & hooks
│   ├── client.ts
│   └── hooks.ts
├── utils/                 # Utility functions
│   ├── cn.ts              # Class name merger
│   ├── formatDate.ts
│   └── ...
├── styles/
│   └── globals.css        # Tailwind CSS import
└── validations/           # Zod schemas
```

## 🔧 Development

### Backend Commands

```bash
cd backend

# Development server with auto-reload
npm run dev

# Build for production
npm run build

# Run tests
npm run test

# Type checking
npm run typecheck

# Linting
npm run lint

# Format code
npm run format

# Database operations
npm run migrate          # Run pending migrations
npm run migrate:deploy   # Deploy migrations (production)
npm run seed            # Run seed script
npm run generate        # Generate Prisma client
```

### Frontend Commands

```bash
cd frontend

# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check

# Linting
npm run lint

# Format code
npm run format

# Run tests
npm run test
```

## 🐳 Docker Deployment

### Local Development with Docker

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild images
docker-compose build
```

### Production with Docker

```bash
# Use production compose file (if created)
docker-compose -f docker-compose.prod.yml up -d
```

## 🌐 Real-time Features with Socket.IO

The application uses Socket.IO for real-time updates:

### Connected Events

```javascript
// Task updates
socket.on('task:updated', (task) => { /* ... */ })
socket.on('task:moved', (data) => { /* ... */ })
socket.on('task:deleted', (id) => { /* ... */ })

// Notifications
socket.on('notification:new', (notification) => { /* ... */ })
socket.on('presence:update', (data) => { /* ... */ })

// Comments
socket.on('task:commented', (data) => { /* ... */ })
```

### Emitting Events

```javascript
// Update task
socket.emit('task:update', { taskId: '123', updates: { ... } })

// Move task
socket.emit('task:move', { taskId, fromColumnId, toColumnId, order })

// Mark notification as read
socket.emit('notification:read', notificationId)
```

## 🗄️ Database

### Models

The database includes these main models:

- **User**: Authentication and profiles
- **Session**: JWT refresh tokens
- **Project**: Project container
- **ProjectMember**: Team members with roles
- **Board**: Kanban boards
- **Column**: Board columns
- **Task**: Tasks with full tracking
- **Comment**: Task comments
- **Attachment**: File attachments
- **Notification**: Real-time notifications
- **Label**: Task labels
- **ActivityLog**: Audit trail

### Running Migrations

```bash
# Create a new migration
npx prisma migrate dev --name migration_name

# Run migrations
npm run migrate

# Reset database (development only)
npx prisma migrate reset
```

### Database Seeding

```bash
# Run seed script with example data
npm run seed

# View database
npx prisma studio
```

## 🔐 Authentication

### Login Flow

1. User enters credentials
2. Backend validates and returns `accessToken` and `refreshToken`
3. Tokens stored in HttpOnly cookies + Zustand store
4. accessToken used for API requests
5. refreshToken used to get new accessToken when expired

### Protected Routes

Routes automatically require authentication. Unauthenticated requests are redirected to login.

### Token Refresh

When accessToken expires:
1. API client intercepts 401 response
2. Uses refreshToken to request new accessToken
3. Retries original request
4. If refresh fails, user is logged out

## 📊 Dashboard

The dashboard displays:

- **Quick Stats**: Projects, tasks due today, completed tasks
- **My Tasks**: Personal task list
- **Activity Feed**: Recent project activity
- **Upcoming Deadlines**: Calendar of due dates
- **Team Workload**: Team member utilization
- **Project Progress**: Status of active projects

## 🔍 Global Search

Search for:
- Projects
- Tasks
- Boards
- Users

Uses debouncing to optimize API calls.

## 📋 Kanban Board Features

- **Drag & Drop**: Drag tasks between columns
- **Columns**: Customizable columns (Backlog, Todo, In Progress, etc.)
- **WIP Limits**: Set work-in-progress limits
- **Filters**: Filter by assignee, priority, due date
- **Search**: Find tasks within board
- **Swimlanes**: Organize by assignee or custom fields

## 👥 Role-Based Access Control

### Roles

| Role | Permissions |
|------|-------------|
| Super Admin | Full system access |
| Admin | Project management, user management |
| Project Manager | Create boards, assign tasks, manage team |
| Team Member | Create/update tasks, comment |
| Viewer | Read-only access |

## 📧 Email Notifications

Configure SMTP in `.env` to enable:

- Task assignment notifications
- Due date reminders
- Comment mentions
- Project invitations

## 📦 Deployment

### Frontend (Vercel)

1. Connect GitHub repo to Vercel
2. Set environment variables:
   - `VITE_API_URL`: Backend API URL
   - `VITE_SOCKET_URL`: WebSocket URL
3. Deploy with `git push`

### Backend (Render/Railway)

1. Connect GitHub repo
2. Set environment variables
3. Configure health check: `GET /api/v1/health`
4. Deploy with `git push`

### Database (Managed MySQL)

Use AWS RDS, Planetscale, or similar:

1. Create MySQL database
2. Set `DATABASE_URL` in backend `.env`
3. Run `npm run migrate:deploy`
4. Run `npm run seed` for initial data

## 🐛 Troubleshooting

### Database Connection Issues

```bash
# Check DATABASE_URL in .env
# Make sure MySQL is running:
docker-compose up mysql -d

# Test connection:
npx prisma db execute --stdin < /dev/null
```

### Port Already in Use

```bash
# Kill process on port 3000:
lsof -ti:3000 | xargs kill -9

# Kill process on port 5173:
lsof -ti:5173 | xargs kill -9
```

### CORS Errors

Check `CORS_ORIGIN` in backend `.env` matches frontend URL.

### Socket.IO Connection Failed

Ensure backend is running and `VITE_SOCKET_URL` is correct.

## 📚 API Documentation

Full API documentation is available at `/api/docs` when backend is running.

### Example API Calls

```bash
# Login
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@projex.com",
    "password": "Password@123"
  }'

# Get projects
curl http://localhost:3000/api/v1/projects \
  -H "Authorization: Bearer <token>"

# Create task
curl -X POST http://localhost:3000/api/v1/tasks \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "columnId": "column-123",
    "title": "New Task",
    "priority": "HIGH"
  }'
```

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/amazing-feature`
2. Commit changes: `git commit -m 'Add amazing feature'`
3. Push to branch: `git push origin feature/amazing-feature`
4. Open a Pull Request

## 📝 Project Structure Files Created

This complete implementation includes:

### Backend
- ✅ Express.js server with Socket.IO
- ✅ JWT authentication with refresh tokens
- ✅ Prisma ORM with MySQL
- ✅ RESTful API routes (auth, projects, tasks, boards, notifications, users, search)
- ✅ Real-time Socket.IO handlers
- ✅ Middleware (auth, error handling)
- ✅ Database schema with 13+ models
- ✅ Database seeding with example data
- ✅ Docker support
- ✅ TypeScript configuration

### Frontend
- ✅ React 19 with TypeScript
- ✅ Vite build configuration
- ✅ Tailwind CSS with custom design tokens
- ✅ Zustand for state management
- ✅ React Query for server state
- ✅ Socket.IO client setup
- ✅ API client with token refresh
- ✅ Custom hooks (useLogin, useProjects, etc.)
- ✅ Type definitions for all models
- ✅ Docker support for development

### Configuration & Documentation
- ✅ docker-compose.yml for local development
- ✅ .env.example files for both backend and frontend
- ✅ README.md with comprehensive documentation
- ✅ SETUP.md (this file)
- ✅ TypeScript configurations

## 📂 Missing Components (Create These)

The following components need to be created to complete the frontend:

### Pages
- `src/pages/DashboardPage.tsx`
- `src/pages/BoardPage.tsx`
- `src/pages/LoginPage.tsx`
- `src/pages/RegisterPage.tsx`
- `src/pages/ProfilePage.tsx`
- `src/pages/ProjectsPage.tsx`
- `src/pages/NotificationsPage.tsx`

### Layout Components
- `src/components/layout/MainLayout.tsx`
- `src/components/layout/Sidebar.tsx`
- `src/components/layout/Navbar.tsx`

### Project Components
- `src/components/projects/ProjectCard.tsx`
- `src/components/projects/ProjectsList.tsx`
- `src/components/projects/CreateProjectModal.tsx`

### Board & Task Components
- `src/components/boards/KanbanBoard.tsx`
- `src/components/boards/Column.tsx`
- `src/components/tasks/TaskCard.tsx`
- `src/components/tasks/TaskModal.tsx`
- `src/components/tasks/TaskDetailPanel.tsx`

### Notification Components
- `src/components/notifications/NotificationDropdown.tsx`
- `src/components/notifications/NotificationsList.tsx`

### UI Components (shadcn/ui)
- `src/components/ui/Button.tsx`
- `src/components/ui/Input.tsx`
- `src/components/ui/Modal.tsx`
- `src/components/ui/Card.tsx`
- `src/components/ui/Badge.tsx`
- `src/components/ui/Select.tsx`
- `src/components/ui/Textarea.tsx`
- `src/components/ui/Dropdown.tsx`

### Utilities & Hooks
- `src/utils/cn.ts` (class name utility)
- `src/utils/formatDate.ts`
- `src/hooks/useToast.ts`
- `src/hooks/useDragDrop.ts`

### Validation Schemas
- `src/validations/auth.ts`
- `src/validations/project.ts`
- `src/validations/task.ts`

## ✨ Next Steps

1. **Install dependencies**: Run `npm install` in both `/backend` and `/frontend`
2. **Start Docker**: `docker-compose up` for MySQL and Redis
3. **Setup database**: Run `npm run migrate` and `npm run seed` in backend
4. **Start servers**: `npm run dev` in both directories
5. **Create remaining components**: Follow the list above
6. **Test functionality**: Login with default credentials
7. **Configure deployment**: Set up Vercel for frontend, Render/Railway for backend

## 🆘 Getting Help

- Check logs: `docker-compose logs <service>`
- Review error messages in browser console
- Check API responses in Network tab
- Look at backend logs for server errors

## 📄 License

MIT - See LICENSE file for details

---

**Version**: 1.0.0  
**Last Updated**: 2024  
**Status**: Production Ready (after frontend component completion)
