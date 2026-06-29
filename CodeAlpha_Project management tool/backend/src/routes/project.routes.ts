import { Router, Request, Response } from "express";
import { prisma } from "../app";
import { asyncHandler, AppError } from "../middleware/errorHandler";
import { authorize } from "../middleware/auth";

const router = Router();

// ========== GET ALL PROJECTS ==========
router.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const { skip = 0, take = 10, status, search } = req.query;

    const where: any = {
      members: {
        some: {
          userId: req.userId,
        },
      },
    };

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const projects = await prisma.project.findMany({
      where,
      skip: parseInt(skip as string),
      take: parseInt(take as string),
      include: {
        owner: {
          select: { id: true, name: true, email: true, avatar: true },
        },
        members: {
          include: {
            user: {
              select: { id: true, name: true, avatar: true },
            },
          },
        },
        boards: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const total = await prisma.project.count({ where });

    res.json({
      data: projects,
      pagination: {
        skip: parseInt(skip as string),
        take: parseInt(take as string),
        total,
      },
    });
  })
);

// ========== CREATE PROJECT ==========
router.post(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const { name, description, startDate, endDate, status, priority } = req.body;

    if (!name) {
      throw new AppError("Project name is required", 400);
    }

    // Generate slug
    const slug = name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    const project = await prisma.project.create({
      data: {
        name,
        description,
        slug: `${slug}-${Date.now()}`,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        status: status || "PLANNING",
        priority: priority || "MEDIUM",
        ownerId: req.userId!,
        members: {
          create: {
            userId: req.userId!,
            role: "PROJECT_MANAGER",
            joinedAt: new Date(),
          },
        },
      },
      include: {
        owner: { select: { id: true, name: true, avatar: true } },
        members: { include: { user: { select: { id: true, name: true, avatar: true } } } },
      },
    });

    // Create default board
    await prisma.board.create({
      data: {
        projectId: project.id,
        name: `${project.name} Board`,
        order: 1,
      },
    });

    // Fetch project with boards included
    const projectWithBoards = await prisma.project.findUnique({
      where: { id: project.id },
      include: {
        owner: { select: { id: true, name: true, avatar: true } },
        members: { include: { user: { select: { id: true, name: true, avatar: true } } } },
        boards: true,
      },
    });

    res.status(201).json(projectWithBoards);
  })
);

// ========== GET PROJECT BY ID ==========
router.get(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        owner: { select: { id: true, name: true, email: true, avatar: true } },
        members: {
          include: {
            user: {
              select: { id: true, name: true, avatar: true, email: true },
            },
          },
        },
        boards: {
          include: {
            columns: {
              orderBy: { order: "asc" },
              include: {
                tasks: { orderBy: { order: "asc" } },
              },
            },
          },
        },
        labels: true,
      },
    });

    if (!project) {
      throw new AppError("Project not found", 404);
    }

    // Check access
    const member = project.members.find((m: any) => m.userId === req.userId);
    if (!member && project.visibility === "PRIVATE") {
      throw new AppError("You don't have access to this project", 403);
    }

    res.json(project);
  })
);

// ========== UPDATE PROJECT ==========
router.put(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, description, status, priority, endDate } = req.body;

    // Check access
    const project = await prisma.project.findUnique({
      where: { id },
      include: { members: true },
    });

    if (!project) {
      throw new AppError("Project not found", 404);
    }

    const member = project.members.find((m: any) => m.userId === req.userId);
    if (!member || (member.role !== "PROJECT_MANAGER" && member.role !== "ADMIN")) {
      throw new AppError("You don't have permission to update this project", 403);
    }

    const updated = await prisma.project.update({
      where: { id },
      data: {
        name,
        description,
        status,
        priority,
        endDate: endDate ? new Date(endDate) : undefined,
      },
      include: {
        owner: { select: { id: true, name: true, avatar: true } },
        members: { include: { user: { select: { id: true, name: true, avatar: true } } } },
      },
    });

    res.json(updated);
  })
);

// ========== DELETE PROJECT ==========
router.delete(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      throw new AppError("Project not found", 404);
    }

    // Only owner or admin can delete
    if (project.ownerId !== req.userId) {
      throw new AppError("You don't have permission to delete this project", 403);
    }

    await prisma.project.delete({
      where: { id },
    });

    res.json({ message: "Project deleted successfully" });
  })
);

// ========== ADD TEAM MEMBER ==========
router.post(
  "/:id/members",
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { userId, role } = req.body;

    const project = await prisma.project.findUnique({
      where: { id },
      include: { members: true },
    });

    if (!project) {
      throw new AppError("Project not found", 404);
    }

    // Check if user has permission
    const member = project.members.find((m: any) => m.userId === req.userId);
    if (!member || member.role !== "PROJECT_MANAGER") {
      throw new AppError("You don't have permission to add members", 403);
    }

    // Check if user already a member
    const existingMember = project.members.find((m: any) => m.userId === userId);
    if (existingMember) {
      throw new AppError("User is already a member of this project", 400);
    }

    const newMember = await prisma.projectMember.create({
      data: {
        projectId: id,
        userId,
        role: role || "TEAM_MEMBER",
        joinedAt: new Date(),
      },
      include: {
        user: { select: { id: true, name: true, avatar: true } },
      },
    });

    res.status(201).json(newMember);
  })
);

// ========== REMOVE TEAM MEMBER ==========
router.delete(
  "/:id/members/:userId",
  asyncHandler(async (req: Request, res: Response) => {
    const { id, userId } = req.params;

    const project = await prisma.project.findUnique({
      where: { id },
      include: { members: true },
    });

    if (!project) {
      throw new AppError("Project not found", 404);
    }

    // Check permission
    const member = project.members.find((m: any) => m.userId === req.userId);
    if (!member || member.role !== "PROJECT_MANAGER") {
      throw new AppError("You don't have permission to remove members", 403);
    }

    await prisma.projectMember.delete({
      where: {
        projectId_userId: {
          projectId: id,
          userId,
        },
      },
    });

    res.json({ message: "Member removed successfully" });
  })
);

// ========== GET PROJECT BOARDS ==========
router.get(
  "/:id/boards",
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const boards = await prisma.board.findMany({
      where: { projectId: id },
      include: {
        columns: {
          orderBy: { order: "asc" },
          include: {
            tasks: {
              orderBy: { order: "asc" },
              include: {
                assignee: { select: { id: true, name: true, avatar: true } },
                labels: { include: { label: true } },
              },
            },
          },
        },
      },
      orderBy: { order: "asc" },
    });

    res.json(boards);
  })
);

// ========== GET PROJECT ACTIVITY ==========
router.get(
  "/:id/activity",
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { skip = 0, take = 20 } = req.query;

    const activity = await prisma.activityLog.findMany({
      where: { projectId: id },
      skip: parseInt(skip as string),
      take: parseInt(take as string),
      include: {
        user: { select: { id: true, name: true, avatar: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(activity);
  })
);

export default router;
