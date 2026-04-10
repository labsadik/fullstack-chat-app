// src/lib/socket.js

import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

// store online users
const userSocketMap = {}; // { userId: socketId }

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

// get receiver socket id
export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // ✅ use auth instead of query
  const userId = socket.handshake.auth.userId;

  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  // send online users to all
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);

    // remove user safely
    for (const key in userSocketMap) {
      if (userSocketMap[key] === socket.id) {
        delete userSocketMap[key];
        break;
      }
    }

    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };