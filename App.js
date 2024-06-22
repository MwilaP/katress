import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import Main from "./navigation/Main";
import { NavigationContainer } from "@react-navigation/native";
import { PaperProvider } from 'react-native-paper';
export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Main />
      </NavigationContainer>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
