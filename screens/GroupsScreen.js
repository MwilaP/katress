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
import { Modal, ModalContent, SlideAnimation } from "react-native-modals";
import { useAuth } from "../hooks/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

  

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
  const [number, setNumber] = useState(0)
  const [generate, setGenerate] = useState(false)
  const [numberOfPlayers, setNumberOfPlayers] = useState('');

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
  const {user} = useAuth()

  const [player1Score, setPlayer1Score] = useState("");
  const [player2Score, setPlayer2Score] = useState("");
  const [loading, setLoading] = useState(false);
  const [participants, setParticipants] = useState("");
  const [groupsLoading, setGroupsLoading] = useState(true);
  const { socket } = useSocket();

  const [selectedParticipant, setSelectedParticipant] = useState("");
  const [selectedGroupForNewParticipant, setSelectedGroupForNewParticipant] = useState("");
const [adding, setAdding] = useState(false)


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
        const data = await AsyncStorage.getItem(`groups_${tournament._id}`)
        if (data){
          setGroups(JSON.parse(data))
          setGroupsLoading(false)
        }
        socket.emit("groups", tournament._id);
        socket.on("groups", async (data) => {
          //const islength = [...data];
          //console.log(islength.length);
          if (Object.keys(data).length > 0) {
            setGroups(data);
            await AsyncStorage.setItem(`groups_${tournament._id}`, JSON.stringify(data))
            // console.log("socketdata", data);
            // setTimeout(()=>{
            //   setGroupsLoading(false);

            // }, 3000)
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

  const addParticipant = async () => {
    if (!selectedParticipant || !selectedGroupForNewParticipant) {
      Alert.alert("Error", "Please select a participant and a group");
      return;
    }

    try {
      console.log('group', selectedGroupForNewParticipant, 'player: ', selectedParticipant )

      setAdding(true)
      const response = await axios.post(`${serverUrl}/tournaments/${tournament._id}/addParticipant`, {
        playerId: selectedParticipant,
        groupId: selectedGroupForNewParticipant,
      });

      if (response.data) {
        // Refresh groups data
        socket.emit("groups", tournament._id);
        setAdding(false)
        Alert.alert("Success", "Participant added to group successfully");
        
      }
    } catch (error) {
      console.error("Error adding participant to group:", error);
      Alert.alert("Error", "Failed to add participant to group");
    } finally {
      setAdding(false)
      setGroupsLoading(false);
      setSelectedParticipant("");
      setSelectedGroupForNewParticipant("");
    }
  };

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


  const getUngroupedParticipants = useCallback(() => {
    if (!groups || !participants) return [];
  
    // Collect all grouped participant IDs
    const groupedParticipants = Object.values(groups)
      .flatMap(group => group.map(player => player.data._id)); // Get _id from each player in each group
  
    //console.log('GROUPED: ', groupedParticipants);
  
    // Convert groupedParticipants to a Set for efficient lookup
    const groupedSet = new Set(groupedParticipants);
  
    // Filter participants that are not in groupedSet
    return participants.filter(participant => !groupedSet.has(participant._id));
  }, [groups, participants]);
  

  const handleConfirm = () => {

    setLoading(true)
  
    try {
      if (numberOfPlayers > 0) {
        setGenerateGroups(createRandomGroups(participants, numberOfPlayers))
        setLoading(false)
  }
 
  else{
    Alert.alert('number error', 'please input a number')
    setLoading(false)
  }
      
      
    } catch (error) {

      console.log(error)
      Alert.alert('error', 'something went wrong. please try again')
      setLoading(false)
      
    }
  }
  

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

  function getGroupInfo(inputObj) {
    // Initialize an empty array to store the result for all keys
    let result = [];
  
    // Loop through all keys in the input object
    for (let key in inputObj) {
      if (inputObj.hasOwnProperty(key)) {
        // Extract the first group_id from the array under the key
        const group_id = inputObj[key][0].group_id;
  
        // Push the result object for each key into the array
        result.push({
          name: key,
          groupid: group_id
        });
      }
    }
  
    return result;
  }

  const toGroupmatches = (tournamentid, groupid)=> {
    if(user){
      navigation.navigate('GroupMatches', {
        tournament: tournamentid,
        group: groupid,
      })
    }

  }

  const RenderTable = ({ groupName, group, showGroupName }) => {

    const groupA = group[groupName];
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

    const player = groups
      ? sortedPlayers.map((player) => player.data)
      : sortedPlayers;

    return (
      <Pressable
        onPress={() => toGroupmatches(tournament._id, groupA[0].group_id )
        // {
        //   if(user){
        //     navigation.navigate("GroupMatches", {
        //       tournament: tournament._id,
        //       group: groupA[0].group_id,
        //     })
        //   }
        // }
        }
        style={styles.table}
      >
        {showGroupName && <Text style={styles.groupHeader}>Group {groupName}</Text>}
        <View style={styles.headerRow}>
          <Text style={[styles.headerCell, { flex: 2 }]}>Name</Text>
          
          <Text style={styles.headerCell}>GP</Text>
          <Text style={styles.headerCell}>GW</Text>
          <Text style={styles.headerCell}>GL</Text>
          <Text style={styles.headerCell}>SF</Text>
          <Text style={styles.headerCell}>SA</Text>
          <Text style={styles.headerCell}>SD</Text>
          <Text style={styles.headerCell}>Pts</Text>
        </View>

        {player.map((player, index) => (
          <View key={index} style={[styles.row, index % 2 === 0 ? styles.evenRow : styles.oddRow]}>
            <Text style={[styles.cell, { flex: 2 }]}>{player?.firstName} {player.lastName}</Text>
            
            <Text style={styles.cell}>{player?.gamesPlayed}</Text>
            <Text style={styles.cell}>{player?.gamesWon}</Text>
            <Text style={styles.cell}>{player?.gamesLost}</Text>
            <Text style={styles.cell}>{player?.scoreFor}</Text>
            <Text style={styles.cell}>{player?.scoreAgainst}</Text>
            <Text style={styles.cell}>{player?.scoreFor - player?.scoreAgainst}</Text>
            <Text style={styles.cell}>{player?.points}</Text>
          </View>
        ))}
      </Pressable>
    );
  };

  const RenderGroups = () => {
    const {user} = useAuth()
    const groupKeys = Object.keys(groups);
    const newGroup = getGroupInfo(groups)
    const showGroupNames = groupKeys.length > 1;
    const ungroupedParticipants = getUngroupedParticipants();
    return(
      <View style={{flex: 1}}>

        {
          groups ?(

            <ScrollView style={{flex: 1}}>
        {Object.keys(groups)?.map((groupName) => (
          <View key={groupName}>
             <RenderTable groupName={groupName} group={groups} showGroupName={showGroupNames} />
          </View>
        ))}

        {
          user && (

            <View style={styles.addParticipantContainer}>
          <Text style={styles.sectionHeader}>Add Participant to Group</Text>
          <Picker
            selectedValue={selectedParticipant}
            onValueChange={(itemValue) => setSelectedParticipant(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select Participant" value="" />
            {ungroupedParticipants.map((participant) => (
              <Picker.Item
                key={participant._id}
                label={participant.firstName + ' ' + participant.lastName}
                value={participant._id}
              />
            ))}
          </Picker>
          <Picker
            selectedValue={selectedGroupForNewParticipant}
            onValueChange={(itemValue) => setSelectedGroupForNewParticipant(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select Group" value="" />
            {newGroup.map((group) => (
              <Picker.Item
                key={group.groupid}
                label={`Group ${group.name}`}
                value={group.groupid}
              />
            ))}
          </Picker>
          <TouchableOpacity
            style={[
              styles.button,
              (!selectedParticipant || !selectedGroupForNewParticipant) && styles.disabledButton
            ]}
            onPress={addParticipant}
            disabled={!selectedParticipant || !selectedGroupForNewParticipant}
          >
            {
              adding ?
              (
                <ActivityIndicator/>
              ): (

                <Text style={styles.buttonText}>Add to Group</Text>

              )
            }
          </TouchableOpacity>
        </View>

          )
        }
         

        

        
      </ScrollView>

          ) : (

            <View style={styles.noGroupsContainer}>
          {generatedGroups ? (
            <ScrollView style={styles.generatedGroupsContainer}>
              {Object.keys(generatedGroups)?.map((groupName) => (
                <View key={groupName}>
                  <RenderTable groupName={groupName} group={generatedGroups} />
                </View>
              ))}
              <TouchableOpacity
                onPress={() => sendIdsToBackend()}
                style={styles.saveButton}
              >
                <Text style={styles.saveButtonText}>SAVE</Text>
              </TouchableOpacity>
            </ScrollView>
          ) : (
            <><View style={styles.noGroupsContent}>
                  <Text style={styles.noGroupsText}>No Groups</Text>
                 {user && ( <TouchableOpacity
                    onPress={() => {
                      //setLoading(true);
                      setGenerate(true)
                     // setGenerateGroups(createRandomGroups(participants, 8));
                      //setLoading(false);
                    } }
                    style={styles.generateButton}
                  >
                    <Text style={styles.generateButtonText}>Generate</Text>
                  </TouchableOpacity>)}
                </View>
                <Modal
        visible={generate}
        onSwipeOut={(event) => {
          setGenerate(false);
        }}
        modalAnimation={new SlideAnimation({
          slideFrom: 'bottom',
        })}
      >
        <ModalContent>
          <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 18, marginBottom: 10 }}>
              Set the Number of Players Per Group
            </Text>
            <TextInput
              keyboardType="numeric"
              placeholder="Enter number of players"
              value={numberOfPlayers}
              onChangeText={setNumberOfPlayers}
              style={{
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 5,
                padding: 10,
                marginBottom: 20,
              }}
            />
            <Button title="Confirm" onPress={handleConfirm} />
            <View style={{padding: 3, margin: 2}}>
            <Button title="Cancel" onPress={() => setGenerate(false)} />

            </View>
            
          </View>
        </ModalContent>
      </Modal></>
          )}
        </View>

          )

        }
      </View>

    )
  }



  

  return (
    <View style={styles.container}>
      {groupsLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3498db" />
        </View>
      ) : 
      (
        <RenderGroups/>
        
      )}
    </View>
  );
};

export default GroupsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  table: {
    marginBottom: 24,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  groupHeader: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2c3e50",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ecf0f1",
  },
  headerRow: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#3498db",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  headerCell: {
    flex: 1,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ecf0f1",
  },
  evenRow: {
    backgroundColor: "#f8f9fa",
  },
  oddRow: {
    backgroundColor: "#ffffff",
  },
  cell: {
    flex: 1,
    textAlign: "center",
    color: "#34495e",
  },
  recordMatchContainer: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 16,
  },
  picker: {
    height: 50,
    marginBottom: 16,
    backgroundColor: "#ecf0f1",
    borderRadius: 8,
  },
  scoreInputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: "#34495e",
    marginBottom: 8,
  },
  scoreInputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: "#bdc3c7",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginHorizontal: 4,
  },
  button: {
    backgroundColor: "#3498db",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#bdc3c7",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  noGroupsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noGroupsContent: {
    alignItems: "center",
  },
  noGroupsText: {
    fontSize: 18,
    color: "#34495e",
    marginBottom: 16,
  },
  generateButton: {
    backgroundColor: "#3498db",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  generateButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  generatedGroupsContainer: {
    flex: 1,
    width: "100%",
  },
  saveButton: {
    backgroundColor: "#2ecc71",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 24,
  },
  saveButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
  addParticipantContainer: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});