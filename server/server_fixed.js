require('dotenv').config();
require('express-async-errors');

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');
const rateLimit = require('express-rate-limit');

// Database
const {
  sequelize,
  User,
  Post,
  Comment,
  Like,
  Follower,
  Message,
  Conversation,
  Notification
} = require('./models/index_fixed');

// Routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const postRoutes = require('./routes/post.routes');
const commentRoutes = require('./routes/comment.routes');
const likeRoutes = require('./routes/like.routes');
const followRoutes = require('./routes/follow.routes');
const notificationRoutes = require('./routes/notification.routes');
const messageRoutes = require('./routes/message.routes');
const searchRoutes = require('./routes/search.routes');
const adminRoutes = require('./routes/admin.routes');

// Middleware
const errorHandler = require('./middleware/errorHandler');
const requestLogger = require('./middleware/requestLogger');

const app = express();
const server = http.createServer(app);

// ================== CORS ==================

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:8081",
  "http://127.0.0.1:8081",
  "http://10.99.120.131:8081"
];
// ================== SOCKET.IO ==================

const io = socketIo(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true
  }
});

// ================== MIDDLEWARE ==================

app.use(helmet());

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.log("Blocked Origin:", origin);
    callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({
  extended: true,
  limit: '10mb'
}));

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use(requestLogger);

// ================== RATE LIMIT ==================

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests. Please try again later.'
});

app.use('/api', limiter);

// ================== ROUTES ==================

const apiVersion = process.env.API_VERSION || 'v1';
const baseRoute = `/api/${apiVersion}`;

app.use(`${baseRoute}/auth`, authRoutes);
app.use(`${baseRoute}/users`, userRoutes);
app.use(`${baseRoute}/posts`, postRoutes);
app.use(`${baseRoute}/comments`, commentRoutes);
app.use(`${baseRoute}/likes`, likeRoutes);
app.use(`${baseRoute}/follow`, followRoutes);
app.use(`${baseRoute}/notifications`, notificationRoutes);
app.use(`${baseRoute}/messages`, messageRoutes);
app.use(`${baseRoute}/search`, searchRoutes);
app.use(`${baseRoute}/admin`, adminRoutes);

// ================== HEALTH ==================

app.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// ================== SOCKET EVENTS ==================

io.on('connection', (socket) => {
  console.log('User Connected:', socket.id);

  socket.on('user:online', (userId) => {
    socket.join(`user:${userId}`);
  });

  socket.on('conversation:join', (conversationId) => {
    socket.join(`conversation:${conversationId}`);
  });

  socket.on('message:send', (data) => {
    io.to(`conversation:${data.conversationId}`)
      .emit('message:received', data);
  });

  socket.on('disconnect', () => {
    console.log('User Disconnected:', socket.id);
  });
});

// ================== ERROR HANDLING ==================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl
  });
});

app.use(errorHandler);

// ================== START SERVER ==================

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || 'localhost';

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');

    await sequelize.sync({ alter: false });
    console.log('✅ Database synced');

    server.listen(PORT, HOST, () => {
      console.log(`
=========================================
🚀 ConnectSphere Server Started
=========================================
Server      : http://${HOST}:${PORT}
Health      : http://${HOST}:${PORT}/health
API         : http://${HOST}:${PORT}${baseRoute}
Environment : ${process.env.NODE_ENV}
Database    : ${process.env.DB_NAME}
=========================================
`);
    });

  } catch (err) {
    console.error('❌ Failed to start server');
    console.error(err);
    process.exit(1);
  }
}

startServer();

// ================== SHUTDOWN ==================

process.on('SIGINT', async () => {
  console.log('\nStopping server...');

  await sequelize.close();

  server.close(() => {
    console.log('Server stopped.');
    process.exit(0);
  });
});

module.exports = {
  app,
  server,
  io
};