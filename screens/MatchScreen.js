import React, { useCallback, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View, TextInput, Alert, ActivityIndicator } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import { BottomModal, ModalContent, ModalButton } from "react-native-modals";
import serverUrl from "../hooks/server";

const MatchScreen = ({ navigation, tournament }) => {

  //const { tournament, group } = route.params;
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true)

  useFocusEffect(
    useCallback(() => {
      const getMatches = async () => {
        try {
          if (tournament) {
            const response = await axios.get(
              `${serverUrl}/tournaments/matches/${tournament._id}`
            );
            if (response.data) {
              setMatches(response.data);
              setLoading(false)
            }
          }
        } catch (error) {
          console.error("Error fetching matches:", error);
          Alert.alert("Error", "Failed to fetch matches. Please try again.");
          setLoading(false)
        }
      };
      getMatches();
    }, [tournament])
  );


  const MatchItem = ({ match }) => (
    <Pressable
     
      style={styles.matchItem}
    >
      <View style={styles.playerContainer}>
        <Text style={styles.playerName}>{match.player1.firstName} {match.player2.lastName}</Text>
        <Text style={styles.score}>{match.player1Score}</Text>
      </View>
      <View style={styles.separator} />
      <View style={styles.playerContainer}>
        <Text style={styles.playerName}>{match.player2.firstName} {match.player2.lastName}</Text>
        <Text style={styles.score}>{match.player2Score}</Text>
      </View>
    </Pressable>
  );

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <FlatList
        data={matches}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => <MatchItem match={item} />}
        contentContainerStyle={styles.listContent}
      />

    </View>
    
  )
}

export default MatchScreen

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  listContent: {
    paddingBottom: 20,
  },
  matchItem: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  playerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  playerName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  score: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4a90e2",
  },
  separator: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  scoreInputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  scoreInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
    width: 80,
    textAlign: "center",
  },
  modalButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: "#ccc",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
  },
  updateButton: {
    backgroundColor: "#4a90e2",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
})