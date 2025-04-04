import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "./AuthContext";

export const SocketContext = createContext();

export const SocketContextProvider = ({ children }) => {
  const { currentUser } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (currentUser) {
      const socketInstance = io("http://localhost:4000", { transports: ["websocket"] });
      setSocket(socketInstance);

      socketInstance.emit("newUser", currentUser.id);

      socketInstance.on("connect", () => {
        console.log("Socket connected:", socketInstance.id);
        socketInstance.emit("newUser", currentUser.id);
      });

      return () => {
        socketInstance.disconnect();
        setSocket(null);
      };
    }
  }, [currentUser]);

  return <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>;
};
