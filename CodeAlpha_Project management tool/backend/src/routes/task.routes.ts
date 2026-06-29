import { Router, Request, Response } from "express";
import { prisma } from "../app";
import { io } from "../app";
import { asyncHandler, AppError } from "../middleware/errorHandler";

const router = Router();

// ========== GET ALL TASKS ==========
router.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const { boardId, columnId, status, assigneeId, skip = 0, take = 20 } = req.query;

    const where: any = {};

    if (boardId) where.column = { boardId };
    if (columnId) where.columnId = columnId;
    if (status) where.status = status;
    if (assigneeId) where.assigneeId = assigneeId;

    const tasks = await prisma.task.findMany({
      where,
      skip: parseInt(skip as string),
      take: parseInt(take as string),
      include: {
        assignee: { select: { id: true, name: true, avatar: true, email: true } },
        creator: { select: { id: true, name: true, avatar: true } },
        labels: { include: { label: true } },
        comments: { include: { user: { select: { id: true, name: true, avatar: true } } } },
        attachments: true,
        dependencies: true,
      },
      orderBy: { order: "asc" },
    });

    res.json({
      data: tasks,
      pagination: { skip: parseInt(skip as string), take: parseInt(take as string) },
    });
  })
);

// ========== CREATE TASK ==========
router.post(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const { columnId, title, description, priority, assigneeId, dueDate, storyPoints } = req.body;

    if (!columnId || !title) {
      throw new AppError("Column ID and title are required", 400);
    }

    const column = await prisma.column.findUnique({
      where: { id: columnId },
      include: { board: { include: { project: true } } },
    });

    if (!column) {
      throw new AppError("Column not found", 404);
    }

    const task = await prisma.task.create({
      data: {
        columnId,
        title,
        description,
        priority: priority || "MEDIUM",
        status: "TODO",
        assigneeId,
        creatorId: req.userId!,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        storyPoints,
      },
      include: {
        assignee: { select: { id: true, name: true, avatar: true } },
        creator: { select: { id: true, name: true, avatar: true } },
      },
    });

    // Emit socket event
    io.emit("task:created", task);

    // Create activity log
    await prisma.activityLog.create({
      data: {
        userId: req.userId!,
        projectId: column.board.projectId,
        boardId: column.boardId,
        taskId: task.id,
        action: "created",
        entityType: "Task",
        entityId: task.id,
        changes: JSON.stringify({ title, priority }),
      },
    });

    res.status(201).json(task);
  })
);

// ========== GET TASK BY ID ==========
router.get(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        assignee: { select: { id: true, name: true, avatar: true, email: true } },
        creator: { select: { id: true, name: true, avatar: true } },
        column: { include: { board: true } },
        labels: { include: { label: true } },
        comments: {
          include: { user: { select: { id: true, name: true, avatar: true } } },
          orderBy: { createdAt: "desc" },
        },
        attachments: true,
        dependencies: true,
        dependsOn: true,
        checklists: { orderBy: { order: "asc" } },
      },
    });

    if (!task) {
      throw new AppError("Task not found", 404);
    }

    res.json(task);
  })
);

// ========== UPDATE TASK ==========
router.put(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, description, status, priority, assigneeId, dueDate, storyPoints } = req.body;

    const task = await prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      throw new AppError("Task not found", 404);
    }

    const updated = await prisma.task.update({
      where: { id },
      data: {
        title,
        description,
        status,
        priority,
        assigneeId,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        storyPoints,
      },
      include: {
        assignee: { select: { id: true, name: true, avatar: true } },
        creator: { select: { id: true, name: true, avatar: true } },
      },
    });

    // Emit socket event
    io.emit("task:updated", updated);

    // Create activity log
    await prisma.activityLog.create({
      data: {
        userId: req.userId!,
        taskId: task.id,
        action: "updated",
        entityType: "Task",
        entityId: task.id,
      },
    });

    res.json(updated);
  })
);

// ========== MOVE TASK BETWEEN COLUMNS ==========
router.patch(
  "/:id/move",
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { fromColumnId, toColumnId, order } = req.body;

    if (!toColumnId) {
      throw new AppError("Target column ID is required", 400);
    }

    const task = await prisma.task.update({
      where: { id },
      data: {
        columnId: toColumnId,
        order: order || 0,
      },
      include: {
        assignee: { select: { id: true, name: true, avatar: true } },
      },
    });

    // Emit socket event
    io.emit("task:moved", { task, fromColumnId, toColumnId });

    res.json(task);
  })
);

// ========== DELETE TASK ==========
router.delete(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const task = await prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      throw new AppError("Task not found", 404);
    }

    await prisma.task.delete({
      where: { id },
    });

    io.emit("task:deleted", { id });

    res.json({ message: "Task deleted successfully" });
  })
);

// ========== ADD COMMENT ==========
router.post(
  "/:id/comments",
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { content, mentions } = req.body;

    if (!content) {
      throw new AppError("Comment content is required", 400);
    }

    const comment = await prisma.comment.create({
      data: {
        taskId: id,
        userId: req.userId!,
        content,
        mentions: mentions ? JSON.stringify(mentions) : undefined,
      },
      include: {
        user: { select: { id: true, name: true, avatar: true } },
      },
    });

    io.emit("task:commented", { taskId: id, comment });

    res.status(201).json(comment);
  })
);

// ========== GET TASK COMMENTS ==========
router.get(
  "/:id/comments",
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const comments = await prisma.comment.findMany({
      where: { taskId: id, deletedAt: null },
      include: {
        user: { select: { id: true, name: true, avatar: true } },
        attachments: true,
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(comments);
  })
);

// ========== ADD LABEL TO TASK ==========
router.post(
  "/:id/labels/:labelId",
  asyncHandler(async (req: Request, res: Response) => {
    const { id, labelId } = req.params;

    const taskLabel = await prisma.taskLabel.create({
      data: {
        taskId: id,
        labelId,
      },
      include: { label: true },
    });

    io.emit("task:labelAdded", { taskId: id, label: taskLabel.label });

    res.status(201).json(taskLabel);
  })
);

// ========== REMOVE LABEL FROM TASK ==========
router.delete(
  "/:id/labels/:labelId",
  asyncHandler(async (req: Request, res: Response) => {
    const { id, labelId } = req.params;

    await prisma.taskLabel.delete({
      where: {
        taskId_labelId: {
          taskId: id,
          labelId,
        },
      },
    });

    io.emit("task:labelRemoved", { taskId: id, labelId });

    res.json({ message: "Label removed successfully" });
  })
);

// ========== ADD CHECKLIST ITEM ==========
router.post(
  "/:id/checklists",
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title } = req.body;

    if (!title) {
      throw new AppError("Checklist title is required", 400);
    }

    const checklist = await prisma.checklist.create({
      data: {
        taskId: id,
        title,
      },
    });

    res.status(201).json(checklist);
  })
);

// ========== UPDATE CHECKLIST ITEM ==========
router.patch(
  "/:id/checklists/:checklistId",
  asyncHandler(async (req: Request, res: Response) => {
    const { checklistId } = req.params;
    const { isCompleted, title } = req.body;

    const updated = await prisma.checklist.update({
      where: { id: checklistId },
      data: {
        isCompleted,
        title,
      },
    });

    res.json(updated);
  })
);

// ========== DELETE CHECKLIST ITEM ==========
router.delete(
  "/:id/checklists/:checklistId",
  asyncHandler(async (req: Request, res: Response) => {
    const { checklistId } = req.params;

    await prisma.checklist.delete({
      where: { id: checklistId },
    });

    res.json({ message: "Checklist item deleted successfully" });
  })
);

export default router;
