import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Alert,
  ScrollView,
  TextInput,
  Pressable,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useFocusEffect, useTheme } from "@react-navigation/native";
import axios from "axios";
import serverUrl from "../hooks/server";
import { useSocket } from "../hooks/SocketProvider";
const gen = {
  A: [
    { name: "Nathan" },
    { name: "Rachel" },
    { name: "Mona" },
    { name: "Kathy" },
    { name: "Charlie" },
  ],
  B: [
    { name: "Jack" },
    { name: "Bob" },
    { name: "Hannah" },
    { name: "Paul" },
    { name: "Steve" },
  ],
  C: [
    { name: "Tina" },
    { name: "Alice" },
    { name: "Frank" },
    { name: "Eve" },
    { name: "Ivy" },
  ],
  D: [
    { name: "Quincy" },
    { name: "Leo" },
    { name: "David" },
    { name: "Olivia" },
    { name: "Grace" },
  ],
};

const data = [
  { name: "Alice" },
  { name: "Bob" },
  { name: "Charlie" },
  { name: "David" },
  { name: "Eve" },
  { name: "Frank" },
  { name: "Grace" },
  { name: "Hannah" },
  { name: "Ivy" },
  { name: "Jack" },
  { name: "Kathy" },
  { name: "Leo" },
  { name: "Mona" },
  { name: "Nathan" },
  { name: "Olivia" },
  { name: "Paul" },
  { name: "Quincy" },
  { name: "Rachel" },
  { name: "Steve" },
  { name: "Tina" },
];

const initialStats = (group) =>
  group?.reduce((acc, player) => {
    console.log("ACC", acc);
    acc[player.name] = {
      points: 0,
      gamesPlayed: 0,
      gamesWon: 0,
      gamesLost: 0,
      scoreFor: 0,
      scoreAgainst: 0,
      headToHead: {},
    };
    return acc;
  }, {});

const generateRoundRobinMatches = (group) => {
  const matches = [];
  const numPlayers = group?.length;

  for (let i = 0; i < numPlayers - 1; i++) {
    for (let j = i + 1; j < numPlayers; j++) {
      matches.push([group[i], group[j]]);
    }
  }

  return matches;
};

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function createRandomGroups(array, groupSize) {
  shuffleArray(array);
  const groups = {};
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let i = 0; i < array.length; i += groupSize) {
    const group = array.slice(i, i + groupSize);
    const groupLabel = alphabet[Math.floor(i / groupSize)];
    groups[groupLabel] = group;
  }
  return groups;
}

