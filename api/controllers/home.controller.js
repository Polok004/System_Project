import prisma from "../lib/prisma.js";

/**
 * Fetch random posts with a limit of 9
 */
export const getRandomPosts = async (req, res) => {
    try {
      const posts = await prisma.post.findMany({
        take: 9,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          postDetail: true,
        },
      });
      console.log(posts); // Check what is being returned
      res.status(200).json(posts);
    } catch (error) {
      console.error('Error fetching random posts:', error);
      res.status(500).json({ error: 'Failed to fetch posts.' });
    }
  };
  