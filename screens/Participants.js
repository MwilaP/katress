import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useCallback, useState } from "react";
import { AntDesign } from "@expo/vector-icons";
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
import { TextInput } from "react-native-paper";
import { useAuth } from "../hooks/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";


const Participants = ({ tournament }) => {
  const [participants, setParticipants] = useState("");
  const [loading, setLoading] = useState(true);
  const [addLoading, setAddLoading] = useState(false);
  const [addParticipants, setAddParticipants] = useState(false);
  const [name, setName] = useState("");
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const {user} = useAuth()

  const disabled = !firstName || !lastName || addLoading;

  useFocusEffect(
    useCallback(() => {
      const getPlayers = async () => {

        const data = await AsyncStorage.getItem(`participants_${tournament._id}`)
        if(data){
          setParticipants(JSON.parse(data))
          setLoading(false)
        }
        try {
          if (tournament) {
            const players = await axios.get(
              `${serverUrl}/tournaments/${tournament._id}/players`
            );
            if (players.data) {
              setParticipants(players.data);
              //console.log(players.data)

              await AsyncStorage.setItem(`participants_${tournament?._id}`, JSON.stringify(players?.data))

              setLoading(false);
            } else {
              setLoading(false);
            }
          }
        } catch (error) {}
      };
      getPlayers();
    }, [])
  );

  const addPlayer = async () => {
    try {
      if (tournament) {
        setAddLoading(true);
        await axios
          .post(`${serverUrl}/tournaments/${tournament._id}/player`, { firstName, lastName })
          .then(async (res) => {
            if (res.status == 201) {
              const players = await axios.get(
                `${serverUrl}/tournaments/${tournament._id}/players`
              );
              if (players.data) {
                setParticipants(players.data);
                setFirstName('')
                setLastName('')
                setAddLoading(false);
              }
            }
          });
      }
    } catch (error) {
      Alert.alert("error", "something went wrong try again ");
      setAddLoading(false);
      console.log("error", error);
    }
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

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  return (
    <>
      <FlatList
        style={{ flex: 1 }}
        data={participants}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={{ alignItems: "center", flex: 1 }}>
            <View
              style={{
                width: "95%",
                height: 70,
                backgroundColor: "white",
                marginTop: 10,
                borderRadius: 10,
                padding: 10,
              }}
            >
              <View style={{flexDirection: 'row'}}>
                <Text style={{fontSize: 15, fontWeight: '700', padding: 10, color: 'grey'}}>{index + 1}.</Text>
                <Text style={{fontSize: 15, fontWeight: '700', padding: 10}} >{item.firstName} {item.lastName}</Text>
                
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              paddingTop: 40,
            }}
          >
            <View>
              <Text>no participants</Text>
            </View>
            <View
              style={{
                padding: 20,
                width: "90%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
            { user &&( <Pressable
                onPress={() => setAddParticipants(true)}
                style={{
                  borderWidth: 2,
                  width: "80%",
                  height: 50,
                  justifyContent: "center",
                  alignItems: "center",
                  borderColor: "green",
                  borderRadius: 5,
                  borderStyle: "dashed",
                  flexDirection: "row",
                }}
              >
                <AntDesign name="plus" size={24} color="green" />
                <Text style={{ paddingHorizontal: 5, color: "green" }}>
                  Add Players
                </Text>
              </Pressable>)
              }
            </View>
          </View>
        )}
      />
     {user && ( <View style={{ alignItems: "center" }}>
        <Pressable
          onPress={() => setAddParticipants(true)}
          style={{
            width: "80%",
            height: 50,
            justifyContent: "center",
            alignItems: "center",
            //borderColor: "green",
            borderRadius: 10,
            // borderStyle: "dashed",
            flexDirection: "row",
          }}
        >
          <AntDesign name="plus" size={24} color="green" />
          <Text style={{ paddingHorizontal: 5, color: "green" }}>
            Add Players
          </Text>
        </Pressable>
      </View>)}
      <BottomModal
        onHardwareBackPress={() => setAddParticipants(false)}
        onSwipeOut={() => setAddParticipants(false)}
        visible={addParticipants}
        height={0.4}
      >
        <ModalContent
          style={{
            backgroundColor: "fff",
            // height: '40%',
            justifyContent: "center",
            flex: 1,
          }}
        >
          <View style={{ justifyContent: "center" }}>
            <View>
              <TextInput
                value={firstName}
                onChangeText={(text) => setFirstName(text)}
                mode="outlined"
                label="first name"
              />
            </View>
            <View>
              <TextInput
                value={lastName}
                onChangeText={(text) => setLastName(text)}
                mode="outlined"
                label="last name"
              />
            </View>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                padding: 20,
              }}
            >
              <Pressable
                disabled={disabled}
                onPress={() => addPlayer()}
                style={{
                  //borderWidth: 2,
                  width: "80%",
                  height: 50,
                  justifyContent: "center",
                  alignItems: "center",
                  //borderColor: "green",
                  borderRadius: 10,
                  // borderStyle: "dashed",
                  flexDirection: "row",
                  backgroundColor: disabled ? "grey" : "green",
                }}
              >
                {addLoading ? (
                  <View>
                    <ActivityIndicator size="large" color="white" />
                  </View>
                ) : (
                  <Text
                    style={{ color: "white", fontSize: 16, fontWeight: "600" }}
                  >
                    Add Player
                  </Text>
                )}
              </Pressable>
            </View>
          </View>
        </ModalContent>
      </BottomModal>
    </>
  );
};

export default Participants;

const styles = StyleSheet.create({});
