
import express from "express";
import {
  getChats,
  getChat,
  addChat,
  readChat,
} from "../controllers/chat.controller.js";
import { verifyToken } from "../Middleware/varifyToken.js";

const router = express.Router();

// Define chat-related routes
router.get("/", verifyToken, getChats); // Get all chats
router.get("/:id", verifyToken, getChat); // Get a specific chat
router.post("/", verifyToken, addChat); // Add a new chat
router.put("/read/:id", verifyToken, readChat); // Mark a chat as read

export default router;