
import prisma from "../lib/prisma.js";

export const submitAgentApplication = async (req, res) => {
    try {
      const { userId, bio, National_ID, experience, phone, website, Service_Area, address } = req.body;
  
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
  
      // Check if the user already has an application
      const existingAgent = await prisma.agent.findUnique({
        where: { userId },
      });
  
      if (existingAgent) {
        return res.status(400).json({ message: "You have already submitted an application." });
      }
  
      // Create a new agent application if no existing application is found
      const agent = await prisma.agent.create({
        data: {
          userId, // Associate the agent with a specific user
          bio,
          National_ID,
          experience,
          phone,
          website,
          Service_Area,
          address,
          status: "PENDING",
        },
      });
  
      res.status(201).json({ message: "Application submitted successfully! Pending admin approval.", agent });
    } catch (error) {
      console.error("Error submitting agent application:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  
  export const handleAgentApproval = async (req, res) => {
    const { agentId, action } = req.body; // `action` can be "approve" or "reject"
  
    try {
      const agent = await prisma.agent.findUnique({
        where: { id: agentId },
      });
  
      if (!agent) {
        return res.status(404).json({ message: "Agent application not found." });
      }
  
      if (action === "approve") {
        await prisma.agent.update({
          where: { id: agentId },
          data: { status: "APPROVED" },
        });
  
        await prisma.user.update({
          where: { id: agent.userId },
          data: { role: "agent" }, // Update user role to "agent"
        });
  
        return res.status(200).json({ message: "Application approved successfully." });
      } else if (action === "reject") {
        await prisma.agent.update({
          where: { id: agentId },
          data: { status: "REJECTED" },
        });
  
        return res.status(200).json({ message: "Application rejected successfully." });
      } else {
        return res.status(400).json({ message: "Invalid action." });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error." });
    }
  };
  

  export const getPendingAgentApplications = async (req, res) => {
    try {
      console.log("Fetching pending agent applications...");
      const pendingApplications = await prisma.agent.findMany({
        where: { status: "PENDING" },
        include: {
          user: { // Optionally include user details
            select: {
              username: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
  
      console.log("Pending applications fetched:", pendingApplications);
      res.status(200).json(pendingApplications);
    } catch (error) {
      console.error("Error fetching pending agent applications:", error);
      res.status(500).json({ message: "Failed to fetch pending applications." });
    }
  };
  

  export const getAgentProfile = async (req, res) => {
    try {
      const agent = await prisma.agent.findUnique({
        where: { userId: req.params.id },
        include: {
          user: {
            select: {
              username: true,
              email: true,
              avatar: true,
              posts: {
                select: {
                  id: true,
                  title: true,
                  price: true,
                  images: true,
                  address: true,
                  city: true,
                  bedroom: true,
                  bathroom: true,
                },
              },
            },
          },
        },
      });
  
      if (!agent) {
        return res.status(404).json({ message: "Agent not found" });
      }
  
      res.status(200).json(agent);
    } catch (error) {
      console.error("Error fetching agent profile:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  