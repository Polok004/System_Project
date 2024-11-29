import express from "express";
import { submitAgentApplication, handleAgentApproval, getPendingAgentApplications } from "../controllers/agent.controller.js";
import {verifyToken} from "../Middleware/varifyToken.js";

const router = express.Router();

router.post("/be_an_agent",verifyToken, submitAgentApplication);
router.get("/pending", verifyToken,getPendingAgentApplications); // Fetch pending applications
router.post("/approve", verifyToken,handleAgentApproval); 


export default router;
