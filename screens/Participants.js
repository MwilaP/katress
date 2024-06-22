import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { AntDesign } from "@expo/vector-icons";

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

const Participants = () => {
  const [participants, setParticipants] = useState(data);

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

  const groups = createRandomGroups(participants, 5);
  console.log("GROUPS", groups);

  return (
    <View style={{ flex: 1 }}>
      {participants.length > 0 ? (
        <View style={{ flex: 1 }}>
          <ScrollView style={{ flex: 1 }}>
            <View style={{ alignItems: "center", flex: 1 }}>
              {participants.map((item, index) => (
                <View
                  style={{
                    width: "95%",
                    height: 70,
                    backgroundColor: "white",
                    marginTop: 10,
                    borderRadius: 10,
                    padding: 10,
                  }}
                  key={index}
                >
                  <Text>{item.name}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
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
              <Pressable
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
              </Pressable>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default Participants;

const styles = StyleSheet.create({});
