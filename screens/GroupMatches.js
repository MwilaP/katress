import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useCallback, useState } from "react";
import { useFocusEffect, useTheme } from "@react-navigation/native";
import axios from "axios";
import serverUrl from "../hooks/server";

import Modal, {
  ModalTitle,
  ModalContent,
  ModalFooter,
  ModalButton,
  SlideAnimation,
  ScaleAnimation,
  BottomModal,
} from "react-native-modals";

const GroupMatches = ({ route }) => {
  const { tournament, group } = route.params;
  const [matches, setMatches] = useState("");
  console.log(group, tournament);

  const [score1, setScore1] = useState("");
  const [score2, setScore2] = useState("");
  const [matchId, setMatchId] = useState("");
  const [addscore, setAddscore] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const getPlayers = async () => {
        try {
          if (tournament) {
            console.log("okay");
            const players = await axios.get(
              `${serverUrl}/tournaments/${tournament}/matches/${group}`
            );
            if (players.data) {
              setMatches(players.data);
            } else {
            }
          }
        } catch (error) {}
      };
      getPlayers();
      //setGroupsLoading(false);
    }, [])
  );

  const MatchItem = ({ match }) => (
    <Pressable
      onPress={() => {
        setMatchId(match);
        setScore1(match.player1Score);
        setScore2(match.player2Score);
        setAddscore(true);
      }}
      style={styles.matchItem}
    >
      <View style={{ flexDirection: "row" }}>
        <Text style={styles.player}>{match.player1.name}</Text>
        <Text style={styles.player}>{match.player1Score}</Text>
      </View>
      <View style={{ flexDirection: "row" }}>
        <Text style={styles.player}>{match.player2.name}</Text>
        <Text style={styles.player}>{match.player2Score}</Text>
      </View>
    </Pressable>
  );
  return (
    <>
      <View style={{ backgroundColor: "white", flex: 1 }}>
        <FlatList
          data={matches}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => <MatchItem match={item} />}
        />
      </View>
      <BottomModal
        onHardwareBackPress={() => setAddscore(false)}
        onSwipeOut={() => setAddscore(false)}
        visible={addscore}
        height={0.4}
      ></BottomModal>
    </>
  );
};

export default GroupMatches;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  matchItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    justifyContent: "center",
    // alignItems: 'center'
  },
  player: {
    fontSize: 18,
    padding: 10,
  },
  score: {
    fontSize: 16,
    color: "#888",
  },
});
