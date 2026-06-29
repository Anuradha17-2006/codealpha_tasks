import { Socket, Server } from "socket.io";
import { prisma } from "../app";

export const setupTaskSockets = (socket: Socket, io: Server) => {
  // Task update
  socket.on("task:update", async (data: { taskId: string; updates: any }) => {
    try {
      const task = await prisma.task.update({
        where: { id: data.taskId },
        data: data.updates,
        include: {
          assignee: { select: { id: true, name: true, avatar: true } },
        },
      });

      io.emit("task:updated", task);
    } catch (error) {
      socket.emit("error", { message: "Failed to update task" });
    }
  });

  // Task status change
  socket.on("task:changeStatus", async (data: { taskId: string; status: string }) => {
    try {
      const task = await prisma.task.update({
        where: { id: data.taskId },
        data: { status: data.status },
      });

      io.emit("task:statusChanged", { taskId: task.id, status: task.status });
    } catch (error) {
      socket.emit("error", { message: "Failed to update task status" });
    }
  });

  // Task assignment
  socket.on("task:assign", async (data: { taskId: string; assigneeId: string }) => {
    try {
      const task = await prisma.task.update({
        where: { id: data.taskId },
        data: { assigneeId: data.assigneeId },
        include: {
          assignee: { select: { id: true, name: true, avatar: true } },
        },
      });

      io.emit("task:assigned", task);

      // Send notification to assignee
      if (data.assigneeId) {
        await prisma.notification.create({
          data: {
            userId: data.assigneeId,
            type: "TASK_ASSIGNED",
            title: "Task Assigned",
            message: `You were assigned to "${task.title}"`,
            relatedTaskId: task.id,
            relatedUserId: socket.data.userId,
          },
        });

        io.to(`user:${data.assigneeId}`).emit("notification:new", {
          title: "Task Assigned",
          message: `You were assigned to "${task.title}"`,
        });
      }
    } catch (error) {
      socket.emit("error", { message: "Failed to assign task" });
    }
  });

  // Task move (drag and drop)
  socket.on(
    "task:move",
    async (data: { taskId: string; fromColumnId: string; toColumnId: string; order: number }) => {
      try {
        const task = await prisma.task.update({
          where: { id: data.taskId },
          data: {
            columnId: data.toColumnId,
            order: data.order,
          },
        });

        io.emit("task:moved", {
          taskId: task.id,
          fromColumnId: data.fromColumnId,
          toColumnId: data.toColumnId,
          order: data.order,
        });
      } catch (error) {
        socket.emit("error", { message: "Failed to move task" });
      }
    }
  );

  // Task delete
  socket.on("task:delete", async (data: { taskId: string }) => {
    try {
      await prisma.task.delete({
        where: { id: data.taskId },
      });

      io.emit("task:deleted", { taskId: data.taskId });
    } catch (error) {
      socket.emit("error", { message: "Failed to delete task" });
    }
  });

  // Comment added
  socket.on("task:comment", async (data: { taskId: string; content: string }) => {
    try {
      const comment = await prisma.comment.create({
        data: {
          taskId: data.taskId,
          userId: socket.data.userId,
          content: data.content,
        },
        include: {
          user: { select: { id: true, name: true, avatar: true } },
        },
      });

      io.emit("task:commented", {
        taskId: data.taskId,
        comment,
      });

      // Get task to extract mentioned users
      const task = await prisma.task.findUnique({
        where: { id: data.taskId },
      });

      // Extract mentions from content (@username pattern)
      const mentionRegex = /@(\w+)/g;
      const mentions = data.content.match(mentionRegex);

      if (mentions && task) {
        // Send notifications for mentions
        for (const mention of mentions) {
          const mentionedUser = await prisma.user.findFirst({
            where: {
              name: { contains: mention.slice(1), mode: "insensitive" },
            },
          });

          if (mentionedUser) {
            await prisma.notification.create({
              data: {
                userId: mentionedUser.id,
                type: "MENTIONED_IN_COMMENT",
                title: "Mentioned in Comment",
                message: `You were mentioned in "${task.title}"`,
                relatedTaskId: task.id,
                relatedUserId: socket.data.userId,
              },
            });
          }
        }
      }
    } catch (error) {
      socket.emit("error", { message: "Failed to add comment" });
    }
  });

  // Checklist update
  socket.on(
    "task:checklist",
    async (data: { taskId: string; checklistId: string; isCompleted: boolean }) => {
      try {
        const checklist = await prisma.checklist.update({
          where: { id: data.checklistId },
          data: { isCompleted: data.isCompleted },
        });

        io.emit("task:checklistUpdated", {
          taskId: data.taskId,
          checklist,
        });
      } catch (error) {
        socket.emit("error", { message: "Failed to update checklist" });
      }
    }
  );
};
