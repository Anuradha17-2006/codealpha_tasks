# ConnectSphere - Testing Checklist

## ✅ Backend API Testing

### Health Check
- [ ] GET http://localhost:5000/health
- [ ] Should return: `{"status":"ok",...}`

### Authentication
- [ ] POST /api/v1/auth/register → Create user
- [ ] POST /api/v1/auth/login → Login
- [ ] POST /api/v1/auth/logout → Logout
- [ ] Tokens stored in localStorage

### Users
- [ ] GET /api/v1/users/:id → Get profile
- [ ] PUT /api/v1/users/:id → Update profile
- [ ] GET /api/v1/users/:id/followers → List followers
- [ ] GET /api/v1/users/:id/following → List following

### Posts
- [ ] GET /api/v1/posts → Get posts
- [ ] POST /api/v1/posts → Create post
- [ ] GET /api/v1/posts/:id → Get single post
- [ ] PUT /api/v1/posts/:id → Update post
- [ ] DELETE /api/v1/posts/:id → Delete post

### Engagement
- [ ] POST /api/v1/likes/post/:id → Like post
- [ ] DELETE /api/v1/likes/post/:id → Unlike post
- [ ] POST /api/v1/follow/:id → Follow user
- [ ] DELETE /api/v1/follow/:id → Unfollow user

---

## ✅ Frontend Testing

### Pages Load
- [ ] index.html loads
- [ ] login.html loads and works
- [ ] register.html loads and works
- [ ] home.html loads (after login)
- [ ] profile.html loads
- [ ] messages.html loads
- [ ] notifications.html loads
- [ ] explore.html loads
- [ ] settings.html loads

### Authentication Flow
- [ ] Register form validates
- [ ] Login form validates
- [ ] Passwords stored in localStorage
- [ ] Redirect to home on successful login
- [ ] Redirect to login on logout

### Home Feed
- [ ] Posts load from API
- [ ] Can create new post
- [ ] Like button works
- [ ] Comment button appears
- [ ] Suggested users show
- [ ] Trending section shows

### User Profile
- [ ] Profile info displays
- [ ] Edit profile works
- [ ] Follow/unfollow works
- [ ] Tabs switch correctly
- [ ] Post count shows

### Theme
- [ ] Dark mode toggle works
- [ ] Light mode toggle works
- [ ] Preference saves to localStorage
- [ ] All pages respect theme

### Responsive
- [ ] Mobile view works (< 480px)
- [ ] Tablet view works (480-768px)
- [ ] Desktop view works (> 768px)
- [ ] Navigation responsive
- [ ] Forms responsive

---

## ✅ Database Testing

### Tables Exist
```sql
SHOW TABLES IN connectsphere;
```
- [ ] users
- [ ] posts
- [ ] comments
- [ ] likes
- [ ] followers
- [ ] messages
- [ ] conversations
- [ ] notifications
- [ ] hashtags
- [ ] bookmarks

### Data Operations
- [ ] Can insert user
- [ ] Can insert post
- [ ] Can insert comment
- [ ] Can insert like
- [ ] Can insert follower
- [ ] Can update records
- [ ] Can delete records

---

## ✅ Integration Testing

### Register → Login → Feed
- [ ] Register new user
- [ ] Login with credentials
- [ ] See home feed
- [ ] Create post
- [ ] See post in feed

### Follow → See Posts
- [ ] Follow user
- [ ] See their posts in feed
- [ ] Unfollow user
- [ ] Posts disappear from feed

### Like → See Count
- [ ] Like a post
- [ ] Like count increases
- [ ] Unlike post
- [ ] Like count decreases

### Messages (Structure)
- [ ] Message page loads
- [ ] Conversation list shows
- [ ] Can select conversation
- [ ] Message input ready
- [ ] Send button functional

### Notifications (Structure)
- [ ] Notifications page loads
- [ ] Filter buttons work
- [ ] Notification list displays
- [ ] Mark as read works

---

## ✅ Error Handling

### Invalid Inputs
- [ ] Empty email on login → Error message
- [ ] Invalid password → Error message
- [ ] Duplicate email on register → Error message
- [ ] Weak password on register → Error message

### Not Found
- [ ] Non-existent user ID → 404
- [ ] Non-existent post ID → 404
- [ ] Non-existent route → 404

### Authorization
- [ ] Cannot edit others' posts → 403
- [ ] Cannot delete others' posts → 403
- [ ] Unauthenticated request fails → 401

---

## ✅ Performance

### Load Times
- [ ] Home page loads < 2 seconds
- [ ] Posts load < 1 second
- [ ] Profile loads < 1 second
- [ ] Login loads instantly

### Database
- [ ] Queries execute quickly
- [ ] No N+1 query problems
- [ ] Pagination works for large datasets

### Frontend
- [ ] No console errors
- [ ] No network errors
- [ ] Smooth animations
- [ ] Responsive interactions

---

## ✅ Security

### Authentication
- [ ] Passwords hashed
- [ ] JWT token valid
- [ ] Refresh token works
- [ ] Sessions timeout properly

### Input Validation
- [ ] SQL injection prevented
- [ ] XSS prevented
- [ ] CSRF protected (if applicable)

### CORS
- [ ] Only localhost:3000 allowed
- [ ] Other origins blocked
- [ ] Credentials handled properly

---

## Test Commands

```bash
# Test API endpoints
curl -X GET http://localhost:5000/health
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Test","lastName":"User","email":"test@test.com","username":"testuser","password":"TestPass123","confirmPassword":"TestPass123"}'

# Test database
mysql -u root -p connectsphere
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM posts;

# Test frontend connectivity
# Open browser console and try:
api.get('/users/1')
```

---

**Mark each item as tested and verified!** ✅
