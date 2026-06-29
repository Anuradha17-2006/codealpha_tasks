import { Router, Request, Response } from "express";
import { prisma } from "../app";
import { asyncHandler, AppError } from "../middleware/errorHandler";

const router = Router();

// ========== GET NOTIFICATIONS ==========
router.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const { skip = 0, take = 20, isRead } = req.query;

    const where: any = {
      userId: req.userId,
    };

    if (isRead !== undefined) {
      where.isRead = isRead === "true";
    }

    const notifications = await prisma.notification.findMany({
      where,
      skip: parseInt(skip as string),
      take: parseInt(take as string),
      orderBy: { createdAt: "desc" },
    });

    const total = await prisma.notification.count({ where });

    res.json({
      data: notifications,
      pagination: {
        skip: parseInt(skip as string),
        take: parseInt(take as string),
        total,
      },
    });
  })
);

// ========== MARK AS READ ==========
router.patch(
  "/:id/read",
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const notification = await prisma.notification.update({
      where: { id },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    res.json(notification);
  })
);

// ========== MARK ALL AS READ ==========
router.patch(
  "/mark-all-read",
  asyncHandler(async (req: Request, res: Response) => {
    await prisma.notification.updateMany({
      where: {
        userId: req.userId,
        isRead: false,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    res.json({ message: "All notifications marked as read" });
  })
);

// ========== DELETE NOTIFICATION ==========
router.delete(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    await prisma.notification.delete({
      where: { id },
    });

    res.json({ message: "Notification deleted successfully" });
  })
);

// ========== GET UNREAD COUNT ==========
router.get(
  "/count/unread",
  asyncHandler(async (req: Request, res: Response) => {
    const count = await prisma.notification.count({
      where: {
        userId: req.userId,
        isRead: false,
      },
    });

    res.json({ unreadCount: count });
  })
);

export default router;
