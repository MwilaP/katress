import { FlatList, StyleSheet, Text, View } from "react-native";
import React from "react";

const GroupMatches = ({ route }) => {
  const { matches } = route.params;
  return (
    <View style={{ backgroundColor: "white", flex: 1 }}>
      <FlatList
        data={matches}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <View
            style={{
              height: 60,
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: 10
            }}
          >
            <View style={{flexDirection: 'row', justifyContent: 'space-around', width: '90%'}}>
              <Text style={{fontSize: 17, fontWeight: '700'}}>{`${item[0].name}`}</Text>
              <Text> vs </Text>
              <Text style={{fontSize: 17, fontWeight: '700'}}>{` ${item[1].name}`}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default GroupMatches;

const styles = StyleSheet.create({});
