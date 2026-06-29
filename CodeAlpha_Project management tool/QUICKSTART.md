# 🚀 Projex - Quick Start Guide

## Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- MySQL 8.0+ (or compatible)
- Redis (optional, can be mocked)

## 1️⃣ Database Setup

### Option A: Using MySQL (Recommended)

```bash
# Create database
mysql -u root -p
CREATE DATABASE projex_dev;
CREATE USER 'projex_user'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON projex_dev.* TO 'projex_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Option B: Docker (if available)

```bash
docker run -d \
  --name projex-mysql \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=projex_dev \
  -p 3306:3306 \
  mysql:8.0
```

## 2️⃣ Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure environment
# Edit .env if needed:
# - DATABASE_URL=mysql://root:@localhost:3306/projex_dev
# - PORT=3000
# - JWT_SECRET (change in production)

# Build
npm run build

# Run development server
npm run dev

# Alternative: Run production build
npm run start
```

Expected output:
```
🚀 Server running on http://localhost:3000
📚 API Docs: http://localhost:3000/api/docs
🔌 WebSocket: ws://localhost:3000
```

## 3️⃣ Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
# Edit .env.local if needed:
# - VITE_API_BASE_URL=http://localhost:3000
# - VITE_SOCKET_URL=http://localhost:3000

# Build (optional, for production)
npm run build

# Run development server
npm run dev
```

Expected output:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

## 4️⃣ Access the Application

1. Open browser: `http://localhost:5173`
2. Login with demo credentials:
   - Email: `admin@projex.com`
   - Password: `Password@123`

## 🛠️ Troubleshooting

### Backend Won't Start
```bash
# Check if port 3000 is already in use
lsof -i :3000
# Kill process: kill -9 <PID>

# Verify environment
echo $DATABASE_URL
```

### Frontend Won't Connect
- Check `.env.local` - VITE_API_BASE_URL should be `http://localhost:3000`
- Verify backend is running on port 3000
- Check browser console for CORS errors

### Database Connection Error
- Verify MySQL is running: `mysql -u root -p -e "SELECT 1"`
- Check DATABASE_URL in `.env`
- Verify database `projex_dev` exists: `SHOW DATABASES;`

### Missing Dependencies
```bash
# Force clean install
rm -rf node_modules package-lock.json
npm install
```

## 📦 Building for Production

```bash
# Backend
cd backend
npm run build
NODE_ENV=production npm run start

# Frontend
cd frontend
npm run build
# Serve dist folder with your web server (nginx, apache, etc.)
```

## 🔐 Important Security Notes

1. Change `JWT_SECRET` and `JWT_REFRESH_SECRET` in `.env`
2. Update database credentials
3. Configure CORS_ORIGIN to your domain
4. Enable HTTPS in production
5. Use environment-specific `.env` files

## 📚 API Documentation

Once backend is running, visit: `http://localhost:3000/api/docs`

## 🐛 Need Help?

Check these files for more information:
- `README.md` - Project overview
- `ISSUES_AND_FIXES_APPLIED.md` - What was fixed
- `backend/.env` - Backend configuration options
- `frontend/.env.local` - Frontend configuration options

## ✅ Verification Checklist

- [ ] Database created and running
- [ ] Backend installs and builds successfully
- [ ] Frontend installs and builds successfully
- [ ] Backend starts on port 3000
- [ ] Frontend starts on port 5173
- [ ] Can access http://localhost:5173
- [ ] Can login with provided credentials
- [ ] Can see dashboard
- [ ] Can create/view projects

Once all items are checked, your Projex instance is ready! 🎉
