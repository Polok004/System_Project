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
      console.log("Fetched Saved Posts:", savedPosts); // Log saved posts
  
      return res.status(200).json({ userPosts, savedPosts });
    } catch (err) {
      console.error("Error in profilePosts controller:", err);
      res.status(500).json({ message: "Failed to get profile posts!" });
    }
  };
  
  
// export const getNotificationNumber = async (req, res) => {
//   const tokenUserId = req.userId;
//   try {
//     const number = await prisma.chat.count({
//       where: {
//         userIDs: {
//           hasSome: [tokenUserId],
//         },
//         NOT: {
//           seenBy: {
//             hasSome: [tokenUserId],
//           },
//         },
//       },
//     });
//     res.status(200).json(number);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Failed to get profile posts!" });
//   }
//};