import { Appbar, BottomNavigation } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import Edit from './components/Edit';
import Kamera from './components/Kamera';
import React, { useState } from 'react';

const App : React.FC = () : React.ReactElement => {

  const EditRoute = () => <Edit/>
  const KameraRoute = () => <Kamera/>

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key : "edit", title : "Editoi", focusedIcon : "image-edit", unfocusedIcon : "image-edit-outline" },
    { key : "kamera", title : "Kamera", focusedIcon : "camera", unfocusedIcon : "camera-outline" }
  ]);

  const renderScene = BottomNavigation.SceneMap({
    edit : EditRoute,
    kamera : KameraRoute
  });

  return (
    <>
    <Appbar.Header>
      <Appbar.Content title="Kamera ja kuvan editointi-appi" />
    </Appbar.Header>
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
      activeColor="blue"
      inactiveColor="black"
      compact={true}
      sceneAnimationEnabled={true}
      sceneAnimationType="shifting"
      barStyle={{ backgroundColor : "#EEEEEE" }}
    />
    <StatusBar style="auto" />
    </>
  );
}

export default App;