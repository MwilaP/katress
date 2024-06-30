import { StatusBar } from "expo-status-bar";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import Main from "./navigation/Main";
import { NavigationContainer } from "@react-navigation/native";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ModalPortal } from "react-native-modals";
import { SocketProvider } from "./hooks/SocketProvider";
export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <NavigationContainer>
          <SocketProvider>
            <StatusBar style="auto" />

            <Main />
            <ModalPortal />
          </SocketProvider>
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
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
