import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      userId?: string;
      user?: {
        id: string;
        email: string;
        role: string;
      };
    }
  }
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "No authentication token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "default-secret") as {
      id: string;
      email: string;
      role: string;
    };

    req.userId = decoded.id;
    req.user = decoded;

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        error: "Token Expired",
        message: "Your session has expired. Please login again.",
      });
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        error: "Invalid Token",
        message: "The provided token is invalid.",
      });
    }

    return res.status(401).json({
      error: "Authentication Failed",
      message: "An error occurred during authentication",
    });
  }
};

// Role-based access control middleware
export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "User information not found",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: "Forbidden",
        message: `This action requires one of these roles: ${roles.join(", ")}`,
      });
    }

    next();
  };
};

// Optional authentication - doesn't fail if no token
export const optionalAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "default-secret") as {
        id: string;
        email: string;
        role: string;
      };

      req.userId = decoded.id;
      req.user = decoded;
    }

    next();
  } catch (error) {
    // Ignore auth errors for optional auth
    next();
  }
};
