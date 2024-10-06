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
import Details from "../screens/MatchesScreen";

const TournmentStack = createStackNavigator();
const Tab = createBottomTabNavigator()

const Tournment = ({ navigation }) => (
  <TournmentStack.Navigator>
    <TournmentStack.Screen
      options={{
        headerShown: false,
      }}
      name="Home"
      component={HomeScreen}
    />
    <TournmentStack.Screen
    
      name="Tournament"
      component={Details}
    />
    <TournmentStack.Screen name="GroupMatches" component={GroupMatches} />
    <TournmentStack.Screen name="Players" component={PlayersScreen} />
    
    

  </TournmentStack.Navigator>
);


 const TournmentTab = ()=> (
  <Tab.Navigator>
      <Tab.Screen  options={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="trophy" size={32} color="#FFD700" />
          ),

          tabBarStyle: ((route) => {
            const routeName = getFocusedRouteNameFromRoute(route) ?? "Home";
            if (routeName !== "Home") {
              return { display: "none" };
            }
          })(route),
        })}
        name="Tournaments"
        component={Tournment}
      /> 
      <Tab.Screen name="Members" component={PlayersScreen} />
    </Tab.Navigator>
 )
 

const Main = () => {
  return (
    <Tournment/>
  );
};

export default Main;

const styles = StyleSheet.create({});
