// chat.controller.js

import prisma from "../lib/prisma.js";

// Get all chats for a user
export const getChats = async (req, res) => {
  const tokenUserId = req.userId; // Extract user ID from the token

  try {
    const chats = await prisma.chat.findMany({
      where: {
        userIDs: {
          has: tokenUserId, // Check if the user is part of the chat
        },
      },
      include: {
        users: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
        messages: {
          take: 1, // Include the latest message only
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    // Attach the receiver to each chat (other than the current user)
    const enrichedChats = chats.map((chat) => {
      const receiver = chat.users.find((user) => user.id !== tokenUserId);
      return { ...chat, receiver };
    });

    res.status(200).json(enrichedChats);
  } catch (err) {
    console.error("Error in getChats:", err);
    res.status(500).json({ message: "Failed to retrieve chats!" });
  }
};

// Get a single chat
export const getChat = async (req, res) => {
  const tokenUserId = req.userId; // Extract user ID from the token

  try {
    const chat = await prisma.chat.findFirst({
      where: {
        id: req.params.id, // Find chat by its ID
        userIDs: {
          has: tokenUserId, // Ensure the user is part of the chat
        },
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc", // Get all messages in chronological order
          },
        },
        users: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
      },
    });

    if (!chat) {
      return res.status(404).json({ message: "Chat not found!" });
    }

    // Mark the chat as read by the current user
    await prisma.chat.update({
      where: { id: req.params.id },
      data: {
        seenBy: {
          push: tokenUserId, // Add the user to the seenBy array
        },
      },
    });

    res.status(200).json(chat);
  } catch (err) {
    console.error("Error in getChat:", err);
    res.status(500).json({ message: "Failed to retrieve chat!" });
  }
};

// Add a new chat
export const addChat = async (req, res) => {
  const tokenUserId = req.userId; // Extract user ID from the token
  const { receiverId } = req.body; // ID of the user to chat with

  if (!receiverId) {
    return res.status(400).json({ message: "Receiver ID is required!" });
  }

  try {
    const existingChat = await prisma.chat.findFirst({
      where: {
        AND: [
          { userIDs: { has: tokenUserId } },
          { userIDs: { has: receiverId } },
        ],
      },
      include: {
        users: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
      },
    });

    if (existingChat) {
      console.log("Returning existing chat:", existingChat);
      return res.status(200).json(existingChat); // Return existing chat
    }

    // Create a new chat
    const newChat = await prisma.chat.create({
      data: {
        userIDs: [tokenUserId, receiverId],
      },
      include: {
        users: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
      },
    });

    console.log("New chat created:", newChat);
    res.status(201).json(newChat);
  } catch (err) {
    console.error("Error in addChat:", err);
    res.status(500).json({ message: "Failed to create chat!" });
  }
};

// Mark a chat as read
export const readChat = async (req, res) => {
  const tokenUserId = req.userId; // Extract user ID from the token

  try {
    const chat = await prisma.chat.update({
      where: {
        id: req.params.id,
      },
      data: {
        seenBy: {
          push: tokenUserId, // Mark as read by the current user
        },
      },
    });

    res.status(200).json(chat);
  } catch (err) {
    console.error("Error in readChat:", err);
    res.status(500).json({ message: "Failed to mark chat as read!" });
  }
};

export const createChat = async (req, res) => {
  try {
    const { receiverId } = req.body;
    const senderId = req.userId; // From auth middleware

    // First check if chat already exists
    const existingChat = await prisma.chat.findFirst({
      where: {
        AND: [
          {
            userIDs: {
              hasEvery: [senderId, receiverId]
            }
          }
        ]
      },
      include: {
        users: true,
        messages: {
          orderBy: {
            createdAt: 'asc'
          }
        }
      }
    });

    if (existingChat) {
      console.log("Found existing chat:", existingChat.id);
      return res.status(200).json(existingChat);
    }

    // If no existing chat, create new one
    console.log("Creating new chat between:", senderId, "and", receiverId);
    const newChat = await prisma.chat.create({
      data: {
        userIDs: [senderId, receiverId],
        users: {
          connect: [
            { id: senderId },
            { id: receiverId }
          ]
        }
      },
      include: {
        users: true,
        messages: true
      }
    });

    console.log("New chat created:", newChat.id);
    res.status(201).json(newChat);
  } catch (error) {
    console.error("Create chat error:", error);
    res.status(500).json({ message: "Failed to create chat" });
  }
};

export const markChatAsSeen = async (req, res) => {
  try {
    const chatId = req.params.chatId;
    const userId = req.userId;

    const updatedChat = await prisma.chat.update({
      where: { id: chatId },
      data: {
        seenBy: {
          push: userId
        }
      },
      include: {
        users: true,
        messages: true
      }
    });

    res.status(200).json(updatedChat);
  } catch (error) {
    console.error("Mark chat as seen error:", error);
    res.status(500).json({ message: "Failed to mark chat as seen" });
  }
};
