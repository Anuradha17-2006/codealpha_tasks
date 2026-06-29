# Projex - Getting Started Checklist

## 📋 Pre-Setup Checklist

Before you begin, ensure you have:

- [ ] **Node.js v18+** installed
  - Verify: `node --version`
  - Download: https://nodejs.org/

- [ ] **npm v9+** installed  
  - Verify: `npm --version`
  - (Comes with Node.js)

- [ ] **MySQL v8.0+** installed
  - Verify: `mysql --version`
  - Download: https://dev.mysql.com/downloads/mysql/

- [ ] **Git** installed (optional but recommended)
  - Verify: `git --version`
  - Download: https://git-scm.com

## 🚀 Setup Checklist

- [ ] Extracted projex folder
- [ ] Navigated to project root directory

### Running Setup Script

**Choose your operating system:**

**macOS / Linux:**
```bash
chmod +x quickstart.sh
./quickstart.sh
```
- [ ] Script ran without errors
- [ ] All dependencies installed
- [ ] Database migrations completed

**Windows:**
```bash
quickstart.bat
```
- [ ] Script ran without errors
- [ ] All dependencies installed
- [ ] Database migrations completed

### Manual Setup (if not using script)

- [ ] Installed backend dependencies: `cd backend && npm install`
- [ ] Created backend/.env file (already created)
- [ ] Ran database migrations: `npm run migrate`
- [ ] Seeded database: `npm run seed`
- [ ] Installed frontend dependencies: `cd frontend && npm install`
- [ ] Created frontend/.env.local file (already created)

## ⚙️ Verification Checklist

Before running the app, verify:

### Terminal 1: Backend
```bash
cd backend
npm run dev
```

- [ ] No errors in terminal
- [ ] Message shows: "Server running on http://localhost:3000"
- [ ] Message shows: "API documentation at http://localhost:3000/api/docs"

### Terminal 2: Frontend
```bash
cd frontend
npm run dev
```

- [ ] No errors in terminal
- [ ] Message shows: "ready in XXX ms"
- [ ] Message shows: "http://localhost:5173/"

## 🌐 Access Checklist

### Frontend Application
- [ ] Open browser to: http://localhost:5173
- [ ] Page loads without errors
- [ ] Login page appears

### Login & Access
- [ ] Login with:
  - Email: `admin@projex.com`
  - Password: `Password@123`
- [ ] Successfully logged in
- [ ] Dashboard page loads
- [ ] See "Welcome back, Admin" message

### API Testing
- [ ] Open browser to: http://localhost:3000/api/docs
- [ ] Swagger UI loads
- [ ] Can see API endpoints

## 🎯 First Use Checklist

Once logged in:

- [ ] Dashboard displays stats
- [ ] See list of sample projects
- [ ] Create a new project (click "+ New Project" button)
- [ ] Enter project name and click "Create"
- [ ] See project in list
- [ ] Click project to view board
- [ ] See kanban board with columns
- [ ] Create a new task
- [ ] Drag task between columns
- [ ] See real-time updates work

## 🔍 Troubleshooting Checklist

If something doesn't work:

- [ ] Verified Node.js is installed: `node --version`
- [ ] Verified npm is installed: `npm --version`
- [ ] Verified MySQL is installed: `mysql --version`
- [ ] Verified MySQL is running
- [ ] Checked both server terminals for error messages
- [ ] Verified .env files exist and have correct values
- [ ] Tried clearing node_modules and reinstalling
- [ ] Checked that ports 3000 and 5173 are available
- [ ] Checked firewall settings (if applicable)

## 📖 Documentation Reference

For more details, refer to:

- **[README_LOCAL.md](./README_LOCAL.md)** - Project overview and quick reference
- **[SETUP_LOCAL.md](./SETUP_LOCAL.md)** - Detailed setup instructions and troubleshooting

## 🆘 Common Issues

### "Cannot connect to MySQL"
1. Check MySQL is running
2. Verify DATABASE_URL in backend/.env
3. See "Troubleshooting" section in SETUP_LOCAL.md

### "Port 3000 already in use"
1. Change PORT in backend/.env
2. Update VITE_API_BASE_URL in frontend/.env.local

### "Cannot find module..."
1. Run `npm install` in the affected folder
2. Clear node_modules and reinstall if needed

### "Login fails"
1. Verify backend is running
2. Check API is accessible: http://localhost:3000/health
3. Check browser console for errors (F12)

## ✅ Success Criteria

Your setup is complete when:

- ✅ Backend running on port 3000
- ✅ Frontend running on port 5173
- ✅ Can access http://localhost:5173 in browser
- ✅ Login page appears
- ✅ Can login with admin@projex.com / Password@123
- ✅ Dashboard displays project data
- ✅ Kanban board loads correctly
- ✅ Can create and move tasks

## 🎓 Learning Path

After setup is complete:

1. **Explore the Dashboard** (10 min)
   - View projects and stats
   - See recent notifications

2. **Create a Project** (10 min)
   - Click "New Project"
   - Fill in project details
   - View the created project

3. **Work with Tasks** (15 min)
   - Open a project board
   - Create new tasks
   - Drag tasks between columns
   - Edit task details

4. **Team Collaboration** (10 min)
   - Invite team members
   - Assign tasks
   - Check real-time updates

5. **Explore Features** (20 min)
   - View notifications
   - Check activity logs
   - Manage project settings

## 🚀 Ready to Go!

Once all checklist items are completed, you're ready to:

- ✅ Start using Projex
- ✅ Create projects and tasks
- ✅ Collaborate with team
- ✅ Build and customize the app
- ✅ Deploy to production

---

**Questions?** See [SETUP_LOCAL.md](./SETUP_LOCAL.md) for detailed troubleshooting and instructions.

**Happy Project Managing!** 🎉
