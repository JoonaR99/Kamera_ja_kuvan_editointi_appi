import { StatusBar } from 'expo-status-bar';
import { Image, StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import React, { useState } from 'react';

const Edit : React.FC = () : React.ReactElement => {
  
  const [kuva, setKuva] = useState<any>();
  const [kuvaValittu, setKuvaValittu] = useState<boolean>(false);
  const [tallennusLupa, setTallennusLupa] = useState<boolean>(false);
  const [virhe, setVirhe] = useState<string>("");
  
  const valitseKuva = async () : Promise<void> => {
    let valittu = await ImagePicker.launchImageLibraryAsync({
      mediaTypes : ImagePicker.MediaTypeOptions.Images,
      allowsEditing : true,
      quality : 1
    });
    if (valittu.cancelled) {
      setKuva(null);
      setKuvaValittu(false);
    } else {
      setKuva(valittu.uri);
      setKuvaValittu(true);
    }
  }

  const tallennaKuva = async () : Promise<void> => {
    const {status} = await MediaLibrary.requestPermissionsAsync();
      if (status === "granted") {
      setTallennusLupa(true);
      setVirhe("");
      } else {
        setVirhe("Lupa tallennukseen hylätty.");
      }
      MediaLibrary.saveToLibraryAsync(kuva).then(() => {
        setKuva(null);
        setKuvaValittu(false);
      });
  }

  return (
    (kuvaValittu)
    ?
    <View style={styles.container}>
      <Image source={{ uri : kuva }} style={{ width: "80%", height: "80%", resizeMode: 'contain' }}/>
      <Button
        style={{padding : 10, width : "70%"}}
        mode="contained"
        onPress={tallennaKuva}
      >Tallenna</Button>
      <Button
       style={{padding : 10, width : "70%", marginBottom : 60, marginTop : 15}}
       mode="contained"
       onPress={() => setKuvaValittu(false)}
      >Peruuta</Button>
      <Text>{virhe}</Text>
      <StatusBar style="auto" />
    </View>
    :
    <View style={styles.container}>
      <Button
        onPress={valitseKuva}
        mode="contained"
        style={{padding : 5}}
      >Valitse kuva mitä haluat editoida</Button>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Edit;