import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import PlayersScreen from "../screens/PlayersScreen";
import {
  MaterialCommunityIcons,
  FontAwesome,
  MaterialIcons,
} from "@expo/vector-icons";
import { createStackNavigator } from "@react-navigation/stack";
import TournamentScreen from "../screens/TournamentScreen";
import {
  CommonActions,
  getFocusedRouteNameFromRoute,
  useFocusEffect,
} from "@react-navigation/native";
import GroupMatches from "../screens/GroupMatches";
import { useAuth } from "../hooks/AuthContext";

const Tabs = createBottomTabNavigator();
const TournmentStack = createStackNavigator();

const Tournment = ({ navigation }) => {

  const {user} = useAuth()
  return(
    
    <TournmentStack.Navigator>
      <TournmentStack.Screen
        options={{
          headerShown: false,
        }}
        name="Home"
        component={HomeScreen}
      />
      <TournmentStack.Screen
        name="Tournament Details"
        component={TournamentScreen}
      />
    
      <TournmentStack.Screen name="GroupMatches" component={GroupMatches} />
       
      
    </TournmentStack.Navigator>
  );

}
 

const Main = () => {
  return (
    <Tournment/>
  );
};

export default Main;

const styles = StyleSheet.create({});
