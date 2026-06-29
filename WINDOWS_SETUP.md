# ConnectSphere - Windows Setup Guide

## 📋 Prerequisites

✅ Node.js 14+ installed ([Download](https://nodejs.org))
✅ MySQL Server running
✅ Git (optional)

---

## 🚀 Step-by-Step Setup

### Step 1: Extract Project
```
Right-click connectsphere_fixed.zip
→ Extract All...
→ Choose location (e.g., Desktop or C:\Projects)
```

### Step 2: Open Project Folder
```
Navigate to the extracted connectsphere folder
Win + E → Find the folder → Right-click → Open
```

### Step 3: Install Backend Dependencies

**Option A: Using Command Prompt (Recommended)**
```
1. Right-click folder → Open in Terminal
2. Type: cd server
3. Type: npm install
4. Wait for installation to complete (2-3 minutes)
```

**Option B: Using PowerShell**
```
1. Right-click folder → Open PowerShell here
2. Type: cd server
3. Type: npm install
```

### Step 4: Create MySQL Database

**Option A: Using MySQL Command Line**
```
1. Open Command Prompt
2. Type: mysql -u root -p
3. Enter your MySQL password
4. Run these commands:
   CREATE DATABASE connectsphere;
   USE connectsphere;
   exit;
```

**Option B: Using MySQL Workbench (GUI)**
```
1. Open MySQL Workbench
2. Click + (create new connection)
3. Right-click connection → Create Schema
4. Name: connectsphere
5. Click Apply
```

### Step 5: Configure Environment Variables

1. Open `connectsphere\server\.env` in Notepad
2. Update these values:
```
NODE_ENV=development
PORT=5000
HOST=localhost

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=connectsphere

JWT_SECRET=your_secret_key_123
JWT_REFRESH_SECRET=your_refresh_key_123
```
3. Save the file

### Step 6: Seed Database (EASIEST WAY)

**Easy Method - Double-Click Script:**
```
1. In connectsphere folder, find SEED.bat
2. Double-click SEED.bat
3. Wait for "Seeding completed successfully!" message
4. Press any key to close
```

**Manual Method - If SEED.bat doesn't work:**
```
1. Open Command Prompt in server folder
2. Type: node seed.js
3. Wait for completion
```

### Step 7: Start Server

**Option A: Using Command Prompt**
```
1. In server folder, open Command Prompt
2. Type: npm run dev
3. You should see: "Server running on http://localhost:5000"
```

**Option B: Using Terminal in VS Code**
```
1. Open server folder in VS Code
2. Press Ctrl + `
3. Type: npm run dev
```

### Step 8: Test Login

1. Open browser → http://localhost:5000/pages/login.html
2. Login with:
   ```
   Email: alice@example.com
   Password: password123
   ```

---

## 🎯 Test Users After Seeding

| Email | Password | User |
|-------|----------|------|
| alice@example.com | password123 | Alice (Developer) |
| bob@example.com | password123 | Bob (Designer) |
| carol@example.com | password123 | Carol (Tech Blogger) |
| david@example.com | password123 | David (Engineer) |
| emma@example.com | password123 | Emma (Creative) |

---

## ✅ What to Test After Setup

1. **Poll Feature**
   - Home page → Click "📊 Poll" button
   - Enter question and options
   - Poll text appears in post

2. **Emoji Feature**
   - Home page → Click "😊 Emoji" button
   - Click any emoji
   - Emoji appears in post

3. **Profile Upload**
   - Go to Profile → Edit Profile
   - Select profile picture
   - Upload should work

4. **Search**
   - Go to Explore page
   - Type in search box
   - Results should appear instantly

5. **Profile Tabs**
   - Click Posts/Media/Likes tabs
   - Content should load

---

## 🐛 Troubleshooting

### Issue: "Cannot find module './seeds/seedData'"
**Solution:**
```
Make sure you're in the server directory:
cd server
node seed.js
```

### Issue: Database connection error
**Solution:**
1. Check MySQL is running
2. Verify credentials in .env file
3. Verify database is created:
   - mysql -u root -p
   - SHOW DATABASES;
   - exit;

### Issue: "Port 5000 is already in use"
**Solution:**
```
Change PORT in .env to 5001 or 5002
Then restart the server
```

### Issue: npm install failed
**Solution:**
```
1. Delete server/node_modules folder
2. Delete server/package-lock.json
3. Run: npm install again
```

### Issue: SEED.bat doesn't work
**Solution:**
```
1. Open Command Prompt
2. cd to server folder
3. Type: node seed.js
```

### Issue: Still having problems?
**Solution:**
1. Check browser console (F12)
2. Check server terminal for errors
3. Verify .env file is configured
4. Make sure MySQL is running
5. Check file permissions

---

## 🎨 File Structure

```
connectsphere/
├── SEED.bat ← Double-click to seed database
├── server/
│   ├── seed.js ← Seed runner (Windows-friendly)
│   ├── server.js ← Start this (npm run dev)
│   ├── package.json
│   ├── .env ← Configure this
│   ├── seeds/
│   │   └── seedData.js ← Sample data
│   └── ... (other server files)
├── client/
│   ├── pages/
│   │   └── login.html ← Start here
│   └── ... (other client files)
└── ... (documentation files)
```

---

## 📞 Common Commands

### From connectsphere\server folder:

```
# Install dependencies
npm install

# Seed database
node seed.js

# Start development server
npm run dev

# Stop server
Ctrl + C
```

---

## ⚡ If You Want to Skip the Terminal

**Easy Mode - Use SEED.bat:**
1. Double-click `SEED.bat` to seed database
2. Run `npm run dev` to start server
3. Open browser to `http://localhost:5000`

---

## 🎊 You're All Set!

Once you see:
```
✅ Seeding completed successfully!
Server running on http://localhost:5000
```

You can:
1. Open browser → http://localhost:5000/pages/login.html
2. Login with alice@example.com / password123
3. Test all features!

---

## 📚 More Help

- Read **FEATURES_GUIDE.md** for feature usage
- Check **CHANGELOG_v2.md** for technical details
- Review **UPDATE_SUMMARY.md** for what's new

---

**Happy Coding! 🚀**

*Last Updated: June 29, 2026*
