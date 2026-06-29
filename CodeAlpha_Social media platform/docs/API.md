# ConnectSphere API Documentation

Complete API reference for ConnectSphere backend.

## Base URL

- **Development**: `http://localhost:5000/api/v1`
- **Production**: `https://api.connectsphere.com/api/v1`

## Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <accessToken>
```

## Response Format

All responses follow this format:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

## Common Status Codes
- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `429` - Too Many Requests
- `500` - Server Error

## Key Endpoints

### Auth
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/logout` - Logout user
- `POST /auth/verify-email` - Verify email
- `POST /auth/forgot-password` - Send reset email
- `POST /auth/reset-password` - Reset password
- `POST /auth/refresh-token` - Refresh access token

### Users
- `GET /users/:id` - Get user profile
- `PUT /users/:id` - Update profile
- `DELETE /users/:id` - Delete account
- `GET /users/:id/followers` - Get followers
- `GET /users/:id/following` - Get following

### Posts
- `GET /posts` - Get feed
- `POST /posts` - Create post
- `GET /posts/:id` - Get post
- `PUT /posts/:id` - Update post
- `DELETE /posts/:id` - Delete post
- `POST /posts/:id/bookmark` - Bookmark post

### Engagement
- `POST /likes/post/:postId` - Like post
- `DELETE /likes/post/:postId` - Unlike post
- `GET /comments/:postId` - Get comments
- `POST /comments` - Create comment
- `PUT /comments/:id` - Update comment
- `DELETE /comments/:id` - Delete comment

### Follow
- `POST /follow/:userId` - Follow user
- `DELETE /follow/:userId` - Unfollow user
- `POST /follow/:userId/block` - Block user

### Notifications
- `GET /notifications` - Get notifications
- `PUT /notifications/:id/read` - Mark as read
- `DELETE /notifications/:id` - Delete notification

### Messages
- `GET /messages/conversations` - Get conversations
- `POST /messages/conversations/:userId` - Create conversation
- `GET /messages/conversations/:conversationId` - Get messages
- `POST /messages` - Send message

### Search
- `GET /search` - Global search
- `GET /search/users` - Search users
- `GET /search/posts` - Search posts
- `GET /search/hashtags` - Search hashtags

### Admin
- `GET /admin/users` - Get all users
- `PUT /admin/users/:id/suspend` - Suspend user
- `GET /admin/reports` - Get reports
- `PUT /admin/reports/:id/resolve` - Resolve report
- `GET /admin/analytics` - Get analytics

---

For complete details, see code documentation.
