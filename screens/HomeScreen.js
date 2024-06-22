import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";

const HomeScreen = ({navigation}) => {
  const Tournament = ({ tournament }) => {
    return (
      <View
        style={{
          backgroundColor: "white",
          width: "95%",
          height: 150,

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
        <Pressable onPress={()=> navigation.navigate('Tournament Details')}>
          <View style={{ padding: 10 }}>
            <Text style={{ fontWeight: "700", padding: 5 }}>KATRESS</Text>
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
                <Text style={{ fontWeight: "700" }}>8 Players</Text>
              </View>
            </View>
          </View>
        </Pressable>
      </View>
    );
  };
  return (
    <ScrollView
      style={{ flex: 1, paddingHorizontal: 10, backgroundColor: "white" }}
    >
      <View style={{ alignItems: "center", flex: 1 }}>
        {Array.from({ length: 6 }).map((_, index) => (
          <Tournament />
        ))}
      </View>
    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
