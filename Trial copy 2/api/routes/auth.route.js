import express from "express";
import { login, logout, register } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

//router.get("/auth/refresh", refreshToken); 
// router.get("/google", googleAuth);
// router.get("/google/callback", googleCallback);


export default router;