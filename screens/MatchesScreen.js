import * as React from 'react';
import { View, useWindowDimensions } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import Participants from './Participants';
import MatchScreen from "./MatchScreen";
import GroupsScreen from "./GroupsScreen";
import { SafeAreaView } from 'react-native-safe-area-context';




const  Details = ({navigation, route})=> {
 const {tournament} = route.params
  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'participants', title: 'Players' },
    { key: 'table', title: 'Standings' },
    {key: 'matches', title: 'Matches'}
  ]);

  const renderScene = ({ route}) => {
    switch (route.key) {
      case 'participants':
        return <Participants tournament={tournament}/>;
      case 'table':
        return <GroupsScreen tournament ={tournament}/>;
    case 'matches':
        return <MatchScreen tournament ={tournament} />;
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>

   
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
     
    />
     </SafeAreaView>
  );
}

export default Details;