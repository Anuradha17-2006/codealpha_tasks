import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import rateLimit from "express-rate-limit";

dotenv.config();

import { PrismaClient } from "@prisma/client";

// Import routes
import authRoutes from "./routes/auth.routes";
import projectRoutes from "./routes/project.routes";
import boardRoutes from "./routes/board.routes";
import taskRoutes from "./routes/task.routes";
import notificationRoutes from "./routes/notification.routes";
import userRoutes from "./routes/user.routes";
import searchRoutes from "./routes/search.routes";

// Import middleware
import { errorHandler } from "./middleware/errorHandler";
import { authenticate } from "./middleware/auth";

// Import Socket.IO handlers
import { setupTaskSockets } from "./sockets/taskSocket";
import { setupNotificationSockets } from "./sockets/notificationSocket";

// ========== INITIALIZE ==========
const app: Express = express();
const httpServer = createServer(app);

// Prisma Client
export const prisma = new PrismaClient({
  log: ["warn", "error"],
});

// Socket.IO Setup
export const io = new SocketIOServer(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
});

// ========== MIDDLEWARE ==========

// Security middleware
app.use(helmet());

// CORS
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Body parsers
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Rate limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // Limit login attempts
  skipSuccessfulRequests: true,
});

app.use(generalLimiter);

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ========== ROUTES ==========

// Health check
app.get("/api/v1/health", (req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// API documentation placeholder
app.get("/api/docs", (req: Request, res: Response) => {
  res.json({
    name: "Projex API",
    version: "1.0.0",
    description: "Project Management Platform API",
    baseUrl: "http://localhost:3000/api/v1",
    endpoints: {
      auth: "/auth",
      projects: "/projects",
      boards: "/boards",
      tasks: "/tasks",
      notifications: "/notifications",
      users: "/users",
      search: "/search",
    },
  });
});

// Authentication routes (before auth middleware)
app.use("/api/v1/auth", authLimiter, authRoutes);

// Protected routes
app.use("/api/v1/projects", authenticate, projectRoutes);
app.use("/api/v1/boards", authenticate, boardRoutes);
app.use("/api/v1/tasks", authenticate, taskRoutes);
app.use("/api/v1/notifications", authenticate, notificationRoutes);
app.use("/api/v1/users", authenticate, userRoutes);
app.use("/api/v1/search", authenticate, searchRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: "Not Found",
    message: `The requested endpoint ${req.method} ${req.path} does not exist.`,
    path: req.path,
  });
});

// Error handling middleware
app.use(errorHandler);

// ========== SOCKET.IO SETUP ==========

// Socket.IO middleware for authentication
io.use((socket: Socket, next) => {
  const token = socket.handshake.auth.token;
  
  if (!token) {
    return next(new Error("Authentication token required"));
  }

  // Token validation would happen here
  // For now, we just pass it through
  next();
});

// Socket.IO connection handling
io.on("connection", (socket: Socket) => {
  console.log(`👤 User connected: ${socket.id}`);

  // Setup event handlers
  setupTaskSockets(socket, io);
  setupNotificationSockets(socket, io);

  // User online status
  socket.on("user:online", (userId: string) => {
    socket.data.userId = userId;
    socket.join(`user:${userId}`);
    io.emit("presence:update", {
      userId,
      status: "online",
      timestamp: new Date(),
    });
  });

  // Disconnect handler
  socket.on("disconnect", () => {
    console.log(`👤 User disconnected: ${socket.id}`);
    if (socket.data.userId) {
      io.emit("presence:update", {
        userId: socket.data.userId,
        status: "offline",
        timestamp: new Date(),
      });
    }
  });

  // Error handler
  socket.on("error", (error) => {
    console.error(`Socket error for ${socket.id}:`, error);
  });
});

// ========== STARTUP ==========

const PORT = process.env.PORT || 3000;

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM received, shutting down gracefully");
  httpServer.close(() => {
    console.log("Server closed");
    prisma.$disconnect();
    process.exit(0);
  });
});

process.on("SIGINT", async () => {
  console.log("SIGINT received, shutting down gracefully");
  httpServer.close(() => {
    console.log("Server closed");
    prisma.$disconnect();
    process.exit(0);
  });
});

export { app, httpServer };
