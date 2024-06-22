import React, { useEffect, useState } from "react";
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

const GroupsScreen = ({ navigation }) => {
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

  useEffect(() => {
    console.log("GENERATE", dumy);
    if (dumy) {
      setStats({
        A: initialStats(generatedGroups.A),
        B: initialStats(generatedGroups.B),
        C: initialStats(generatedGroups.C),
        D: initialStats(generatedGroups.D),
      });
      setGenerateGroups(dumy);
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  }, [generatedGroups, dumy]);

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

  const renderTable = (groupName) => {
    const sortedPlayers = Object.keys(stats[groupName]).sort((a, b) => {
      const playerA = stats[groupName][a];
      const playerB = stats[groupName][b];
      return (
        playerB.points - playerA.points ||
        playerB.scoreFor -
          playerB.scoreAgainst -
          (playerA.scoreFor - playerA.scoreAgainst) ||
        (playerB.headToHead[a] || 0) - (playerA.headToHead[b] || 0)
      );
    });

    return (
      <Pressable
        onPress={() =>
          navigation.navigate("GroupMatches", {
            matches: generateRoundRobinMatches(groups[groupName]),
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
        {sortedPlayers.map((playerName) => (
          <View key={playerName} style={styles.row}>
            <Text style={styles.nameCell}>{playerName}</Text>
            <Text style={styles.cell}>
              {stats[groupName][playerName].points}
            </Text>
            <Text style={styles.cell}>
              {stats[groupName][playerName].gamesPlayed}
            </Text>
            <Text style={styles.cell}>
              {stats[groupName][playerName].gamesWon}
            </Text>
            <Text style={styles.cell}>
              {stats[groupName][playerName].gamesLost}
            </Text>
            <Text style={styles.cell}>
              {stats[groupName][playerName].scoreFor}
            </Text>
            <Text style={styles.cell}>
              {stats[groupName][playerName].scoreAgainst}
            </Text>
          </View>
        ))}
      </Pressable>
    );
  };

  if (groups) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        {Object.keys(groups)?.map((groupName) => (
          <View key={groupName}>{renderTable(groupName)}</View>
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
                  <View key={groupName}>{renderTable(groupName)}</View>
                ))}
              </ScrollView>
              <View style={{ alignItems: "center" }}>
                <Pressable
                  style={{
                    backgroundColor: "green",
                    width: "60%",
                    height: 50,
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 10,
                  }}
                >
                  <Text style={{color: 'white', fontWeight: '700'}}>SAVE</Text>
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
                  setDumy(createRandomGroups(data, 5));
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
    backgroundColor: "green",
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
