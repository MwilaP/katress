import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Participants from "./Participants";
import TournamentName from "./TournamentName";
import FormatScreen from "./FormatScreen";
import MatchScreen from "./MatchScreen";
import GroupsScreen from "./GroupsScreen";
import { createStackNavigator } from "@react-navigation/stack";
import GroupMatches from "./GroupMatches";

const TopTab = createMaterialTopTabNavigator();
const GroupStack = createStackNavigator();

const Groups = ({ navigation }) => (
  <GroupStack.Navigator>
    <TopTab.Screen
      options={{
        headerShown: false,
      }}
      name="Table"
      component={GroupsScreen}
    />
    <TopTab.Screen name="GroupMatches" component={GroupMatches} />
  </GroupStack.Navigator>
);

const TournamentScreen = ({ navigation, route }) => {
  const data = route?.params?.tournament ? route?.params?.tournament : "";
  return (
    <TopTab.Navigator
      screenOptions={{
        tabBarAllowFontScaling: true,
        tabBarScrollEnabled: true,
        tabBarLabelStyle: {
          fontSize: 13,
        },
      }}
    >
      <TopTab.Screen name="Participants">
        {(props) => <Participants {...props} tournament={data} />}
      </TopTab.Screen>
      <TopTab.Screen name="Table">
        {(props) => <GroupsScreen {...props} tournament={data} />}
      </TopTab.Screen>
      <TopTab.Screen name="Matches">
        {(props) => <MatchScreen {...props} tournament={data} />}
      </TopTab.Screen>
    </TopTab.Navigator>
  );
};
export default TournamentScreen;

const styles = StyleSheet.create({});
