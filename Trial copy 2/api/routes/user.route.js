import express from "express";
import {
  deleteUser,
  getUser,
  getUsers,
  updateUser,
  savePost,
  profilePosts,
  getNotificationNumber,
  getAdminStats,
  getTransactions,
  getFeaturedData
} from "../controllers/user.controller.js";
import {verifyToken} from "../Middleware/varifyToken.js";

const router = express.Router();

router.get("/", getUsers);
//router.get("/:id", verifyToken, getUser);
router.put("/:id", verifyToken, updateUser);
router.delete("/:id", verifyToken, deleteUser);
//router.post("/save", verifyToken, savePost);
router.get("/profilePosts", verifyToken, profilePosts);
router.get("/notification", verifyToken, getNotificationNumber);
router.post("/save", verifyToken, savePost);
//router.delete("/unsave", verifyToken, unsavePost);
//router.get("/saved-status", verifyToken, getSavedStatus);

//router.post("/transaction/save", verifyToken, saveTransaction);
router.get("/admin/stats", verifyToken, getAdminStats);
router.get("/admin/transactions",verifyToken, getTransactions);
router.get("/revenue/featured", verifyToken, getFeaturedData);
export default router;