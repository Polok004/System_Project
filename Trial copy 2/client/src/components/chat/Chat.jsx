import React, { useContext, useEffect, useRef, useState } from "react";
import "./chat.scss";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";
import { format } from "timeago.js";
import { SocketContext } from "../../context/SocketContext";
import { useNotificationStore } from "../../lib/notificationStore";
import { useNavigate } from "react-router-dom";

function Chat({ chats = [], chatWithUserId, onChatUpdate }) {
  const [chat, setChat] = useState(null);
  const [typing, setTyping] = useState({});
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);
  const messageEndRef = useRef();
  const typingTimeoutRef = useRef({});
  const decrease = useNotificationStore((state) => state.decrease);
  const navigate = useNavigate();
  const chatCreationInProgress = useRef(false);
  const { fetch: fetchNotifications } = useNotificationStore();

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  // Handle new chat creation
  useEffect(() => {
    const createNewChat = async () => {
      if (!chatWithUserId || !currentUser || chatCreationInProgress.current) return;

      try {
        chatCreationInProgress.current = true;
        
        const existingChat = chats.find(c => 
          c.userIDs?.includes(chatWithUserId) || 
          c.users?.some(u => u.id === chatWithUserId)
        );

        if (existingChat) {
          handleOpenChat(existingChat);
          return;
        }

        const response = await apiRequest.post("/chats", { 
          receiverId: chatWithUserId,
          senderId: currentUser.id
        });

        if (response.data) {
          const newChat = {
            ...response.data,
            receiver: response.data.users.find(u => u.id !== currentUser.id),
            messages: []
          };
          handleOpenChat(newChat);
        }
      } catch (err) {
        console.error("Failed to create chat:", err);
      } finally {
        chatCreationInProgress.current = false;
      }
    };

    createNewChat();
  }, [chatWithUserId, currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = e.target.text.value.trim();
  
    if (!text) return;
  
    try {
      // Save the message via the Prisma backend API
      const res = await apiRequest.post(`/messages/${chat.id}`, { text });
      setChat((prev) => ({
        ...prev,
        messages: [...prev.messages, res.data],
      }));
      e.target.reset();
  
      // Notify the receiver via the socket server
      socket.emit("sendMessage", {
        receiverId: chat.receiver.id,
        data: { ...res.data, chatId: chat.id, userId: currentUser.id },
      });
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };
  
  // Real-time message handling
  useEffect(() => {
    if (chat && socket) {
      const handleMessage = (data) => {
        if (chat.id === data.chatId) {
          setChat((prev) => ({
            ...prev,
            messages: [...prev.messages, data],
          }));
        }
      };
  
      socket.on("getMessage", handleMessage);
      return () => socket.off("getMessage", handleMessage);
    }
  }, [socket, chat]);
  
  // Listen for real-time messages
  useEffect(() => {
    if (socket) {
      const handleMessage = (data) => {
        if (data.chatId === chat?.id) {
          setChat((prev) => ({
            ...prev,
            messages: [...prev.messages, data],
          }));
        }
      };
  
      socket.on("getMessage", handleMessage);
      return () => socket.off("getMessage", handleMessage);
    }
  }, [socket, chat]);
  
  // Listen for real-time messages
  useEffect(() => {
    if (chat && socket) {
      const handleMessage = (data) => {
        if (chat.id === data.chatId) {
          setChat((prev) => ({
            ...prev,
            messages: [...prev.messages, data],
          }));
        }
      };

      socket.on("getMessage", handleMessage);
      return () => socket.off("getMessage", handleMessage);
    }
  }, [socket, chat]);

  // Scroll to the latest message
  useEffect(() => {
    if (chat?.messages) {
      messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chat?.messages]);

  // Update seen status when opening a chat
  const handleOpenChat = async (c) => {
    try {
      // Optimistically mark the chat as seen before API response
      setChat((prev) => ({
        ...c,
        seenBy: [...(c.seenBy || []), currentUser.id], // Add current user to seenBy
      }));
  
      if (!c.seenBy?.includes(currentUser?.id)) {
        const response = await apiRequest.put(`/chats/${c.id}/seen`);
        if (response.data) {
          decrease();
          fetchNotifications();
  
          // Ensure the latest seenBy is updated
          setChat((prev) => ({
            ...prev,
            seenBy: response.data.seenBy,
          }));
  
          socket?.emit("chatSeen", {
            chatId: c.id,
            userId: currentUser.id,
            seenBy: response.data.seenBy,
          });
        }
      }
    } catch (err) {
      console.error("Failed to mark chat as seen:", err);
    }
  };
  

  // Listen for chat seen updates
  useEffect(() => {
    if (socket) {
      const handleChatSeen = ({ chatId, userId, seenBy }) => {
        setChat(prev => {
          if (prev?.id === chatId) {
            return {
              ...prev,
              seenBy: seenBy || [...(prev.seenBy || []), userId]
            };
          }
          return prev;
        });
      };

      socket.on("chatSeen", handleChatSeen);
      return () => socket.off("chatSeen", handleChatSeen);
    }
  }, [socket]);

  return (
    <div className="chat">
      <div className="messages">
        <h1>Messages</h1>
        {chats?.map((c) => {
          if (!c?.receiver) return null;
          const isUnseen = !c.seenBy?.includes(currentUser?.id);
          return (
            <div
              className={`message ${isUnseen ? 'unseen' : ''}`}
              key={c.id}
              style={{
                backgroundColor: isUnseen && chat?.id !== c.id ? "#fecd514e" : "white"
              }}
              onClick={() => handleOpenChat(c)}
            >
              <img src={c.receiver.avatar || "/noavatar.jpg"} alt="" />
              <div className="message-info">
                <span>{c.receiver.username}</span>
                <p>{c.lastMessage}</p>
              </div>
            </div>
          );
        })}
      </div>

      {chat && (
        <div className="chatBox">
          <div className="top">
            <div className="user">
              <img src={chat?.receiver?.avatar || "/noavatar.jpg"} alt="" />
              {chat?.receiver?.username || "Unknown User"}
            </div>
            <span className="close" onClick={() => setChat(null)}>
              X
            </span>
          </div>

          <div className="center">
            {chat.messages?.map((message) => (
              <div
                className={`chatMessage ${
                  message.userId === currentUser?.id ? "own" : ""
                }`}
                key={message.id}
              >
                <p>{message.text}</p>
                <span>{format(message.createdAt)}</span>
              </div>
            ))}
            <div ref={messageEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="bottom">
            <textarea
              name="text"
              placeholder="Type your message here..."
              required
            />
            <button type="submit">Send</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Chat;
