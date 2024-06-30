import React, { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import serverUrl from "./server";

// Create Context
export const SocketContext = createContext();

// Create Provider
export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);


  useEffect(() => {
    const newSocket = io(serverUrl);
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to the server");
      setIsConnected(true);
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from the server");
      setIsConnected(false);
    });

    return () => {
       newSocket.off("connect");
      newSocket.off("disconnect");
      newSocket.close();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected, setIsConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
export function useSocket() {
  return useContext(SocketContext);
}
