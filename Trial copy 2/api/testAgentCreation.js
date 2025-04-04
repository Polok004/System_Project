import prisma from "./lib/prisma.js";



async function createAgent() {
  try {
    const agent = await prisma.agent.create({
      data: {
        userId: "6724c120655f709d2a0e066a", // Replace with a valid userId from your database
        bio: "Test Bio",
        National_ID: "123456789",
        experience: 5,
        phone: "1234567890",
        Service_Area: "Test Area",
        address: "Test Address",
        status: "PENDING",
      },
    });
    console.log("Agent Created Successfully:", agent);
  } catch (error) {
    console.error("Error Creating Agent:", error);
  } finally {
    await prisma.$disconnect(); // Disconnect Prisma client after execution
  }
}

createAgent();
