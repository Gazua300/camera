import { useEffect, useState, useRef } from "react"
import { Camera, CameraType } from "expo-camera"
import { shareAsync } from "expo-sharing"
import * as MediaLibrary  from 'expo-media-library'
import FlipCamera from 'react-native-vector-icons/Ionicons'
import Circle from 'react-native-vector-icons/FontAwesome'
import { Avatar } from "react-native-elements"
import { View, StyleSheet, StatusBar, TouchableOpacity, SafeAreaView } from "react-native"



const App = ()=>{
  const cameraRef = useRef(null)
  const [hasCameraPermission, setHasCameraPermission] = useState()
  const [hasMediaPermission, setHasMediaPermission] = useState()
  const [type, setType] = useState(CameraType.back)
  const [photo, setPhoto] = useState()
  


  useEffect(()=>{
    (async()=>{
      const cameraPermission = await Camera.requestCameraPermissionsAsync()
      const mediaPermission = await MediaLibrary.requestPermissionsAsync()

      setHasCameraPermission(cameraPermission.status === 'granted')
      setHasMediaPermission(mediaPermission.status === 'granted')
    
    })()
  }, [])


  
  const turnCamera = ()=>{
    if(type === CameraType.back){
      setType(CameraType.front)
    }else{
      setType(CameraType.back)
    }
  }


  const takePicture = async()=>{
    const options = {
      quality: 1,
      base64: true,
      exif: false
    }

    let newPhoto = await cameraRef.current.takePictureAsync(options)
    setPhoto(newPhoto)
    
  }

  return(
    <Camera style={styles.container} type={type}
      ref={cameraRef}>      
      <StatusBar backgroundColor='rgba(0, 0, 0, 0.8)'/>
      <View style={styles.iconContainer}>
        <TouchableOpacity>
          <Avatar rounded size='medium'
            source={{uri: photo && photo.uri }}/>
        </TouchableOpacity>
        <TouchableOpacity onPress={takePicture}>
          <Circle name="circle-thin" size={80} color='whitesmoke'/>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={turnCamera}>
          <FlipCamera name="camera-reverse-outline" size={50} color='whitesmoke'/>
        </TouchableOpacity>        
      </View>
    </Camera>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    
  },
  iconContainer: {
    position:'relative',
    top: '165%',
    margin: 15,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  }
})

export default App