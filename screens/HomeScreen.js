import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Modal,
  TextInput,
  Button,
  Alert
} from "react-native";
import React, { useCallback, useLayoutEffect, useState } from "react";
import { useFocusEffect, useTheme } from "@react-navigation/native";
import axios from "axios";
import serverUrl from "../hooks/server";
import { SafeAreaView } from "react-native-safe-area-context";
import { FAB } from 'react-native-paper';

const HomeScreen = ({ navigation }) => {
  const [tournaments, setTournments] = useState("");
  const [loading, setLoading] = useState(true);
  const [createModalVisible, setCreateModalVisible] = useState(false);



  useFocusEffect(
    useCallback(() => {
      const getTournaments = async () => {
        try {
          const tournament = await axios.get(`${serverUrl}/tournaments`);
          if (tournament.data) {
            setTournments(tournament.data);
            console.log(tournament.data)
          }
        } catch (error) {}
      };
      getTournaments();
      setLoading(false);
    }, [])
  );


  const CreateTournamentModal = ({ visible, onClose, onCreateTournament }) => {
    const [name, setName] = useState('');
    const [date, setDate] = useState('');
    const [loading, setLoading] = useState(false)
  
    const handleCreate = async () => {
      try {
        setLoading(true)

        const tourna = await axios.post(`${serverUrl}/tournaments/`,{name: name})
        if(tourna.status == 201){
          setTournments([tourna.data, ...tournaments])
          setLoading(false)
        }
        
      } catch (error) {
        console.log(error)

        Alert.alert('error', 'sometthing went wrong')
        
      }
    };
  
    return (
      <Modal visible={visible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Create New Tournament</Text>
            <TextInput
              style={styles.input}
              placeholder="Tournament Name"
              value={name}
              onChangeText={setName}
            />
            
            <View style={{padding: 2}}>
            <Button  title="Create" onPress={handleCreate} />  
            </View>

            
          </View>
        </View>
      </Modal>
    );
  };

  const Tournament = ({ item }) => {
    console.log('Items: ', item)
    return (
      <View
        style={{
          backgroundColor: "white",
          //width: "95%",
          height: 150,
          marginBottom: 5,

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
        <Pressable
          onPress={() =>
            navigation.navigate("Tournament Details", { tournament: item })
          }
        >
          <View style={{ padding: 10 }}>
            <Text style={{ fontWeight: "700", padding: 5 }}>{item?.name}</Text>
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
                <Text style={{ fontWeight: "700" }}>
                  {item?.players?.length}
                </Text>
              </View>
            </View>
          </View>
        </Pressable>
      </View>
    );
  };
  return (
    <SafeAreaView style={{flex: 1}}>

   
    <View style={styles.container}>
    <Text style={styles.header}>MPM Tournaments</Text>
    <FlatList
      data={tournaments}
      renderItem={({ item }) => <Tournament item={item} />}
      keyExtractor={(item) => item._id}
    />
    <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => setCreateModalVisible(true)}
      />
      <CreateTournamentModal
        visible={createModalVisible}
        onClose={() => setCreateModalVisible(false)}
       // onCreateTournament={createTournament}
      />
  </View>
  </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,},
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      backgroundColor: 'white',
      padding: 20,
      borderRadius: 10,
      elevation: 5,
      width: '80%',
    },
    modalHeader: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    input: {
      borderWidth: 1,
      borderColor: '#ddd',
      padding: 10,
      marginBottom: 10,
      borderRadius: 5,
    },

});