const GroupsScreen = ({ navigation, tournament }) => {
  const [groups, setGroups] = useState("");
  const [generatedGroups, setGenerateGroups] = useState("");
  const [dumy, setDumy] = useState("");

  const [stats, setStats] = useState("");

  const [recordedMatches, setRecordedMatches] = useState({
    A: [],
    B: [],
    C: [],
    D: [],
    // Initialize for other groups...
  });

  const [selectedGroup, setSelectedGroup] = useState("A");
  const [selectedMatch, setSelectedMatch] = useState("");
  const [selectedWinner, setSelectedWinner] = useState("");

  const [player1Score, setPlayer1Score] = useState("");
  const [player2Score, setPlayer2Score] = useState("");
  const [loading, setLoading] = useState(false);
  const [participants, setParticipants] = useState("");
  const [groupsLoading, setGroupsLoading] = useState(true);
  const { socket } = useSocket();

  useFocusEffect(
    useCallback(() => {
      const getPlayers = async () => {
        try {
          if (tournament) {
            console.log("okay");
            const players = await axios.get(
              `${serverUrl}/tournaments/${tournament._id}/players`
            );
            if (players.data) {
              setParticipants(players.data);
              //setGroupsLoading(false);
            } else {
              //setGroupsLoading(false);
            }
          }
        } catch (error) {}
      };
      getPlayers();
      //setGroupsLoading(false);
    }, [])
  );
  useFocusEffect(
    useCallback(() => {
      const getGroups = async () => {
        console.log("running");
        socket.emit("groups", tournament._id);
        socket.on("groups", (data) => {
          //const islength = [...data];
          //console.log(islength.length);
          if (Object.keys(data).length > 0) {
            setGroups(data);
            // console.log("socketdata", data);
            setGroupsLoading(false);
          }
          setGroupsLoading(false);
        });
      };
      getGroups();
    }, [])
  );

  function isEmptyObject(obj) {
    return Object.keys(obj).length > 0;
  }
  const sendIdsToBackend = async () => {
    try {
      // Extract _id from each object in the data
      const idsObject = {};
      for (const group in generatedGroups) {
        if (generatedGroups.hasOwnProperty(group)) {
          idsObject[group] = generatedGroups[group].map((item) => item._id);
        }
      }
      setLoading(true);
      const response = await axios.post(
        `${serverUrl}/tournaments/${tournament._id}/group`,
        { data: idsObject }
      );
      if (response.data) {
        console.log("Response", response.data);
        setGroups(response.data);
        setGenerateGroups("");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error sending IDs to backend:", error);
      setLoading(false);
    }
  };

  const matches = generateRoundRobinMatches(groups[selectedGroup]);

  const updateStats = (
    groupName,
    player1,
    player2,
    winner,
    player1Score,
    player2Score
  ) => {
    setStats((prevStats) => {
      const newStats = { ...prevStats };
      newStats[groupName][player1.name].gamesPlayed += 1;
      newStats[groupName][player2.name].gamesPlayed += 1;
      newStats[groupName][player1.name].scoreFor += player1Score;
      newStats[groupName][player2.name].scoreFor += player2Score;
      newStats[groupName][player1.name].scoreAgainst += player2Score;
      newStats[groupName][player2.name].scoreAgainst += player1Score;

      if (winner === player1.name) {
        newStats[groupName][player1.name].gamesWon += 1;
        newStats[groupName][player1.name].points += 3;
        newStats[groupName][player2.name].gamesLost += 1;
      } else {
        newStats[groupName][player2.name].gamesWon += 1;
        newStats[groupName][player2.name].points += 3;
        newStats[groupName][player1.name].gamesLost += 1;
      }
      if (!newStats[groupName][player1.name].headToHead[player2.name]) {
        newStats[groupName][player1.name].headToHead[player2.name] = 0;
      }
      if (!newStats[groupName][player2.name].headToHead[player1.name]) {
        newStats[groupName][player2.name].headToHead[player1.name] = 0;
      }
      newStats[groupName][player1.name].headToHead[player2.name] +=
        winner === player1.name ? 1 : 0;
      newStats[groupName][player2.name].headToHead[player1.name] +=
        winner === player2.name ? 1 : 0;

      return newStats;
    });

    setRecordedMatches((prevMatches) => {
      const newMatches = { ...prevMatches };
      newMatches[groupName] = [
        ...newMatches[groupName],
        {
          player1: player1.name,
          player2: player2.name,
          winner,
          player1Score,
          player2Score,
        },
      ];
      return newMatches;
    });
  };

  const handleRecordResult = () => {
    if (selectedMatch && player1Score !== "" && player2Score !== "") {
      const [player1, player2] = selectedMatch;
      const p1Score = parseInt(player1Score, 10);
      const p2Score = parseInt(player2Score, 10);

      if (
        recordedMatches[selectedGroup].find(
          (match) =>
            match.player1 === player1.name && match.player2 === player2.name
        )
      ) {
        Alert.alert("Error", "This match has already been recorded.");
        return;
      }

      const winner = p1Score > p2Score ? player1.name : player2.name;

      updateStats(selectedGroup, player1, player2, winner, p1Score, p2Score);
      setSelectedMatch(null);
      setPlayer1Score("");
      setPlayer2Score("");
    }
  };

  const RenderTable = ({ groupName, group }) => {
    const groupA = group[groupName];

   // console.log('ID', groupA[0].group_id)

    const sortedPlayers = groups
      ? groupA.sort((a, b) => {
          return (
            b.data.points - a.data.points ||
            b.data.scoreFor -
              b.data.scoreAgainst -
              (a.data.scoreFor - a.data.scoreAgainst) ||
            (b.data.headToHead[a.data.name] || 0) -
              (a.data.headToHead[b.data.name] || 0)
          );
        })
      : groupA.sort((a, b) => {
          return (
            b.points - a.points ||
            b.scoreFor - b.scoreAgainst - (a.scoreFor - a.scoreAgainst) ||
            (b.headToHead[a.name] || 0) - (a.headToHead[b.name] || 0)
          );
        });

    // Print sorted players
    const player = groups
      ? sortedPlayers.map((player) => {
          return player.data;
        })
      : sortedPlayers.map((player) => {
          //console.log('player',player)
          return player;
        });

    //console.log(`group ${groupName}`, player[1]);

    return (
      <Pressable
        onPress={() =>
          navigation.navigate("GroupMatches", {
        tournament: tournament._id,
        group: groupA[0].group_id,
          })
        }
        style={styles.table}
      >
        <Text style={styles.header}>Group {groupName}</Text>
        <View style={styles.row}>
          <Text style={[styles.nameCell, styles.headerCell]}>Name</Text>
          <Text style={[styles.cell, styles.headerCell]}>Pts</Text>
          <Text style={[styles.cell, styles.headerCell]}>GP</Text>
          <Text style={[styles.cell, styles.headerCell]}>GW</Text>
          <Text style={[styles.cell, styles.headerCell]}>GL</Text>
          <Text style={[styles.cell, styles.headerCell]}>SF</Text>
          <Text style={[styles.cell, styles.headerCell]}>SA</Text>
        </View>

        {player.map((player, index) => (
          <View key={index} style={styles.row}>
            <Text style={styles.nameCell}>{player?.name}</Text>
            <Text style={styles.cell}>{player?.points}</Text>
            <Text style={styles.cell}>{player?.gamesPlayed}</Text>
            <Text style={styles.cell}>{player?.gamesWon}</Text>
            <Text style={styles.cell}>{player?.gamesLost}</Text>
            <Text style={styles.cell}>{player?.scoreFor}</Text>
            <Text style={styles.cell}>{player?.scoreAgainst}</Text>
          </View>
        ))}
      </Pressable>
    );
  };

  if (groupsLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  if (groups) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        {Object.keys(groups)?.map((groupName) => (
          <View key={groupName}>
            <RenderTable groupName={groupName} group={groups} />
          </View>
        ))}
        <Text style={styles.header}>Record Match Result</Text>
        <Picker
          selectedValue={selectedGroup}
          onValueChange={(itemValue) => setSelectedGroup(itemValue)}
          style={styles.picker}
        >
          {Object.keys(groups).map((groupName) => (
            <Picker.Item
              key={groupName}
              label={`Group ${groupName}`}
              value={groupName}
            />
          ))}
        </Picker>

        <Picker
          selectedValue={selectedMatch}
          onValueChange={(itemValue) => setSelectedMatch(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Select Match" value={null} />
          {matches.map((match, index) => (
            <Picker.Item
              key={index}
              label={`${match[0].name} vs ${match[1].name}`}
              value={match}
            />
          ))}
        </Picker>

        {selectedMatch && (
          <View>
            <Text style={styles.label}>
              Enter scores for {selectedMatch[0].name} vs{" "}
              {selectedMatch[1].name}:
            </Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder={`${selectedMatch[0].name}'s score`}
              value={player1Score}
              onChangeText={setPlayer1Score}
            />
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder={`${selectedMatch[1].name}'s score`}
              value={player2Score}
              onChangeText={setPlayer2Score}
            />
          </View>
        )}

        <Button
          title="Record Result"
          onPress={handleRecordResult}
          disabled={
            !selectedMatch || player1Score === "" || player2Score === ""
          }
        />
      </ScrollView>
    );
  }
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      {loading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          {generatedGroups ? (
            <View style={{ flex: 1, backgroundColor: "white", padding: 10 }}>
              <ScrollView style={{ flex: 1 }}>
                {Object?.keys(generatedGroups)?.map((groupName) => (
                  <View key={groupName}>
                    <RenderTable
                      groupName={groupName}
                      group={generatedGroups}
                    />
                  </View>
                ))}
              </ScrollView>
              <View style={{ alignItems: "center" }}>
                <Pressable
                  onPress={() => sendIdsToBackend()}
                  style={{
                    backgroundColor: "green",
                    width: "60%",
                    height: 50,
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 10,
                  }}
                >
                  <Text style={{ color: "white", fontWeight: "700" }}>
                    SAVE
                  </Text>
                </Pressable>
              </View>
            </View>
          ) : (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View style={{ padding: 20 }}>
                <Text>No Groups</Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  setLoading(true);
                  setGenerateGroups(createRandomGroups(participants, 5));
                  setLoading(false);
                }}
              >
                <Text style={{ fontSize: 17, fontWeight: "700" }}>
                  Generate
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

export default GroupsScreen;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    //backgroundColor: "green",
  },
  table: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    padding: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  cell: {
    width: "10%",
    textAlign: "center",
  },
  nameCell: {
    width: "20%",
    textAlign: "center",
  },
  headerCell: {
    fontWeight: "bold",
  },
  picker: {
    height: 50,
    width: "100%",
    marginBottom: 10,
  },
});
