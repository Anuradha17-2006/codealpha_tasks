import { Router, Request, Response } from "express";
import { prisma } from "../app";
import { asyncHandler, AppError } from "../middleware/errorHandler";

const router = Router();

// ========== GET BOARD ==========
router.get(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const board = await prisma.board.findUnique({
      where: { id },
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
        project: true,
      },
    });

    if (!board) {
      throw new AppError("Board not found", 404);
    }

    res.json(board);
  })
);

// ========== UPDATE BOARD ==========
router.put(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, description } = req.body;

    const board = await prisma.board.update({
      where: { id },
      data: { name, description },
    });

    res.json(board);
  })
);

// ========== CREATE COLUMN ==========
router.post(
  "/:id/columns",
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, color } = req.body;

    if (!name) {
      throw new AppError("Column name is required", 400);
    }

    const column = await prisma.column.create({
      data: {
        boardId: id,
        name,
        color,
        order: 0,
      },
    });

    res.status(201).json(column);
  })
);

// ========== UPDATE COLUMN ==========
router.put(
  "/:id/columns/:columnId",
  asyncHandler(async (req: Request, res: Response) => {
    const { columnId } = req.params;
    const { name, color, order, wipLimit } = req.body;

    const column = await prisma.column.update({
      where: { id: columnId },
      data: { name, color, order, wipLimit },
    });

    res.json(column);
  })
);

// ========== DELETE COLUMN ==========
router.delete(
  "/:id/columns/:columnId",
  asyncHandler(async (req: Request, res: Response) => {
    const { columnId } = req.params;

    await prisma.column.delete({
      where: { id: columnId },
    });

    res.json({ message: "Column deleted successfully" });
  })
);

// ========== REORDER COLUMNS ==========
router.patch(
  "/:id/columns/reorder",
  asyncHandler(async (req: Request, res: Response) => {
    const { columns } = req.body;

    if (!Array.isArray(columns)) {
      throw new AppError("Columns array is required", 400);
    }

    const updated = await Promise.all(
      columns.map((col, index) =>
        prisma.column.update({
          where: { id: col.id },
          data: { order: index },
        })
      )
    );

    res.json(updated);
  })
);

export default router;
