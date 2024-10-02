import React, { useCallback, useState } from "react";
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import { BottomModal } from "react-native-modals";
import serverUrl from "../hooks/server";
import { ActivityIndicator } from "react-native";

const GroupMatches = ({ route }) => {
  const { tournament, group } = route.params;
  const [matches, setMatches] = useState([]);
  const [score1, setScore1] = useState("");
  const [score2, setScore2] = useState("");
  const [matchId, setMatchId] = useState("");
  const [addscore, setAddscore] = useState(false);
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
          setLoading(false)
          Alert.alert('error', 'something went wrong')
        }
      };
      getMatches();
    }, [tournament, group])
  );

  const MatchItem = ({ match }) => (
    <Pressable
      onPress={() => {
        setMatchId(match.id);
        setScore1(match.player1Score);
        setScore2(match.player2Score);
        setAddscore(true);
      }}
      style={styles.matchItem}
    >
      <View style={styles.playerContainer}>
        <Text style={styles.playerName}>{match.player1.name}</Text>
        <Text style={styles.score}>{match.player1Score}</Text>
      </View>
      <View style={styles.separator} />
      <View style={styles.playerContainer}>
        <Text style={styles.playerName}>{match.player2.name}</Text>
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
      <Text style={styles.title}>Group Matches</Text>
      <FlatList
        data={matches}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => <MatchItem match={item} />}
        contentContainerStyle={styles.listContent}
      />
      <BottomModal
        visible={addscore}
        onHardwareBackPress={() => setAddscore(false)}
        onSwipeOut={() => setAddscore(false)}
        height={0.4}
      >
        {/* Add your modal content here */}
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
    flex: 1
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
});

export default GroupMatches;