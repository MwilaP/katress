import React, { useCallback, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View, TextInput, Alert, ActivityIndicator } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import { BottomModal, ModalContent, ModalButton } from "react-native-modals";
import serverUrl from "../hooks/server";

const GroupMatches = ({ route }) => {
  const { tournament, group } = route.params;
  const [matches, setMatches] = useState([]);
  const [score1, setScore1] = useState("");
  const [score2, setScore2] = useState("");
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [updateloading, setUpdateloading] = useState(false)
  const [loading, setLoading] = useState(true)

  useFocusEffect(
    useCallback(() => {
      const getMatches = async () => {
        try {
          if (tournament) {
            const response = await axios.get(
              `${serverUrl}/tournaments/${tournament}/matches/${group}`
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
    }, [tournament, group])
  );

  const updateMatchScore = async () => {

    const getMatches = async () => {
      try {
        if (tournament) {
          const response = await axios.get(
            `${serverUrl}/tournaments/${tournament}/matches/${group}`
          );
          if (response.data) {
            setMatches(response.data);
          }
        }
      } catch (error) {
        console.error("Error fetching matches:", error);
        Alert.alert("Error", "Failed to fetch matches. Please try again.");
      }
    };

    if (!selectedMatch) return;

    try {
      setUpdateloading(true)
      //console.log('match: ', selectedMatch._id)
      const response = await axios.post(
        `${serverUrl}/tournaments/${tournament}/matches/`,
        { 
          matchId: selectedMatch._id,
          player1Score: parseInt(score1),
          player2Score: parseInt(score2),
        }
      );

      if (response.status = 201) {
        // Update the local state with the new scores
        getMatches()
        setModalVisible(false);
        Alert.alert("Success", "Match score updated successfully!");
        setUpdateloading(false)

      }
    } catch (error) {
      console.error("Error updating match score:", error);
      Alert.alert("Error", "Failed to update match score. Please try again.");
      setUpdateloading(false)
    }
  };

  const MatchItem = ({ match }) => (
    <Pressable
      onPress={() => {
        setSelectedMatch(match);
        setScore1(match.player1Score.toString());
        setScore2(match.player2Score.toString());
        setModalVisible(true);
      }}
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
      <BottomModal
        visible={modalVisible}
        onTouchOutside={() => setModalVisible(false)}
        height={0.4}
        width={1}
        onSwipeOut={() => setModalVisible(false)}
      >
        <ModalContent>
          <Text style={styles.modalTitle}>Update Match Score</Text>
          {selectedMatch && (
            <>
              <View style={styles.scoreInputContainer}>
                <Text style={styles.playerName}>{selectedMatch.player1.firstName} {selectedMatch.player1.lastName}</Text>
                <TextInput
                  style={styles.scoreInput}
                  value={score1}
                  onChangeText={setScore1}
                  keyboardType="numeric"
                  placeholder="Score"
                />
              </View>
              <View style={styles.scoreInputContainer}>
                <Text style={styles.playerName}>{selectedMatch.player2.firstName} {selectedMatch.player2.lastName}</Text>
                <TextInput
                  style={styles.scoreInput}
                  value={score2}
                  onChangeText={setScore2}
                  keyboardType="numeric"
                  placeholder="Score"
                />
              </View>
              
              <View style={styles.modalButtonsContainer}>
              {
                updateloading ? (
                  <ActivityIndicator/>
                ) : (
                  <><ModalButton
                        text="Cancel"
                        onPress={() => setModalVisible(false)}
                        style={styles.cancelButton}
                        textStyle={styles.buttonText} /><ModalButton
                          text="Update"
                          onPress={updateMatchScore}
                          style={styles.updateButton}
                          textStyle={styles.buttonText} /></>
                  
                )
              }
                
              </View>
            </>
          )}
        </ModalContent>
      </BottomModal>
    </View>
  );
};

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
});

export default GroupMatches;