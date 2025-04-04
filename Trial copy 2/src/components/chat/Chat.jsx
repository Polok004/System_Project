import { useState, useEffect, useRef } from 'react';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const websocket = useRef(null);
  const chatBoxRef = useRef(null);

  useEffect(() => {
    // Fetch past messages when component mounts
    fetchPastMessages();
    
    // Setup WebSocket connection
    websocket.current = new WebSocket('YOUR_WEBSOCKET_URL');
    
    websocket.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages(prev => [...prev, message]);
      scrollToBottom();
    };

    return () => {
      if (websocket.current) {
        websocket.current.close();
      }
    };
  }, []);

  const fetchPastMessages = async () => {
    try {
      const response = await fetch('YOUR_API_ENDPOINT/messages');
      const data = await response.json();
      setMessages(data);
      scrollToBottom();
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageData = {
      content: newMessage,
      timestamp: new Date().toISOString(),
      sender: 'USER_ID' // Replace with actual user ID
    };

    websocket.current.send(JSON.stringify(messageData));
    setNewMessage('');
  };

  const scrollToBottom = () => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-messages" ref={chatBoxRef}>
        {messages.map((message, index) => (
          <div key={index} className="message">
            <span className="sender">{message.sender}</span>
            <p>{message.content}</p>
            <span className="timestamp">
              {new Date(message.timestamp).toLocaleTimeString()}
            </span>
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} className="chat-input">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default Chat; 