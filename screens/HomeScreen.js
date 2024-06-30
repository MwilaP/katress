import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useCallback, useLayoutEffect, useState } from "react";
import { useFocusEffect, useTheme } from "@react-navigation/native";
import axios from "axios";
import serverUrl from "../hooks/server";
import { SafeAreaView } from "react-native-safe-area-context";

const HomeScreen = ({ navigation }) => {
  const [tournaments, setTournments] = useState("");
  const [loading, setLoading] = useState("");

  useFocusEffect(
    useCallback(() => {
      const getTournaments = async () => {
        try {
          const tournament = await axios.get(`${serverUrl}/tournaments`);
          if (tournament.data) {
            setTournments(tournament.data);
          }
        } catch (error) {}
      };
      getTournaments();
      setLoading(false);
    }, [])
  );

  const Tournament = ({ item }) => {
    return (
      <View
        style={{
          backgroundColor: "white",
          //width: "95%",
          height: 150,
          marginBottom: 5,

          borderRadius: 10,
          marginTop: 10,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
          backgroundColor: "#fff",
        }}
      >
        <Pressable
          onPress={() =>
            navigation.navigate("Tournament Details", { tournament: item })
          }
        >
          <View style={{ padding: 10 }}>
            <Text style={{ fontWeight: "700", padding: 5 }}>{item?.name}</Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image
                style={{
                  height: 90,
                }}
                resizeMode="contain"
                source={require("../assets/trophy.jpeg")}
              />
              <View style={{ alignItems: "center" }}>
                <Text style={{ fontWeight: "700", color: "grey" }}>
                  Participants
                </Text>
                <Text style={{ fontWeight: "700" }}>
                  {item?.players.length}
                </Text>
              </View>
            </View>
          </View>
        </Pressable>
      </View>
    );
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        contentContainerStyle={{ paddingHorizontal: 10 }}
        data={tournaments}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => <Tournament item={item} />}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
