import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "../app";
import { asyncHandler, AppError } from "../middleware/errorHandler";
import { authenticate } from "../middleware/auth";

const router = Router();

// ========== REGISTER ==========
router.post(
  "/register",
  asyncHandler(async (req: Request, res: Response) => {
    const { email, name, password, confirmPassword } = req.body;

    // Validation
    if (!email || !name || !password) {
      throw new AppError("Email, name, and password are required", 400);
    }

    if (password !== confirmPassword) {
      throw new AppError("Passwords do not match", 400);
    }

    if (password.length < 8) {
      throw new AppError("Password must be at least 8 characters", 400);
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      throw new AppError("User with this email already exists", 400);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        name,
        password: hashedPassword,
        emailVerificationToken: uuidv4(),
      },
    });

    // Generate tokens
    const accessToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "default-secret",
      { expiresIn: "24h" }
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET || "default-refresh-secret",
      { expiresIn: "7d" }
    );

    // Save refresh token
    await prisma.session.create({
      data: {
        userId: user.id,
        refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        userAgent: req.headers["user-agent"],
        ipAddress: req.ip,
      },
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      accessToken,
      refreshToken,
    });
  })
);

// ========== LOGIN ==========
router.post(
  "/login",
  asyncHandler(async (req: Request, res: Response) => {
    const { email, password, rememberMe } = req.body;

    // Validation
    if (!email || !password) {
      throw new AppError("Email and password are required", 400);
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user || !user.password) {
      throw new AppError("Invalid email or password", 401);
    }

    // Check if user is active
    if (!user.isActive) {
      throw new AppError("This account has been deactivated", 403);
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new AppError("Invalid email or password", 401);
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    // Generate tokens
    const accessToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "default-secret",
      { expiresIn: "24h" }
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET || "default-refresh-secret",
      { expiresIn: rememberMe ? "30d" : "7d" }
    );

    // Save refresh token
    await prisma.session.create({
      data: {
        userId: user.id,
        refreshToken,
        expiresAt: new Date(
          Date.now() + (rememberMe ? 30 : 7) * 24 * 60 * 60 * 1000
        ),
        userAgent: req.headers["user-agent"],
        ipAddress: req.ip,
      },
    });

    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
      },
      accessToken,
      refreshToken,
    });
  })
);

// ========== REFRESH TOKEN ==========
router.post(
  "/refresh",
  asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new AppError("Refresh token is required", 400);
    }

    // Verify refresh token
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET || "default-refresh-secret"
    ) as { id: string };

    // Find session
    const session = await prisma.session.findUnique({
      where: { refreshToken },
    });

    if (!session || session.expiresAt < new Date()) {
      throw new AppError("Invalid or expired refresh token", 401);
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    // Generate new access token
    const newAccessToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "default-secret",
      { expiresIn: "24h" }
    );

    res.json({
      accessToken: newAccessToken,
    });
  })
);

// ========== LOGOUT ==========
router.post(
  "/logout",
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    if (refreshToken) {
      await prisma.session.deleteMany({
        where: {
          userId: req.userId,
          refreshToken,
        },
      });
    }

    res.json({ message: "Logout successful" });
  })
);

// ========== LOGOUT EVERYWHERE ==========
router.post(
  "/logout-everywhere",
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    await prisma.session.deleteMany({
      where: { userId: req.userId },
    });

    res.json({ message: "Logged out from all devices" });
  })
);

// ========== FORGOT PASSWORD ==========
router.post(
  "/forgot-password",
  asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;

    if (!email) {
      throw new AppError("Email is required", 400);
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      // Don't reveal if email exists
      return res.json({
        message: "If an account with this email exists, a password reset link will be sent",
      });
    }

    // Generate reset token
    const resetToken = uuidv4();
    const resetTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: resetToken,
        passwordResetExpires: resetTokenExpiry,
      },
    });

    // TODO: Send email with reset link
    // sendPasswordResetEmail(user.email, resetToken)

    res.json({
      message: "If an account with this email exists, a password reset link will be sent",
    });
  })
);

// ========== RESET PASSWORD ==========
router.post(
  "/reset-password",
  asyncHandler(async (req: Request, res: Response) => {
    const { token, password, confirmPassword } = req.body;

    if (!token || !password) {
      throw new AppError("Token and password are required", 400);
    }

    if (password !== confirmPassword) {
      throw new AppError("Passwords do not match", 400);
    }

    if (password.length < 8) {
      throw new AppError("Password must be at least 8 characters", 400);
    }

    // Find user with valid reset token
    const user = await prisma.user.findFirst({
      where: {
        passwordResetToken: token,
        passwordResetExpires: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      throw new AppError("Invalid or expired reset token", 400);
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update password and clear reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null,
      },
    });

    res.json({ message: "Password reset successfully" });
  })
);

// ========== ME (GET CURRENT USER) ==========
router.get(
  "/me",
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        role: true,
        bio: true,
        timezone: true,
        emailVerified: true,
        isActive: true,
      },
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    res.json(user);
  })
);

export default router;
