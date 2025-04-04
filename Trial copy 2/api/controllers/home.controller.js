import prisma from "../lib/prisma.js";

/**
 * Fetch random posts with a limit of 9
 */


export const getRandomPosts = async (req, res) => {
  try {
    const { location } = req.query;
    
    // First fetch posts from the user's location
    const localPosts = location ? await prisma.post.findMany({
      where: {
        transaction: null,
        postDetail: {
          location: {
            contains: location,
            mode: 'insensitive' // Case-insensitive search
          }
        }
      },
      take: 4,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        postDetail: true,
      },
    }) : [];

    // Then fetch remaining posts randomly
    const remainingCount = 8 - localPosts.length;
    const otherPosts = await prisma.post.findMany({
      where: {
        transaction: null,
        AND: location ? [{
          postDetail: {
            location: {
              not: {
                contains: location,
                mode: 'insensitive'
              }
            }
          }
        }] : undefined,
        id: {
          notIn: localPosts.map(post => post.id)
        }
      },
      take: remainingCount,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        postDetail: true,
      },
    });

    // Combine local and other posts
    const combinedPosts = [...localPosts, ...otherPosts];
    
    res.status(200).json(combinedPosts);
  } catch (error) {
    console.error('Error fetching random posts:', error);
    res.status(500).json({ error: 'Failed to fetch posts.' });
  }
};

// ... rest of the controller remains the same ...

  export const getRandomAgents = async (req, res) => {
    try {
      const posts = await prisma.agent.findMany({
        where: { status: "APPROVED" },
        take: 5,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          user: true,
        },
      });
      console.log(posts); // Check what is being returned
      res.status(200).json(posts);
    } catch (error) {
      console.error('Error fetching agent', error);
      res.status(500).json({ error: 'Failed to fetch agent.' });
    }
  };


  export const getLatestBlogs = async (req, res) => {
    try {
      const blogs = await prisma.blog.findMany({
        orderBy: {
          createdAt: 'desc', // Sort by createdAt in descending order
        },
        take: 4, // Limit to the latest 4 blogs
        include: {
          author: { // Include author details
            select: {
              username: true,
              avatar: true,
            },
          },
        },
      });
  
      res.status(200).json(blogs);
    } catch (error) {
      console.error("Error fetching latest blogs:", error);
      res.status(500).json({ message: "Failed to fetch latest blogs" });
    }
  };
  