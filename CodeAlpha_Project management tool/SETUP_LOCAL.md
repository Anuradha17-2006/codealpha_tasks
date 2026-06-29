# Projex - Local Development Setup (No Docker)

This guide explains how to set up and run Projex on your local machine without Docker.

## 📋 Prerequisites

### Required
- **Node.js**: v18 or higher ([Download](https://nodejs.org))
- **npm**: v9 or higher (comes with Node.js)
- **MySQL**: v8.0 or higher ([Download](https://dev.mysql.com/downloads/mysql/))
- **Git**: For version control ([Download](https://git-scm.com))

### Optional
- **Redis**: v6+ for caching (optional, can use mock) ([Download](https://redis.io/download))
- **Postman**: For API testing ([Download](https://www.postman.com/downloads/))

---

## 🔧 Step 1: System Setup

### Windows, macOS, or Linux

#### 1.1 Install MySQL

**Windows:**
- Download MySQL Community Server from https://dev.mysql.com/downloads/mysql/
- Run installer and follow setup wizard
- Default port: 3306
- Remember your root password
- During setup, you can uncheck "Configure MySQL Server as a Windows Service" if you prefer manual control

**macOS (using Homebrew):**
```bash
brew install mysql
brew services start mysql  # Start MySQL as a service
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get update
sudo apt-get install mysql-server
sudo systemctl start mysql
```

#### 1.2 Verify MySQL Installation

```bash
mysql --version
mysql -u root -p  # You'll be prompted for password (none by default on fresh install)
```

If you get a prompt showing `mysql>`, MySQL is working. Type `exit` to quit.

#### 1.3 Create Database (Optional but Recommended)

```bash
mysql -u root
# Then in MySQL prompt:
CREATE DATABASE projex_dev;
exit;
```

#### 1.4 Install Node.js

Download from https://nodejs.org (LTS version recommended)

Verify installation:
```bash
node --version  # Should show v18+
npm --version   # Should show v9+
```

---

## 🎯 Step 2: Backend Setup

### 2.1 Navigate to Backend Directory

```bash
cd projex/backend
```

### 2.2 Install Dependencies

```bash
npm install
```

This installs all required packages for the backend including Express, Prisma, Socket.IO, etc.

### 2.3 Verify Database Connection

The `.env` file is already configured for local MySQL. Verify the DATABASE_URL:

```
DATABASE_URL=mysql://root:@localhost:3306/projex_dev
```

If your MySQL has a password or uses a different user, update this line:
```
DATABASE_URL=mysql://username:password@localhost:3306/projex_dev
```

### 2.4 Setup Prisma & Database

```bash
# Generate Prisma client
npm run generate

# Run migrations (creates tables)
npm run migrate

# Seed database with example data
npm run seed
```

You should see:
```
✓ Migration successful
✓ Seeding completed
```

### 2.5 Start Backend Server

```bash
npm run dev
```

You should see:
```
✓ Server running on http://localhost:3000
✓ API documentation at http://localhost:3000/api/docs
```

**Keep this terminal window open!** The backend needs to stay running.

---

## 🎨 Step 3: Frontend Setup

### 3.1 Open a New Terminal (Keep Backend Running)

```bash
cd projex/frontend
```

### 3.2 Install Dependencies

```bash
npm install
```

### 3.3 Environment Configuration

The `.env.local` file is already created. Verify it has:

```
VITE_API_BASE_URL=http://localhost:3000
VITE_SOCKET_URL=http://localhost:3000
```

### 3.4 Start Frontend Development Server

```bash
npm run dev
```

You should see:
```
✓ VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

---

## 🌐 Step 4: Access the Application

Open your browser and navigate to:

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **API Docs**: http://localhost:3000/api/docs

### Default Login Credentials

```
Email: admin@projex.com
Password: Password@123
```

Other test accounts:
- `manager@projex.com` / `Password@123`
- `developer@projex.com` / `Password@123`

---

## 🔗 Working with the Application

### Terminal 1: Backend
```bash
cd projex/backend
npm run dev
```

### Terminal 2: Frontend
```bash
cd projex/frontend
npm run dev
```

### Terminal 3: Optional - MySQL
```bash
# Only needed to check database directly
mysql -u root
```

---

## 🐛 Troubleshooting

### Problem: "Cannot connect to MySQL"

**Solution:**
1. Check MySQL is running:
   - Windows: Look for MySQL in Services or run `mysql --version`
   - macOS: Run `brew services list` (MySQL should show "started")
   - Linux: Run `sudo systemctl status mysql`

2. Start MySQL if not running:
   - macOS: `brew services start mysql`
   - Linux: `sudo systemctl start mysql`
   - Windows: Start MySQL from Services or run MySQL as Administrator

3. Verify connection:
   ```bash
   mysql -u root
   ```

### Problem: "Port 3000 already in use"

**Solution:**
Change the PORT in `backend/.env`:
```
PORT=3001
```

Then update frontend `.env.local`:
```
VITE_API_BASE_URL=http://localhost:3001
VITE_SOCKET_URL=http://localhost:3001
```

### Problem: "Port 5173 already in use"

**Solution:**
The frontend will automatically try the next port (5174, 5175, etc.)

### Problem: "Module not found" errors

**Solution:**
```bash
# In the affected folder (backend or frontend):
rm -rf node_modules package-lock.json
npm install
```

### Problem: Database migration fails

**Solution:**
1. Check MySQL is running
2. Verify DATABASE_URL in `backend/.env`
3. Drop and recreate the database:
   ```bash
   mysql -u root
   DROP DATABASE projex_dev;
   CREATE DATABASE projex_dev;
   exit;
   ```
4. Re-run migrations:
   ```bash
   npm run migrate
   npm run seed
   ```

### Problem: "Cannot find module 'socket.io'"

**Solution:**
```bash
cd backend
npm install
npm run dev
```

---

## 📁 Project Structure

```
projex/
├── backend/
│   ├── src/
│   │   ├── app.ts          # Express app setup
│   │   ├── server.ts       # Server entry point
│   │   ├── routes/         # API endpoints
│   │   ├── middleware/     # Auth, error handling
│   │   ├── sockets/        # WebSocket handlers
│   │   └── prisma/         # Database schema & seed
│   ├── .env                # Configuration (create from example)
│   ├── package.json        # Dependencies
│   └── tsconfig.json       # TypeScript config
│
├── frontend/
│   ├── src/
│   │   ├── pages/          # Page components
│   │   ├── components/     # Reusable components
│   │   ├── api/            # API client & hooks
│   │   ├── store/          # Zustand state
│   │   ├── types/          # TypeScript types
│   │   ├── App.tsx         # Main app
│   │   └── main.tsx        # Entry point
│   ├── .env.local          # Configuration
│   ├── package.json        # Dependencies
│   ├── vite.config.ts      # Vite config
│   └── tailwind.config.js  # Tailwind CSS
│
├── SETUP.md                # This file
└── README.md               # Project overview
```

---

## 🚀 Common Tasks

### Rebuild Frontend
```bash
cd frontend
npm run build
```

### Type Check
```bash
# Backend
cd backend && npm run typecheck

# Frontend
cd frontend && npm run type-check
```

### Format Code
```bash
# Backend
cd backend && npm run format

# Frontend
cd frontend && npm run format
```

### View Database
```bash
mysql -u root projex_dev
# Then use MySQL commands to inspect tables
```

---

## 📦 Production Build

### Build Frontend for Production

```bash
cd frontend
npm run build
```

This creates a `dist/` folder with optimized production files.

### Build Backend for Production

```bash
cd backend
npm run build
```

This creates a `dist/` folder with compiled JavaScript.

---

## 🔐 Security Notes

### For Development Only:
- Default JWT secrets are not secure
- Use local testing credentials only
- Do not commit `.env` files with real secrets

### For Production:
- Change JWT_SECRET and JWT_REFRESH_SECRET in `.env`
- Set NODE_ENV=production
- Use environment variables for sensitive data
- Enable HTTPS
- Implement rate limiting
- Use strong database passwords
- Enable firewall rules

---

## 📚 Additional Resources

- **Node.js Docs**: https://nodejs.org/docs/
- **Express.js**: https://expressjs.com/
- **React**: https://react.dev/
- **Prisma**: https://www.prisma.io/docs/
- **Tailwind CSS**: https://tailwindcss.com/docs/
- **Socket.IO**: https://socket.io/docs/

---

## 💡 Tips for Development

1. **Keep both servers running**: Always have backend and frontend running in separate terminals
2. **Hot reload**: Both servers support hot reload on file changes
3. **Browser DevTools**: Use React DevTools and Redux DevTools extensions for debugging
4. **MySQL client**: Use `mysql` CLI or GUI tools like MySQL Workbench to inspect data
5. **API testing**: Use Postman or curl to test API endpoints directly

---

## ✅ Checklist

Before starting development, ensure:
- [ ] Node.js v18+ installed
- [ ] MySQL installed and running
- [ ] Backend dependencies installed (`npm install` in backend/)
- [ ] Frontend dependencies installed (`npm install` in frontend/)
- [ ] Database created and migrations run (`npm run migrate`)
- [ ] Database seeded with test data (`npm run seed`)
- [ ] Backend running on port 3000 (`npm run dev` in backend/)
- [ ] Frontend running on port 5173 (`npm run dev` in frontend/)
- [ ] Can login with `admin@projex.com` / `Password@123`

---

## 🆘 Getting Help

If you encounter issues:

1. Check this troubleshooting section first
2. Verify all prerequisites are installed
3. Check terminal error messages for specific details
4. Ensure MySQL is running and accessible
5. Try clearing node_modules and reinstalling
6. Check that both backend and frontend are running

---

Happy coding! 🚀
