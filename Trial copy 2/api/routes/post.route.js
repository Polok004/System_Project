import express from "express";
import {verifyToken} from "../Middleware/varifyToken.js";
import { addPost, deletePost, getPost, getPosts, updatePost , addTransaction ,getTransactionsForPost } from "../controllers/post.controller.js";

const router = express.Router();

router.get("/", getPosts);
router.get("/:id", getPost);
router.post("/", verifyToken, addPost);
router.put("/:id", verifyToken, updatePost);
router.delete("/:id", verifyToken, deletePost);

router.post("/:id/transaction", verifyToken, addTransaction);
router.get("/:postId/transactions", verifyToken, getTransactionsForPost);

export default router;
