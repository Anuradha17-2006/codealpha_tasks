# ConnectSphere - Updated Features Guide

## ✅ New Features Implemented

### 1. **Home Page - Poll & Emoji Support**
- ✅ Poll button: Opens modal to create polls with multiple options
- ✅ Emoji button: Interactive emoji picker with 16 common emojis
- ✅ Both features integrate content into posts
- ✅ Suggested users section shows 3 random users to follow
- ✅ Trending tags section with clickable hashtags

### 2. **Profile Page - Complete Overhaul**
- ✅ **Profile Picture Upload**: Edit modal now includes file upload input
- ✅ **Posts Tab**: Displays all user posts with engagement metrics
- ✅ **Media Tab**: Shows only posts with images
- ✅ **Likes Tab**: Displays posts liked by the user
- ✅ Dynamic content loading when switching between tabs
- ✅ Beautiful profile card design with stats

### 3. **Explore Page - Full Search**
- ✅ Real-time search with debounce (300ms)
- ✅ Filter by: All, Users, Posts, Hashtags
- ✅ Search results show both users and posts
- ✅ Trending section with clickable hashtags
- ✅ Direct navigation from results

### 4. **Database Seeding**
- ✅ 5 sample users with realistic profiles
- ✅ 8 sample posts with engagement data
- ✅ Follow relationships between users
- ✅ Ready-to-use test credentials

---

## 🚀 Quick Start

### Prerequisites
- Node.js 14+
- MySQL Server running
- Frontend: Modern browser

### Installation & Setup

#### 1. Extract the ConnectSphere ZIP
```bash
unzip connectsphere_fixed.zip
cd connectsphere
```

#### 2. Install Backend Dependencies
```bash
cd server
npm install
```

#### 3. Configure Environment
Edit `.env` file in `/server`:
```
NODE_ENV=development
PORT=5000
HOST=localhost

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=connectsphere

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key

# Email (Optional)
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

#### 4. Create Database
```bash
# Login to MySQL
mysql -u root -p

# Run in MySQL CLI
CREATE DATABASE connectsphere;
USE connectsphere;
```

#### 5. Seed Sample Data
```bash
# From /server directory
node -e "require('./seeds/seedData')().then(() => process.exit(0)).catch(err => { console.error(err); process.exit(1); })"
```

Or create a simple seed runner script:
```bash
# Create server/seed.js
const seedDatabase = require('./seeds/seedData');
const { sequelize } = require('./models/index_fixed');

sequelize.sync({ force: false }).then(() => {
    seedDatabase().then(() => {
        console.log('Seeding complete');
        process.exit(0);
    });
});
```

Then run:
```bash
node seed.js
```

#### 6. Start Backend Server
```bash
npm run dev
# Server will run on http://localhost:5000
```

#### 7. Test Login Credentials
After seeding, use these to login:

| Email | Password | Role |
|-------|----------|------|
| alice@example.com | password123 | Developer |
| bob@example.com | password123 | Designer |
| carol@example.com | password123 | Tech Blogger |
| david@example.com | password123 | Engineer |
| emma@example.com | password123 | Creative |

---

## 📋 Feature Usage

### Creating a Poll
1. On Home page, click **Poll** button
2. Enter poll question
3. Add poll options (minimum 2)
4. Click "Create Poll"
5. Content is added to your post

### Using Emoji Picker
1. On Home page, click **Emoji** button
2. Click desired emoji
3. Modal closes and emoji is inserted into post

### Profile Picture Upload
1. Go to Profile page
2. Click "Edit Profile"
3. Select "Profile Picture" input
4. Choose image file (recommended 400x400px)
5. Update other profile info as needed
6. Click "Save Changes"

### Search Functionality
1. Go to Explore page
2. Type in search bar (searches as you type)
3. Use filter buttons: All, Users, Posts, Hashtags
4. Click trending hashtags to search
5. Click user results to visit profile

### View Profile Tabs
1. Go to your Profile
2. Click different tabs:
   - **Posts**: All your posts
   - **Media**: Posts with images
   - **Likes**: Posts you've liked
3. Content loads dynamically

---

## 📊 Database Schema

### Sample Data Includes:

**Users (5)**
- Alice Johnson - @alice_dev
- Bob Smith - @bob_designer
- Carol Davis - @carol_tech
- David Wilson - @david_code
- Emma Brown - @emma_creative

**Posts (8)**
- Technology discussions
- Career updates
- Project showcases
- Design tips
- Learning updates

**Follows**
- Complete follow graph with all users connected
- Multiple follower/following relationships

---

## 🎨 UI/UX Features

### Modal Styling
- Smooth fade-in animation
- Responsive design
- Close on escape key
- Professional appearance

### Emoji Picker
- 16 common emojis
- Hover animations
- Scales on hover
- Color change on selection

### Search Results
- User results with avatars
- Post snippets with author info
- Instant filtering
- Debounced search for performance

### Profile Tabs
- Smooth tab switching
- Dynamic content loading
- Empty state messages
- Engagement metrics displayed

---

## 🐛 Troubleshooting

### Search Not Working
- Check API is running on port 5000
- Verify search routes exist in backend
- Check browser console for errors

### Profile Picture Upload Failed
- Ensure file size < 5MB
- Use supported formats (JPG, PNG, GIF)
- Check backend file upload configuration

### Seed Data Not Loading
- Verify database is created
- Check database credentials in .env
- Run migrations if needed
- Check database permissions

### Polls/Emoji Not Showing in Post
- Clear browser cache
- Refresh page
- Check JavaScript console for errors
- Verify home.js is loaded

---

## 📱 Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## 🔐 Security Notes
- Change JWT secrets in production
- Use HTTPS in production
- Implement rate limiting
- Add CSRF protection
- Validate file uploads

---

## 📞 Support
For issues, check:
1. Browser console (F12)
2. Backend server logs
3. Database connection
4. File permissions

---

**Last Updated**: June 2026
**Version**: 2.0 (Updated Features)
