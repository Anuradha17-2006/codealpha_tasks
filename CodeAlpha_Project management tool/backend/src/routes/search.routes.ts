import { Router, Request, Response } from "express";
import { prisma } from "../app";
import { asyncHandler } from "../middleware/errorHandler";

const router = Router();

// ========== GLOBAL SEARCH ==========
router.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const { q, type } = req.query;

    if (!q || typeof q !== "string") {
      return res.json({
        projects: [],
        tasks: [],
        boards: [],
        users: [],
      });
    }

    const searchQuery = {
      contains: q,
      mode: "insensitive" as const,
    };

    let projects: any[] = [];
    let tasks: any[] = [];
    let boards: any[] = [];
    let users: any[] = [];

    if (!type || type === "projects") {
      projects = await prisma.project.findMany({
        where: {
          members: {
            some: {
              userId: req.userId,
            },
          },
          OR: [
            { name: searchQuery },
            { description: searchQuery },
          ],
        },
        select: {
          id: true,
          name: true,
          description: true,
          slug: true,
        },
        take: 5,
      });
    }

    if (!type || type === "tasks") {
      tasks = await prisma.task.findMany({
        where: {
          column: {
            board: {
              project: {
                members: {
                  some: {
                    userId: req.userId,
                  },
                },
              },
            },
          },
          OR: [
            { title: searchQuery },
            { description: searchQuery },
          ],
        },
        select: {
          id: true,
          title: true,
          priority: true,
          status: true,
          assigneeId: true,
        },
        take: 5,
      });
    }

    if (!type || type === "boards") {
      boards = await prisma.board.findMany({
        where: {
          project: {
            members: {
              some: {
                userId: req.userId,
              },
            },
          },
          name: searchQuery,
        },
        select: {
          id: true,
          name: true,
          projectId: true,
        },
        take: 5,
      });
    }

    if (!type || type === "users") {
      users = await prisma.user.findMany({
        where: {
          isActive: true,
          id: { not: req.userId },
          OR: [
            { name: searchQuery },
            { email: searchQuery },
          ],
        },
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
        },
        take: 5,
      });
    }

    res.json({
      projects,
      tasks,
      boards,
      users,
    });
  })
);

export default router;
