import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";

export const getUsers = async (req, res) => {
  try {
    // Fetch only users with the role 'agent'
    const agents = await prisma.user.findMany({
      where: { role: "agent" },  // Filter by 'agent' role
    });
    res.status(200).json(agents);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get agents!" });
  }
};


export const getUser = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get user!" });
  }
};

export const updateUser = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;
  const { password, avatar, ...inputs } = req.body;

  if (id !== tokenUserId) {
    return res.status(403).json({ message: "Not Authorized!" });
  }

  let updatedPassword = null;
  try {
    if (password) {
      updatedPassword = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...inputs,
        ...(updatedPassword && { password: updatedPassword }),
        ...(avatar && { avatar }),
      },
    });

    const { password: userPassword, ...rest } = updatedUser;

    res.status(200).json(rest);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to update users!" });
  }
};

export const deleteUser = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;

  if (id !== tokenUserId) {
    return res.status(403).json({ message: "Not Authorized!" });
  }

  try {
    await prisma.user.delete({
      where: { id },
    });
    res.status(200).json({ message: "User deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to delete users!" });
  }
};

export const savePost = async (req, res) => {
  const { postId } = req.body;
  const tokenUserId = req.userId;

  try {
    const savedPost = await prisma.savedPost.findUnique({
      where: {
        userId_postId: {
          userId: tokenUserId,
          postId,
        },
      },
    });

    if (savedPost) {
      // Remove saved post
      await prisma.savedPost.delete({
        where: {
          id: savedPost.id,
        },
      });
      res.status(200).json({ message: "Post removed from saved list" });
    } else {
      // Save post
      await prisma.savedPost.create({
        data: {
          userId: tokenUserId,
          postId,
        },
      });
      res.status(200).json({ message: "Post saved" });
    }
  } catch (err) {
    console.error("Error toggling saved post:", err);
    res.status(500).json({ message: "Failed to toggle saved post!" });
  }
};


export const profilePosts = async (req, res) => {
    const tokenUserId = req.userId; // Middleware must set this
    try {
      console.log("Token User ID:", tokenUserId); // Log user ID
      const userPosts = await prisma.post.findMany({
        where: { userId: tokenUserId },
        orderBy: { createdAt: "desc" },
      });
  
     console.log("Fetched User Posts:", userPosts); // Log posts
  
      const saved = await prisma.savedPost.findMany({
        where: { userId: tokenUserId },
        include: {
          post: true,
        },
      });
  
      const savedPosts = saved.map((item) => item.post);
      console.log("Fetched Saved Posts:", savedPosts); 


      const agent = await prisma.agent.findUnique({
        where: { userId: tokenUserId }, // Get the agent for the current user
      });
  
      console.log("Agent Found:", agent); 

       // Fetch transaction posts (both buyer and seller)
    const transactions = await prisma.transaction.findMany({
      where: {
        OR: [
          { buyerId: tokenUserId },
          { agentId: agent?.id }, 
        ],
      },
      include: {
        post: true, // Include the post related to the transaction
      },
    });

    // Create an array of posts that are involved in transactions
    const transactionPosts = transactions.map((item) => item.post);
    if (transactions.length === 0) {
      console.log("No transactions found for this user.");
    }

    console.log("Fetched Transaction Posts:", transactionPosts); // Log transaction posts

  
      return res.status(200).json({ userPosts, savedPosts, transactionPosts, });
    } catch (err) {
      console.error("Error in profilePosts controller:", err);
      res.status(500).json({ message: "Failed to get profile posts!" });
    }
};
 


  export const getNotificationNumber = async (req, res) => {
    const tokenUserId = req.userId;
    try {
      const unreadChats = await prisma.chat.findMany({
        where: {
          userIDs: {
            has: tokenUserId,
          },
          NOT: {
            seenBy: {
              has: tokenUserId,
            },
          },
        },
      });
      
      const number = unreadChats.length;
      res.status(200).json(number);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Failed to get notification count!" });
    }
  };
  export const getAdminStats = async (req, res) => {
    try {
      const usersCount = await prisma.user.count();
      const agentsCount = await prisma.user.count({ where: { role: "agent" } });
      const postsCount = await prisma.post.count();
      const transactionsCount = await prisma.transaction.count();
  
      const stats = {
        users: usersCount,
        agents: agentsCount,
        posts: postsCount,
        transactions: transactionsCount,
      };
  
      res.status(200).json(stats);
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      res.status(500).json({ error: "Failed to fetch admin stats." });
    }
  };
  
  export const getTransactions = async (req, res) => {
    const { page = 1, limit = 5 } = req.query; // Page and limit from query params
    const skip = (page - 1) * limit;
  
    // Convert limit to an integer before using it in Prisma query
    const limitInt = parseInt(limit, 10);
    
    console.log("Fetching transactions:", { page, limit: limitInt, skip }); // Log incoming parameters
  
    try {
      console.log("Fetching transactions...");
      const transactions = await prisma.transaction.findMany({
        skip: skip,
        take: limitInt, // Use the integer value of limit
        orderBy: {
          createdAt: "desc", // Order by latest transaction
        },
        include: {
          post: {
            include: {
              user: true, // Agent info (User) for the post
            },
          },
          agent: true, // Agent info for transaction
          buyer: true, // Buyer info for transaction
        },
      });
      console.log("Transactions fetched:", transactions); // Log transactions
  
      const totalTransactions = await prisma.transaction.count();
      console.log("Total Transactions:", totalTransactions); // Log total count
  
      res.status(200).json({
        transactions,
        totalTransactions,
        totalPages: Math.ceil(totalTransactions / limitInt),
        currentPage: page,
      });
    } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).json({ error: "Failed to fetch transactions." });
    }
  };
  

  const getRevenue = async (period) => {
    let dateFilter;
    const now = new Date();
  
    switch (period) {
      case "daily":
        dateFilter = { createdAt: { gte: new Date(now.setHours(0, 0, 0, 0)) } };  // From midnight today
        break;
      case "weekly":
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));  // Start of current week
        dateFilter = { createdAt: { gte: startOfWeek } };
        break;
      case "monthly":
        const startOfMonth = new Date(now.setDate(1));  // Start of current month
        dateFilter = { createdAt: { gte: startOfMonth } };
        break;
      case "yearly":
        const startOfYear = new Date(now.setMonth(0, 1));  // Start of current year
        dateFilter = { createdAt: { gte: startOfYear } };
        break;
      default:
        dateFilter = {}; // Default to no date filter (all time)
        break;
    }
  
    try {
      const totalRevenue = await prisma.transaction.aggregate({
        _sum: {
          amount: true, // Assuming `amount` is the field storing the transaction amount
        },
        where: dateFilter,
      });
  
      return totalRevenue._sum.amount || 0; // Return total revenue or 0 if no transactions found
    } catch (error) {
      console.error("Error calculating revenue:", error);
      throw error;
    }
  };
  
  export const getFeaturedData = async (req, res) => {
    try {
      const dailyRevenue = await getRevenue("daily");
      const weeklyRevenue = await getRevenue("weekly");
      const monthlyRevenue = await getRevenue("monthly");
      const yearlyRevenue = await getRevenue("yearly");
  
      res.status(200).json({
        dailyRevenue,
        weeklyRevenue,
        monthlyRevenue,
        yearlyRevenue,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch revenue data." });
    }
  };