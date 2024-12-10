import prisma from "../lib/prisma.js";  // Prisma ORM for DB operations

// Create a new blog
export const createBlog = async (req, res) => {
  try {
    const { title, content } = req.body;
    const images = req.files ? req.files : [];  // Handle images coming from the request
    const authorId = req.userId;  // Use user ID from the verified token

    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required." });
    }

    // If there are images, process them here (e.g., upload to a cloud service or save locally)
    const blog = await prisma.blog.create({
      data: {
        title,
        content,
        images: images || [], // Ensure images are handled correctly
        authorId,  // Associate the blog with the logged-in user
      },
    });

    res.status(201).json({ message: "Blog created successfully!", blog });
  } catch (error) {
    console.error("Error creating blog:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Get all blogs
export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await prisma.blog.findMany({
      include: {
        author: {
          select: {
            username: true,
            avatar: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json(blogs);
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Get a single blog by ID
export const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await prisma.blog.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            username: true,
            avatar: true,
          },
        },
      },
    });

    if (!blog) {
      return res.status(404).json({ message: "Blog not found." });
    }

    res.status(200).json(blog);
  } catch (error) {
    console.error("Error fetching blog:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};




