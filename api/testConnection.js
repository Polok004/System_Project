// api/testConnection.js
import prisma from "./lib/prisma.js";

async function testConnection() {
  try {
    const users = await prisma.user.findMany();
    console.log("Connected successfully. Current users:", users);
  } catch (error) {
    console.error("Failed to connect to the database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
