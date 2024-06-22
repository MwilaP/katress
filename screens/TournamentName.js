import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { TextInput } from "react-native-paper";

const TournamentName = ({navigation}) => {
  return (
    <View style={{ flex: 1, alignItems: "center", backgroundColor: "white" }}>
      <View style={{ padding: 30 }}>
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
          <TextInput
            activeOutlineColor="grey"
            outlineColor="grey"
            mode="outlined"
            label="Tournament Name"
          />
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

            onPress={()=> navigation.navigate('Participants')}
          >
            <Text style={{ padding: 5 }}>Participants</Text>
          </Pressable>
        </View>
        <View
          style={{
            paddingVertical: 10,
            alignItems: 'center'
          }}
        >
          <Pressable
            style={{
              height: 50,
              justifyContent: "center",
              backgroundColor: 'green',
              alignItems: 'center',
              width: '70%',
              borderRadius: 10
            }}
          >
            <Text style={{ padding: 5, fontSize: 15, color: 'white', fontWeight: '700' }}>Save</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default TournamentName;

const styles = StyleSheet.create({});
