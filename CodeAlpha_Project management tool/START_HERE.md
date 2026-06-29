# 🚀 Projex - START HERE

Welcome to **Projex**, a modern project management platform!

This is a **local development version** (no Docker required). Follow the steps below to get started.

## ⚡ Quick Start (5 minutes)

### Step 1: Prerequisites
Make sure you have installed:
- **Node.js** v18+ ([Download](https://nodejs.org))
- **MySQL** v8.0+ ([Download](https://dev.mysql.com/downloads/mysql/))

Verify installations:
```bash
node --version    # Should show v18+
npm --version     # Should show v9+
mysql --version   # Should show v8.0+
```

### Step 2: Run Setup Script

Choose your operating system:

**macOS / Linux:**
```bash
chmod +x quickstart.sh
./quickstart.sh
```

**Windows:**
```bash
quickstart.bat
```

This script will:
- ✓ Verify prerequisites
- ✓ Install all dependencies
- ✓ Setup and seed the database
- ✓ Show instructions for running the app

### Step 3: Start the Application

The setup script will tell you to run these commands in **separate terminal windows**:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Step 4: Open in Browser

Visit: **http://localhost:5173**

Login with:
```
Email: admin@projex.com
Password: Password@123
```

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| **README_LOCAL.md** | Project overview, features, and architecture |
| **SETUP_LOCAL.md** | Detailed step-by-step setup and troubleshooting |
| **CHECKLIST.md** | Verification checklist for setup |
| **quickstart.sh** | Automatic setup script (macOS/Linux) |
| **quickstart.bat** | Automatic setup script (Windows) |

## 🎯 What to Read First

1. **If you want the fastest way to get running:**
   - Run `quickstart.sh` (macOS/Linux) or `quickstart.bat` (Windows)
   - Follow the script output
   - Jump to "Open in Browser" above

2. **If you want detailed step-by-step instructions:**
   - Read: [SETUP_LOCAL.md](./SETUP_LOCAL.md)
   - Follow each section carefully

3. **If something breaks:**
   - Check: [SETUP_LOCAL.md - Troubleshooting](./SETUP_LOCAL.md#-troubleshooting)
   - Or: [CHECKLIST.md - Troubleshooting](./CHECKLIST.md#-troubleshooting-checklist)

4. **If you want to learn about the project:**
   - Read: [README_LOCAL.md](./README_LOCAL.md)

## 🆘 Troubleshooting

### MySQL not starting?
```bash
# macOS
brew services start mysql

# Linux
sudo systemctl start mysql

# Windows
# Open Services (services.msc) and start "MySQL80"
```

### Port already in use?
Edit `backend/.env` and change:
```
PORT=3001
```
Then update `frontend/.env.local`:
```
VITE_API_BASE_URL=http://localhost:3001
```

### Dependencies failing to install?
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Still stuck?
See [SETUP_LOCAL.md - Troubleshooting](./SETUP_LOCAL.md#-troubleshooting) for detailed solutions.

## 📁 Project Structure

```
projex-no-docker/
├── backend/                # Express.js API server
├── frontend/               # React application
├── README_LOCAL.md         # Project overview
├── SETUP_LOCAL.md          # Detailed setup guide
├── CHECKLIST.md            # Setup verification checklist
├── quickstart.sh           # Setup script (macOS/Linux)
├── quickstart.bat          # Setup script (Windows)
└── START_HERE.md          # This file!
```

## ✨ Features

- 🔐 **Authentication** - Secure login with JWT
- 📊 **Dashboard** - Overview of projects and tasks
- 📁 **Projects** - Organize work into projects
- 🎯 **Tasks** - Kanban board with drag-and-drop
- 👥 **Teams** - Collaborate with team members
- 🔔 **Notifications** - Real-time updates
- 📱 **Responsive** - Works on desktop, tablet, mobile
- 🎨 **Modern UI** - Clean, intuitive design

## 🔑 Default Accounts

After setup, you can login with:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@projex.com | Password@123 |
| Manager | manager@projex.com | Password@123 |
| Developer | developer@projex.com | Password@123 |

## 🌐 Access Points

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:3000 |
| API Docs | http://localhost:3000/api/docs |

## ⚙️ Development Commands

### Backend
```bash
cd backend
npm run dev           # Start development server
npm run build         # Build for production
npm run typecheck     # Check types
npm run migrate       # Run database migrations
npm run seed          # Seed database with test data
```

### Frontend
```bash
cd frontend
npm run dev           # Start development server
npm run build         # Build for production
npm run preview       # Preview production build
npm run type-check    # Check types
```

## 🎓 Next Steps After Setup

1. ✅ Explore the dashboard
2. ✅ Create your first project
3. ✅ Add team members
4. ✅ Create and organize tasks
5. ✅ Use the kanban board
6. ✅ Enable real-time collaboration

## 💡 Pro Tips

- Keep both backend and frontend running in separate terminals
- Use browser DevTools (F12) to see network requests
- Check backend logs for API errors
- Database file is at `/var/lib/mysql/` (Linux/Mac) or `C:\ProgramData\MySQL\` (Windows)

## 📞 Need Help?

1. **Check troubleshooting guides:**
   - [SETUP_LOCAL.md](./SETUP_LOCAL.md#-troubleshooting)
   - [CHECKLIST.md](./CHECKLIST.md)

2. **Verify prerequisites:**
   - Node.js v18+
   - npm v9+
   - MySQL v8.0+ (running)

3. **Check error messages:**
   - Read terminal output carefully
   - Check browser console (F12)

4. **Reset everything:**
   ```bash
   # Backend
   cd backend
   rm -rf node_modules
   npm install
   npm run migrate -- reset
   npm run seed
   ```

## 🚀 Ready?

**Let's get started!**

```bash
# macOS/Linux
./quickstart.sh

# Windows
quickstart.bat
```

Then open: **http://localhost:5173**

---

**Questions?** Read the documentation files or check the troubleshooting sections.

**Happy Project Managing!** 🎉
