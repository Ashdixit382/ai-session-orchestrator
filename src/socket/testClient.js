import { io } from "socket.io-client";
import config from "../config/index.js";

const socket = io("http://localhost:3000", {
  auth: {
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2YTgyZGIyMDIxNWI5ODNhNjYxNDhlMTYiLCJpYXQiOjE3ODkzNjYzMTIsImV4cCI6MTc4OTQ1MjcxMn0.xEGyPaL_vU0pUWBPMHskrOs2QWSMo6pz_nWvvLLJ9XA",
  },
});

socket.on("conversation:joined", (conversationId) => {
  console.log("Joined:", conversationId);
});

socket.on("conversation:left", (conversationId) => {
  console.log("Left:", conversationId);
});

socket.on("message:new", (data) => {
  console.log("New message:", data);
});

socket.on("ai:Response", (data) => {
  console.log("New message:", data);
});

socket.on("connect", () => {
  console.log("Connected to server");
  console.log("Socket ID:", socket.id);

  socket.emit("conversation:join", "6a8e6bc838f386034328a1a0");

  setTimeout(() => {
    socket.emit("message:test", "6a8e6bc838f386034328a1a0");
  }, 3000);
});

socket.on("disconnect", (reason) => {
  console.log("Disconnected:", reason);
});

socket.on("connect_error", (error) => {
  console.log("⚠️ Connection error:", error.message);
});
