import bcrypt from "bcrypt";
import prisma from "./lib/prisma.js"; // Adjust the path

async function main() {
  const hashedPasswordAdmin = await bcrypt.hash("111", 10);
  const hashedPasswordAgent = await bcrypt.hash("111", 10);

  // Create Admin if not exists
  const admin = await prisma.user.upsert({
    where: { email: "admin1@gmail.com" },
    update: {},
    create: {
      email: "admin1@example.com",
      username: "admin1",
      password: hashedPasswordAdmin,
      role: "admin",
    },
  });

  // Create Agent if not exists
  const agent = await prisma.user.upsert({
    where: { email: "agent1@gmail.com" },
    update: {},
    create: {
      email: "agent1@example.com",
      username: "agent1",
      password: hashedPasswordAgent,
      role: "agent",
    },
  });

  console.log("Admin and Agent added or updated:", { admin, agent });
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
