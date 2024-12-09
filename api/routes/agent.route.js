import express from "express";
import { submitAgentApplication, handleAgentApproval, getPendingAgentApplications,getAgentProfile 

} from "../controllers/agent.controller.js";
import {verifyToken} from "../Middleware/varifyToken.js";

const router = express.Router();

router.post("/be_an_agent",verifyToken, submitAgentApplication);
router.get("/pending", verifyToken,getPendingAgentApplications); // Fetch pending applications
router.post("/approve", verifyToken,handleAgentApproval); 
router.get("/:id", getAgentProfile);
// router.get("/", getAgents); // Fetch agents with optional filters
// router.get("/:id", getAgentById);


export default router;
