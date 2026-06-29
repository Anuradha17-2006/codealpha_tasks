import { Request, Response, NextFunction } from "express";

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const errorHandler = (
  error: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("[Error]", {
    message: error.message,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString(),
  });

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      error: error.code || "Error",
      message: error.message,
      path: req.path,
    });
  }

  // Handle Prisma errors
  if (error.constructor.name === "PrismaClientKnownRequestError") {
    const prismaError = error as any;

    if (prismaError.code === "P2002") {
      return res.status(400).json({
        error: "Conflict",
        message: `A record with this ${prismaError.meta?.target?.[0] || "field"} already exists`,
      });
    }

    if (prismaError.code === "P2025") {
      return res.status(404).json({
        error: "Not Found",
        message: "The requested record was not found",
      });
    }
  }

  // Handle validation errors
  if (error.constructor.name === "ValidationError") {
    return res.status(400).json({
      error: "Validation Error",
      message: error.message,
    });
  }

  // Default error response
  res.status(500).json({
    error: "Internal Server Error",
    message: process.env.NODE_ENV === "production" 
      ? "An unexpected error occurred"
      : error.message,
    ...(process.env.NODE_ENV !== "production" && { stack: error.stack }),
  });
};

// Async error wrapper
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
