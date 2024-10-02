import { View, Text } from "react-native";
import React, { createContext, useState } from "react";

const TournmentContext = createContext();

const TournamentProvider = ({ children }) => {
  const [tournament, setTournment] = useState("");
  const [participants, setParticipants] = useState("");
  
  return <TournmentContext.Provider>{children}</TournmentContext.Provider>;
};
export function useSocket() {
  return useContext(SocketContext);
}

export default TournamentProvider;
