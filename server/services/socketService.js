const { User, Message, Conversation, Notification } = require('../models');

const activeUsers = new Map();

const socketService = {
  initialize(io) {
    io.on('connection', (socket) => {
      console.log(`User connected: ${socket.id}`);

      // User comes online
      socket.on('user:online', async (userId) => {
        activeUsers.set(userId, socket.id);
        socket.join(`user:${userId}`);
        socket.broadcast.emit('user:status', { userId, status: 'online' });
      });

      // User goes offline
      socket.on('disconnect', async () => {
        for (let [userId, socketId] of activeUsers) {
          if (socketId === socket.id) {
            activeUsers.delete(userId);
            socket.broadcast.emit('user:status', { userId, status: 'offline' });
            break;
          }
        }
        console.log(`User disconnected: ${socket.id}`);
      });

      // Typing indicator
      socket.on('typing:start', (data) => {
        io.to(`conversation:${data.conversationId}`).emit('user:typing', {
          userId: data.userId,
          conversationId: data.conversationId
        });
      });

      socket.on('typing:stop', (data) => {
        io.to(`conversation:${data.conversationId}`).emit('user:stopped-typing', {
          userId: data.userId,
          conversationId: data.conversationId
        });
      });

      // New message
      socket.on('message:send', async (data) => {
        try {
          const message = await Message.create({
            conversationId: data.conversationId,
            senderId: data.senderId,
            content: data.content,
            messageType: data.messageType || 'text'
          });

          io.to(`conversation:${data.conversationId}`).emit('message:received', {
            id: message.id,
            conversationId: message.conversationId,
            senderId: message.senderId,
            content: message.content,
            timestamp: message.createdAt
          });
        } catch (error) {
          socket.emit('error', { message: 'Failed to send message' });
        }
      });

      // Join conversation room
      socket.on('conversation:join', (conversationId) => {
        socket.join(`conversation:${conversationId}`);
      });

      // Leave conversation room
      socket.on('conversation:leave', (conversationId) => {
        socket.leave(`conversation:${conversationId}`);
      });

      // Message read receipt
      socket.on('message:read', (data) => {
        io.to(`conversation:${data.conversationId}`).emit('message:read-receipt', {
          messageId: data.messageId,
          userId: data.userId
        });
      });

      // Notification
      socket.on('notification:send', (data) => {
        const userSocket = activeUsers.get(data.toUserId);
        if (userSocket) {
          io.to(`user:${data.toUserId}`).emit('notification:new', {
            id: data.id,
            type: data.type,
            message: data.message,
            fromUser: data.fromUser,
            timestamp: new Date()
          });
        }
      });

      // Like/Unlike events
      socket.on('post:liked', (data) => {
        socket.broadcast.emit('post:engagement', {
          postId: data.postId,
          type: 'like',
          count: data.count
        });
      });

      // Comment events
      socket.on('post:commented', (data) => {
        socket.broadcast.emit('post:engagement', {
          postId: data.postId,
          type: 'comment',
          count: data.count
        });
      });

      // Live notifications
      socket.on('follow:new', (data) => {
        io.to(`user:${data.toUserId}`).emit('notification:follow', {
          fromUser: data.fromUser,
          timestamp: new Date()
        });
      });
    });
  }
};

module.exports = socketService;
