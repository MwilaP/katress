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

const Groups = ({navigation}) => (
  <GroupStack.Navigator>
    <TopTab.Screen options={{
      headerShown: false
    }} name="Table" component={GroupsScreen} />
    <TopTab.Screen name="GroupMatches" component={GroupMatches} />


  </GroupStack.Navigator>
);

const TournamentScreen = ({ navigation }) => (
  <TopTab.Navigator
    screenOptions={{
      tabBarAllowFontScaling: true,
      tabBarScrollEnabled: true,
      tabBarLabelStyle: {
        fontSize: 13,
      },
    }}
  >
    <TopTab.Screen name="information" component={TournamentName} />
    <TopTab.Screen name="Participants" component={Participants} />
    <TopTab.Screen name="Table" component={GroupsScreen} />
    <TopTab.Screen name="Matches" component={MatchScreen} />
  </TopTab.Navigator>
);
export default TournamentScreen;

const styles = StyleSheet.create({});
