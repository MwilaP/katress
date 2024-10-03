import React, { useCallback, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Modal,
  TextInput,
  Alert,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import serverUrl from "../hooks/server";
import { SafeAreaView } from "react-native-safe-area-context";
import { FAB } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const HomeScreen = ({ navigation }) => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createModalVisible, setCreateModalVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const getTournaments = async () => {
        try {
          const response = await axios.get(`${serverUrl}/tournaments`);
          if (response.data) {
            setTournaments(response.data);
          }
        } catch (error) {
          console.error("Error fetching tournaments:", error);
        }
      };
      getTournaments();
      setLoading(false);
    }, [])
  );

  const CreateTournamentModal = ({ visible, onClose }) => {
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);

    const handleCreate = async () => {
      if (!name.trim()) {
        Alert.alert('Error', 'Please enter a tournament name');
        return;
      }

      try {
        setLoading(true);
        const response = await axios.post(`${serverUrl}/tournaments/`, { name });
        if (response.status === 201) {
          setTournaments([response.data, ...tournaments]);
          setCreateModalVisible(false);
        }
      } catch (error) {
        console.error("Error creating tournament:", error);
        Alert.alert('Error', 'Something went wrong. Please try again.');
      } finally {
        setLoading(false);
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
              placeholderTextColor="#a0a0a0"
              value={name}
              onChangeText={setName}
            />
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity style={styles.createButton} onPress={handleCreate} disabled={loading}>
                <Text style={styles.buttonText}>{loading ? 'Creating...' : 'Create'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const Tournament = ({ item }) => (
    <View style={{ alignItems: 'center', margin: 2 }}> 

   
    <TouchableOpacity
      style={styles.tournamentCard}
      onPress={() => navigation.navigate("Tournament Details", { tournament: item })}
    >
      <View style={styles.cardContent}>
        <MaterialCommunityIcons name="trophy-outline" size={40} color="#FFD700" />
        <View style={styles.tournamentInfo}>
          <Text style={styles.tournamentName}>{item?.name}</Text>
          <Text style={styles.participantsCount}>
            {item?.players?.length} Participants
          </Text>
        </View>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={24} color="#a0a0a0" />
    </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
   
    <View style={styles.headerContainer}>
      <View style={styles.headerContent}>
        <MaterialCommunityIcons name="trophy" size={32} color="#FFD700" />
        <Text style={styles.headerText}>MPM Tournaments</Text>
      </View>
    </View>
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#4A90E2" />
      ) : (
        <FlatList
          data={tournaments}
          renderItem={({ item }) => <Tournament item={item} />}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
        />
      )}
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => setCreateModalVisible(true)}
        color="white"
      />
      <CreateTournamentModal
        visible={createModalVisible}
        onClose={() => setCreateModalVisible(false)}
      />
    </View>
  </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
   padding: 6,
   
  // paddingVertical: 5
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  listContainer: {
    paddingBottom: 80,
  },
  tournamentCard: {
    flexDirection: 'row',
    width: '95%',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 2,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tournamentInfo: {
    marginLeft: 16,
  },
  tournamentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  participantsCount: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#4A90E2',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 12,
    width: '80%',
  },
  modalHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  createButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
  },
  cancelButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4A90E2',
    flex: 1,
    marginLeft: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cancelButtonText: {
    color: '#4A90E2',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headerContainer: {
    backgroundColor: '#fff',
    paddingTop: 20,
    paddingBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginLeft: 10,
  },
});

export default HomeScreen;