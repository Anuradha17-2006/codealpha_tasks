import { Socket, Server } from "socket.io";
import { prisma } from "../app";

export const setupNotificationSockets = (socket: Socket, io: Server) => {
  // Join user's notification room
  socket.on("notification:join", (userId: string) => {
    socket.join(`user:${userId}`);
  });

  // Send notification
  socket.on(
    "notification:send",
    async (data: {
      userId: string;
      type: string;
      title: string;
      message: string;
      relatedTaskId?: string;
    }) => {
      try {
        const notification = await prisma.notification.create({
          data: {
            userId: data.userId,
            type: data.type as any,
            title: data.title,
            message: data.message,
            relatedTaskId: data.relatedTaskId,
          },
        });

        // Send to specific user
        io.to(`user:${data.userId}`).emit("notification:new", notification);
      } catch (error) {
        socket.emit("error", { message: "Failed to send notification" });
      }
    }
  );

  // Mark notification as read
  socket.on("notification:read", async (notificationId: string) => {
    try {
      await prisma.notification.update({
        where: { id: notificationId },
        data: {
          isRead: true,
          readAt: new Date(),
        },
      });

      socket.emit("notification:marked", { notificationId });
    } catch (error) {
      socket.emit("error", { message: "Failed to mark notification as read" });
    }
  });

  // Mark all notifications as read
  socket.on("notification:readAll", async (userId: string) => {
    try {
      await prisma.notification.updateMany({
        where: {
          userId,
          isRead: false,
        },
        data: {
          isRead: true,
          readAt: new Date(),
        },
      });

      socket.emit("notification:allMarked");
    } catch (error) {
      socket.emit("error", { message: "Failed to mark all notifications as read" });
    }
  });

  // Get unread count
  socket.on("notification:getUnreadCount", async (userId: string) => {
    try {
      const count = await prisma.notification.count({
        where: {
          userId,
          isRead: false,
        },
      });

      socket.emit("notification:unreadCount", { count });
    } catch (error) {
      socket.emit("error", { message: "Failed to get unread count" });
    }
  });

  // Delete notification
  socket.on("notification:delete", async (notificationId: string) => {
    try {
      await prisma.notification.delete({
        where: { id: notificationId },
      });

      socket.emit("notification:deleted", { notificationId });
    } catch (error) {
      socket.emit("error", { message: "Failed to delete notification" });
    }
  });

  // Typing indicator
  socket.on("notification:typing", (data: { taskId: string; userId: string; typing: boolean }) => {
    io.emit("presence:typing", data);
  });

  // User status
  socket.on("user:status", (data: { userId: string; status: "online" | "away" | "offline" }) => {
    io.emit("presence:status", data);
  });
};
