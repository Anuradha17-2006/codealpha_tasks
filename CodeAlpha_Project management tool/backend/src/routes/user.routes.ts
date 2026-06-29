import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../app";
import { asyncHandler, AppError } from "../middleware/errorHandler";

const router = Router();

// ========== GET CURRENT USER ==========
router.get(
  "/me",
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

// ========== UPDATE PROFILE ==========
router.put(
  "/me",
  asyncHandler(async (req: Request, res: Response) => {
    const { name, bio, timezone, avatar } = req.body;

    const user = await prisma.user.update({
      where: { id: req.userId },
      data: {
        name,
        bio,
        timezone,
        avatar,
      },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        role: true,
        bio: true,
        timezone: true,
      },
    });

    res.json(user);
  })
);

// ========== CHANGE PASSWORD ==========
router.post(
  "/me/change-password",
  asyncHandler(async (req: Request, res: Response) => {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword) {
      throw new AppError("Current and new passwords are required", 400);
    }

    if (newPassword !== confirmPassword) {
      throw new AppError("Passwords do not match", 400);
    }

    if (newPassword.length < 8) {
      throw new AppError("Password must be at least 8 characters", 400);
    }

    const user = await prisma.user.findUnique({
      where: { id: req.userId },
    });

    if (!user || !user.password) {
      throw new AppError("User not found", 404);
    }

    // Verify current password
    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      throw new AppError("Current password is incorrect", 401);
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: req.userId },
      data: { password: hashedPassword },
    });

    res.json({ message: "Password changed successfully" });
  })
);

// ========== GET USER BY ID ==========
router.get(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        bio: true,
        timezone: true,
      },
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    res.json(user);
  })
);

// ========== SEARCH USERS ==========
router.get(
  "/search",
  asyncHandler(async (req: Request, res: Response) => {
    const { q } = req.query;

    if (!q || typeof q !== "string") {
      return res.json({ data: [] });
    }

    const users = await prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { email: { contains: q, mode: "insensitive" } },
        ],
        isActive: true,
        id: { not: req.userId },
      },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
      },
      take: 10,
    });

    res.json({ data: users });
  })
);

export default router;
