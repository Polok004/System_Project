import express from "express";
import { createBlog, getAllBlogs,getBlogById } from "../controllers/blog.controller.js";
import { verifyToken } from "../Middleware/varifyToken.js"; // The middleware to verify JWT

const router = express.Router();

// Route to create a new blog (requires authentication)
router.post("/", verifyToken, createBlog); // Ensure the user is logged in

// Route to get all blogs (no authentication required)
router.get("/", getAllBlogs);
router.get('/:id',verifyToken, getBlogById);

export default router;
