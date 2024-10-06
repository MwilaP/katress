import React, { useCallback, useState, useMemo, useRef, useEffect } from "react";
import { FlatList, Pressable, StyleSheet, Text, View, TextInput, Alert, ActivityIndicator } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import { BottomModal, ModalContent, ModalButton } from "react-native-modals";
import serverUrl from "../hooks/server";
import AsyncStorage from "@react-native-async-storage/async-storage";

const MatchScreen = ({ navigation, tournament }) => {

  //const { tournament, group } = route.params;
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const debounceTimeout = useRef(null);

  useFocusEffect(
    useCallback(() => {
      const getMatches = async () => {
        const data = await AsyncStorage.getItem(tournament._id)
        if(data){
          setMatches(JSON.parse(data))
          setLoading(false)
        }
        try {
          if (tournament) {

            const response = await axios.get(
              `${serverUrl}/tournaments/matches/${tournament._id}`
            );
            if (response.data) {
              setMatches(response.data);
              await AsyncStorage.setItem(`matches_${tournament._id}`, JSON.stringify(response.data))
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


  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300); // 300ms delay

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [searchQuery]);


  const filteredMatches = useMemo(() => {
    if (!debouncedSearchQuery.trim()) return matches;

    const searchTerms = debouncedSearchQuery.toLowerCase().split(/\s*(?:vs|&)\s*/);
    
    return matches.filter((match) => {
      const player1FullName = `${match.player1.firstName} ${match.player1.lastName}`.toLowerCase();
      const player2FullName = `${match.player2.firstName} ${match.player2.lastName}`.toLowerCase();
      
      if (searchTerms.length === 1) {
        // Single player search
        return player1FullName.includes(searchTerms[0]) || player2FullName.includes(searchTerms[0]);
      } else if (searchTerms.length === 2) {
        // Two player search
        return (
          (player1FullName.includes(searchTerms[0]) && player2FullName.includes(searchTerms[1])) ||
          (player1FullName.includes(searchTerms[1]) && player2FullName.includes(searchTerms[0]))
        );
      }
      return false;
    });
  }, [matches, debouncedSearchQuery]);

  const MatchItem = ({ match }) => (
    <Pressable
     
      style={styles.matchItem}
    >
      <View style={styles.playerContainer}>
        <Text style={styles.playerName}>{match.player1?.firstName} {match.player1?.lastName}</Text>
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
      <TextInput
        style={styles.searchInput}
        placeholder="Search (e.g., 'Oscar' or 'Oscar vs James')"
        value={searchQuery}
        placeholderTextColor='gray'
        onChangeText={setSearchQuery}
      />
      <FlatList
        data={filteredMatches}
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
    padding: 5,
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
  searchInput: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ccc",
  },
})