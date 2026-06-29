# ConnectSphere Frontend

Complete frontend for the ConnectSphere social media platform.

## 📁 File Structure

```
client/
├── index.html                 # Landing page
├── pages/                     # Application pages
│   ├── login.html            # Login page
│   ├── register.html         # Registration page
│   ├── forgot-password.html  # Password reset request
│   ├── reset-password.html   # Password reset form
│   ├── home.html             # Home feed page
│   ├── profile.html          # User profile page
│   ├── messages.html         # Direct messaging
│   ├── notifications.html    # Notifications page
│   ├── explore.html          # Search & discovery
│   └── settings.html         # User settings
│
├── css/                       # Stylesheets
│   ├── styles.css            # Main styles
│   ├── auth.css              # Auth page styles
│   ├── home.css              # Home page styles
│   ├── profile.css           # Profile page styles
│   ├── messages.css          # Messages page styles
│   ├── notifications.css     # Notifications styles
│   ├── explore.css           # Explore page styles
│   ├── settings.css          # Settings page styles
│   └── responsive.css        # Mobile responsive
│
└── js/                        # JavaScript
    ├── api.js                # API client
    ├── auth.js               # Authentication logic
    ├── main.js               # Main utilities
    ├── home.js               # Home page logic
    ├── profile.js            # Profile page logic
    ├── messages.js           # Messages page logic
    ├── notifications.js      # Notifications logic
    ├── explore.js            # Explore page logic
    └── settings.js           # Settings page logic
```

## 🚀 Quick Start

### Option 1: Open in Browser
```bash
# Simply open index.html in your web browser
# The frontend will connect to the backend API at http://localhost:5000
```

### Option 2: Local Server
```bash
# Using Python
python -m http.server 3000

# Using Node.js
npx http-server -p 3000

# Using Live Server (VS Code)
# Right-click on index.html > Open with Live Server
```

## 📄 Pages Overview

### Authentication Pages
- **index.html** - Landing page with feature showcase
- **login.html** - User login form
- **register.html** - User registration form
- **forgot-password.html** - Password reset request
- **reset-password.html** - Password reset with token

### Application Pages
- **home.html** - Home feed with posts and suggestions
- **profile.html** - User profile with tabs (posts, media, likes, bookmarks)
- **messages.html** - Direct messaging interface with conversations
- **notifications.html** - Notification feed with filters
- **explore.html** - Search and trending discovery
- **settings.html** - User settings and preferences

## 🔗 API Integration

All pages connect to the backend API using the `APIClient` class in `js/api.js`.

### API Configuration
```javascript
// In api.js
const api = new APIClient();
// Default: http://localhost:5000/api/v1
```

### Making API Calls
```javascript
// Get data
const response = await api.get('/users/123');

// Post data
const response = await api.post('/posts', { content: 'Hello!' });

// Update data
const response = await api.put('/users/123', { bio: 'New bio' });

// Delete data
const response = await api.delete('/posts/123');
```

## 🎨 Styling

### CSS Variables (in styles.css)
```css
--primary-color: #007bff
--secondary-color: #6c757d
--danger-color: #dc3545
--success-color: #28a745
--light-color: #f8f9fa
--dark-color: #343a40
--border-radius: 8px
--shadow-sm: light shadow
--shadow-md: medium shadow
--shadow-lg: heavy shadow
```

### Dark Mode
Add `dark-mode` class to body element:
```javascript
document.body.classList.toggle('dark-mode');
```

### Responsive Breakpoints
- **1024px and below** - Tablet view
- **768px and below** - Mobile view
- **480px and below** - Small mobile view

## 🔐 Authentication

### Login Flow
1. User enters email and password
2. API returns access token and refresh token
3. Tokens stored in localStorage
4. All API requests include Authorization header
5. Automatic token refresh on expiration

### Token Management
```javascript
// Tokens are stored in localStorage
localStorage.getItem('accessToken')
localStorage.getItem('refreshToken')
localStorage.getItem('user')

// Clear on logout
localStorage.removeItem('accessToken')
localStorage.removeItem('refreshToken')
localStorage.removeItem('user')
```

## 📱 Mobile Responsive

All pages are fully responsive:
- Mobile-first design
- Flexible layouts
- Touch-friendly buttons
- Adaptive navigation
- Image optimization

## 🛠 Utilities

### UIHelper Class (in auth.js)
```javascript
// Show toast notification
UIHelper.showToast('Message', 'success|error|info|warning');

// Show field error
UIHelper.showError('fieldId', 'Error message');

// Clear all errors
UIHelper.clearAllErrors();

// Set button loading state
UIHelper.setButtonLoading('buttonId', true|false);
```

### Validator Class (in auth.js)
```javascript
Validator.email(email)           // Validate email
Validator.password(password)     // Validate password strength
Validator.username(username)     // Validate username format
Validator.name(name)             // Validate name length
```

### checkAuth Function (in auth.js)
```javascript
const auth = checkAuth();
// Returns: { isAuthenticated: boolean, user: object, token: string }
```

## 🔄 Real-time Features

### WebSocket Integration
Currently uses Socket.IO client for real-time features:
- Live messaging
- Typing indicators
- Online/offline status
- Real-time notifications

### Setup Socket.IO (in messages.js)
```javascript
// Initialize WebSocket connection
const socket = io('http://localhost:5000');

// Listen for events
socket.on('message:received', (data) => {
    // Handle incoming message
});

// Emit events
socket.emit('message:send', {
    conversationId: id,
    content: message
});
```

## 🎯 Features Checklist

### Implemented
- ✅ User authentication (login, register, password reset)
- ✅ User profiles with edit capability
- ✅ Home feed with posts
- ✅ Post creation and engagement (like, comment)
- ✅ Direct messaging with conversations
- ✅ Notifications system
- ✅ User search and discovery
- ✅ Settings and preferences
- ✅ Dark/Light theme toggle
- ✅ Mobile responsive design

### TODO / Future Features
- 🔲 Real-time Socket.IO integration
- 🔲 Image upload for profiles and posts
- 🔲 Stories (24-hour disappearing content)
- 🔲 Hashtag support
- 🔲 @mentions functionality
- 🔲 Post sharing/retweets
- 🔲 Following/followers UI
- 🔲 User verification badges
- 🔲 Analytics dashboard
- 🔲 PWA installation support

## 🚨 Common Issues

### CORS Errors
**Problem:** API requests blocked by CORS policy
**Solution:** Ensure backend CORS is configured:
```javascript
// In server.js
cors: {
    origin: 'http://localhost:3000',
    credentials: true
}
```

### Blank Page
**Problem:** No content displays
**Solution:** 
1. Open browser console (F12)
2. Check for JavaScript errors
3. Verify API URL is correct
4. Check if backend is running

### Images Not Loading
**Problem:** Profile pictures or post images show broken
**Solution:**
1. Check file paths are correct
2. Ensure uploads folder exists on backend
3. Verify image permissions

## 📚 API Documentation

For complete API documentation, see `docs/API.md` in the root directory.

## 🤝 Contributing

To contribute to the frontend:
1. Create a new branch
2. Make your changes
3. Test on mobile and desktop
4. Submit a pull request

## 📝 License

MIT License - See LICENSE file for details

---

**ConnectSphere Frontend v1.0.0**
Built with ❤️ using HTML, CSS, and Vanilla JavaScript
