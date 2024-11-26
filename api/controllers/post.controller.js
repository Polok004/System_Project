import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";

// Get all posts based on query parameters
export const getPosts = async (req, res) => {
  const query = req.query;

  try {
    const posts = await prisma.post.findMany({
      where: {
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
