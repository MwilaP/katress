import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { TextInput } from "react-native-paper";
import axios from "axios";
import serverUrl from "../hooks/server";

const TournamentName = ({ navigation, tournament }) => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handlescreation = async () => {
    try {
      setLoading(true);
      console.log(name);
      const res = await axios.post(`${serverUrl}/tournaments`, { name });
      if (res.status == 201) {
        console.log(res.data);
      }
    } catch (error) {
      setLoading(false);
    }
  };
  return (
    <View style={{ flex: 1, alignItems: "center", backgroundColor: "white" }}>
      <View style={{ padding: 20 }}>
        <Image
          style={{
            height: 200,
            width: 200,
          }}
          resizeMode="contain"
          source={require("../assets/trophy.jpeg")}
        />
      </View>
      <View
        style={{
          width: "90%",
        }}
      >
        <View>
          {tournament ? (
            <View>
              <Text style={{fontSize: 18, textAlign: 'center', fontWeight: '800', color: 'grey'}}>{tournament.name}</Text>
            </View>
          ) : (
            <TextInput
              activeOutlineColor="grey"
              outlineColor="grey"
              mode="outlined"
              value={name}
              label="Tournament Name"
              onChangeText={(text) => setName(text)}
            />
          )}
        </View>
        <View
          style={{
            paddingVertical: 10,
          }}
        >
          <Pressable
            style={{
              height: 50,
              justifyContent: "center",
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 1,
              },
              shadowOpacity: 0.25,
              shadowRadius: 1,
              elevation: 3,
              backgroundColor: "#fff",
              borderRadius: 5,
            }}
            onPress={() => navigation.navigate("Participants")}
          >
            <Text style={{ padding: 5 }}>Participants </Text>
          </Pressable>
        </View>
        <View
          style={{
            paddingVertical: 10,
            alignItems: "center",
          }}
        >
          {!tournament && (
            <Pressable
              onPress={() => handlescreation()}
              style={{
                height: 50,
                justifyContent: "center",
                backgroundColor: "green",
                alignItems: "center",
                width: "70%",
                borderRadius: 10,
              }}
            >
              <Text
                style={{
                  padding: 5,
                  fontSize: 15,
                  color: "white",
                  fontWeight: "700",
                }}
              >
                Save
              </Text>
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
};

export default TournamentName;

const styles = StyleSheet.create({});
