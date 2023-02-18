import React, {useState, useRef} from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Button,  FAB, Text } from 'react-native-paper';
import { Camera, CameraCapturedPicture, FlashMode } from 'expo-camera'
import * as MediaLibrary from 'expo-media-library';
import Slider from '@react-native-community/slider';

const Kamera : React.FC = () : React.ReactElement => {
  
    const [virhe, setVirhe] = useState<string>("");
    const [kuvaustila, setKuvaustila] = useState<boolean>(false);
    const [tallennusLupa, setTallennusLupa] = useState<boolean>(false);
    const [kuvaustilaInfo, setKuvaustilaInfo] = useState<string>("");
    const [kuva, setKuva] = useState<CameraCapturedPicture>();
    const [zoom, setZoom] = useState<number>(0);

    const kameraRef : any = useRef<Camera>();

    const kaynnistaKamera = async () : Promise<void> => {

      const {status} = await Camera.requestCameraPermissionsAsync();
      if (status === "granted") {
        setKuvaustila(true);
        setVirhe(""); 
      } else {
        setVirhe("Lupa kameran käyttöön ei myönnetty."); 
      }
    }
  
    const otaKuva = async () : Promise<void> => {
      const {status} = await MediaLibrary.requestPermissionsAsync();
      if (status === "granted") {
        setTallennusLupa(true);
        setVirhe("");
      } else {
        setVirhe("Lupa tallennukseen hylätty.");
      }
      setKuvaustilaInfo("Käsitellään...");
      if (kameraRef) {
        const apukuva : CameraCapturedPicture = await kameraRef.current.takePictureAsync();
        setKuva(apukuva);
      }
      setKuvaustila(false);
      setKuvaustilaInfo("");
    }

    const tallennaKuva = async () => {
      MediaLibrary.saveToLibraryAsync(kuva!.uri).then(() => {
        setKuva(undefined);
        setKuvaustila(true);
      })
    }

    const zoomaus = (luku : number) => {
      setZoom(luku);
    }

  return (
    (kuvaustila)?
    <>
    <Camera 
          style={styles.kameranakyma} 
          ref={kameraRef}
          autoFocus={true}
          flashMode={FlashMode.auto}
          zoom={zoom}
        >
        <Text style={{color : "#fff", fontSize : 20}}>{kuvaustilaInfo}</Text>
        <FAB
          style={styles.nappiOtaKuva}
          icon="camera"
          label='Ota kuva'
          onPress={otaKuva}
        />
        <Slider
          style={{width: 200, height: 40, top : "25%"}}
          minimumValue={0}
          maximumValue={1}
          minimumTrackTintColor="#FFFFFF"
          maximumTrackTintColor="#000000"
          onValueChange={zoomaus}
          
        />
     </Camera>
     </>
    :<>
      {(kuva)
        ? <> 
        <View style={styles.container}>
        <Image 
            style={styles.kuva}
            source={{ uri : kuva.uri}}
          />
          <Button
           onPress={tallennaKuva}
           mode="contained" 
           style={{padding : 10, width : "70%"}}
          >Tallenna kuva</Button>
          <Button
           onPress={() => {setKuvaustila(true); setKuva(undefined);}}
           mode="contained"
           style={{padding : 10, width : "70%", marginTop : 5, marginBottom : 30}}
          >Hylkää kuva</Button>
          </View>
          </>
        :
        <View style={styles.container}>
        <Button
          icon="camera"
          mode="contained"
          onPress={kaynnistaKamera}
        >Ota kuva</Button>
        <Text>{virhe}</Text>
      </View> 
      }
     </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nappiSulje: {
    position : 'absolute',
    margin : 20,
    bottom : 0,
    right :0    
  },
  nappiOtaKuva: {
    position : 'absolute',
    margin : 20,
    bottom : 0,
  },  
  kameranakyma: {
    flex : 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  kuva: {
    width: "80%",
    height: "80%",
    resizeMode: 'contain'
  }
});

export default Kamera;