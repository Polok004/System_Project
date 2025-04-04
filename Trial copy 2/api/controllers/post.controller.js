import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";

// Get all posts based on query parameters
export const getPosts = async (req, res) => {
  const query = req.query;
  const tokenUserId = req.userId; // Ensure this comes from verifyToken middleware

  try {
    const posts = await prisma.post.findMany({
      where: {
        userId: tokenUserId, // Fetch posts created by the logged-in user (agent)
        city: query.city || undefined,
        type: query.type || undefined,
        property: query.property || undefined,
        bedroom: parseInt(query.bedroom) || undefined,
        price: {
          gte: parseInt(query.minPrice) || undefined,
          lte: parseInt(query.maxPrice) || undefined,
        },
      },
    });

    res.status(200).json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get posts" });
  }
};


// Get a specific post by ID
export const getPost = async (req, res) => {
  const id = req.params.id;

  if (!id || id.length !== 24) {
    return res.status(400).json({ message: "Invalid ID format" });
  }

  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        postDetail: true,
        user: {
          select: { username: true, avatar: true },
        },
      },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const token = req.cookies?.token;

    if (token) {
      return jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
        if (err) return res.status(401).json({ message: "Invalid token" });

        const saved = await prisma.savedPost.findUnique({
          where: { userId_postId: { postId: id, userId: payload.id } },
        });

        return res.status(200).json({ ...post, isSaved: !!saved });
      });
    }

    res.status(200).json({ ...post, isSaved: false });
  } catch (err) {
    console.error("Error fetching post:", err);
    res.status(500).json({ message: "Failed to get post" });
  }
};


// Add a new post
export const addPost = async (req, res) => {
  const body = req.body;
  const tokenUserId = req.userId;

  try {
    const newPost = await prisma.post.create({
      data: {
        ...body.postData,
        userId: tokenUserId,
        postDetail: {
          create: body.postDetail,
        },
      },
    });
    res.status(200).json(newPost);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create post" });
  }
};

// Update an existing post
export const updatePost = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId; // From authentication middleware
  const { postData, postDetail } = req.body;

  try {
    const post = await prisma.post.findUnique({ where: { id } });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.userId !== tokenUserId) {
      return res.status(403).json({ message: "Not Authorized!" });
    }

    // Update the post
    await prisma.post.update({
      where: { id },
      data: postData,
    });

    // Update post details
    await prisma.postDetail.updateMany({
      where: { postId: id },
      data: postDetail,
    });

    res.status(200).json({ message: "Post updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update post" });
  }
};


export const deletePost = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId; // Set in verifyToken middleware

  console.log({ id, tokenUserId }); // Debug: Log request details

  try {
    // Find the post
    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      console.log("Post not found");
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if the user owns the post
    if (post.userId !== tokenUserId) {
      console.log("Unauthorized delete attempt", { postUserId: post.userId, tokenUserId });
      return res.status(403).json({ message: "Not Authorized!" });
    }

    // Delete the post
    await prisma.post.delete({ where: { id } });
    console.log("Post deleted successfully");
    res.status(200).json({ message: "Post deleted" });
  } catch (err) {
    console.error("Error in deletePost:", err);
    res.status(500).json({ message: "Failed to delete post" });
  }
};

// Add a transaction for a post
export const addTransaction = async (req, res) => {
  const { postId, buyerId, time, date } = req.body;

  console.log("Request Body:", req.body);

  try {
    // Validate input fields
    if (!postId || !buyerId || !time || !date) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if the post exists
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        user: true, // Fetch the user who created the post
      },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if the post is already in a transaction
    const existingTransaction = await prisma.transaction.findFirst({
      where: { postId },
    });

    if (existingTransaction) {
      return res.status(400).json({ message: "This post is already sold" });
    }

    // Validate the buyer exists
    const buyer = await prisma.user.findUnique({
      where: { id: buyerId },
    });

    if (!buyer) {
      return res.status(404).json({ message: "Buyer not found" });
    }

    // Validate that the provided time and date are in the correct format
    const transactionDateTime = new Date(`${date}T${time}`);
    if (isNaN(transactionDateTime.getTime())) {
      return res.status(400).json({ message: "Invalid date or time format" });
    }

    // Ensure transaction time and date are not in the past
    const currentDateTime = new Date();
    if (transactionDateTime < currentDateTime) {
      return res.status(400).json({
        message: "Transaction time and date cannot be in the past",
      });
    }

    // Check if the post has an associated agent
    const agent = await prisma.agent.findFirst({
      where: { userId: post.userId },
    });

    if (!agent) {
      return res.status(404).json({ message: "Agent for this post not found" });
    }

    // Create the transaction
    const transaction = await prisma.transaction.create({
      data: {
        postId,
        agentId: agent.id,
        buyerId,
        transactionDate: transactionDateTime,
        status: "COMPLETED",
      },
    });

    return res.status(201).json({
      message: "Transaction added successfully",
      transaction,
    });
  } catch (err) {
    console.error("Error in addTransaction:", err);
    return res
      .status(500)
      .json({ message: "Failed to add transaction", error: err.message });
  }
};


// Get transactions for a specific post
export const getTransactionsForPost = async (req, res) => {
  const { postId } = req.params; // Assuming postId is passed in the URL

  try {
    // Validate postId format
    if (!postId || postId.length !== 24) {
      return res.status(400).json({ message: "Invalid post ID format" });
    }

    // Check if the post exists
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Fetch transactions for the post
    const transactions = await prisma.transaction.findMany({
      where: { postId },
      include: {
        buyer: {
          select: {
            username: true,
            avatar: true,
          },
        },
        agent: {
          select: {
            user: {
              select: {
                username: true,
                avatar: true,
              },
            },
          },
        },
      },
    });

    if (transactions.length === 0) {
      return res.status(404).json({ message: "No transactions found for this post" });
    }

    // Return the transactions
    return res.status(200).json({ transactions });
  } catch (err) {
    console.error("Error fetching transactions:", err);
    return res.status(500).json({ message: "Failed to fetch transactions", error: err.message });
  }
};
