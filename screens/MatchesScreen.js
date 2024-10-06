import React, { useCallback, useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useRoute } from "@react-navigation/native";
import Participants from './Participants';
import MatchScreen from "./MatchScreen";
import GroupsScreen from "./GroupsScreen";

const Details = () => {
    const route = useRoute();
    const [tournament, setTournaments] = useState({});
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('participants');

    useFocusEffect(
        useCallback(() => {
            if (route.params) {
                setTournaments(route.params.tournament);
                setLoading(false);
            }
        }, [])
    );

    const tabs = [
        { key: 'participants', title: 'Players' },
        { key: 'table', title: 'Standings' },
        { key: 'matches', title: 'Matches' }
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'participants':
                return <Participants tournament={tournament} />;
            case 'table':
                return <GroupsScreen tournament={tournament} />;
            case 'matches':
                return <MatchScreen tournament={tournament} />;
            default:
                return null;
        }
    };

    if (loading) {
        return (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="large" color="blue" />
          </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.tabContainer}>
                {tabs.map((tab) => (
                    <TouchableOpacity
                        key={tab.key}
                        style={[styles.tab, activeTab === tab.key && styles.activeTab]}
                        onPress={() => setActiveTab(tab.key)}
                    >
                        <Text style={[styles.tabText, activeTab === tab.key && styles.activeTabText]}>
                            {tab.title}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
            <View style={styles.content}>
                {renderContent()}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    tabContainer: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    tab: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: '#007AFF',
    },
    tabText: {
        color: '#333',
    },
    activeTabText: {
        color: '#007AFF',
    },
    content: {
        flex: 1,
    },
});

export default Details;