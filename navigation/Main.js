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

const Tabs = createBottomTabNavigator();
const TournmentStack = createStackNavigator();

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
      name="Tournament Details"
      component={TournamentScreen}
    />
    <TournmentStack.Screen name="GroupMatches" component={GroupMatches} />
  </TournmentStack.Navigator>
);

const Main = () => {
  return (
    <Tabs.Navigator
      screenOptions={{
        tabBarHideOnKeyboard: true,

        safeAreaInsets: { top: 0 },
        tabBarActiveTintColor: "#0d518a",
        tabBarInactiveTintColor: "grey",
        // "tabBarShowLabel": false,
        tabBarShowIcon: true,
        tabBarLabelStyle: {
          //"marginTop":10,
          fontSize: 10,
        },
        tabBarIconStyle: {
          //"flex": 0.7,
          alignItems: "center",
          height: 30,
          width: 40,
          // "backgroundColor": "blue"
        },
        tabBarIndicatorStyle: {
          backgroundColor: "#0d518a",
        },
        tabBarStyle: {
          //"flex": 0.1,
          justifyContent: "space-between",
          height: 60,
          elevation: 10,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          backgroundColor: "#fff",

          position: "absolute",
          bottom: 0,
          //display: "none"
        },
        navigationBarColor: "white",
      }}
    >
      <Tabs.Screen
        options={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="leaderboard" size={24} color={color} />
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
      <Tabs.Screen
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome name="group" size={24} color={color} />
          ),
        }}
        name="Players"
        component={PlayersScreen}
      />
    </Tabs.Navigator>
  );
};

export default Main;

const styles = StyleSheet.create({});
