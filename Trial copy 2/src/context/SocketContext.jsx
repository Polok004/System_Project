const socketInstance = io("http://localhost:4000", { 
  transports: ["websocket"],
  withCredentials: true 
}); 