import { useEffect, useState, useRef } from "react"
import { StatusBar } from "expo-status-bar"
import { Camera, CameraType } from "expo-camera"
import { shareAsync } from "expo-sharing"
import * as MediaLibrary  from 'expo-media-library'
import FlipCamera from 'react-native-vector-icons/Ionicons'
import Circle from 'react-native-vector-icons/FontAwesome'
import Close from 'react-native-vector-icons/EvilIcons'
import Share from 'react-native-vector-icons/Entypo'
import { Avatar } from "react-native-elements"
import { View, StyleSheet, TouchableOpacity, Image, Modal } from "react-native"



const App = ()=>{
  const cameraRef = useRef(null)
  const [hasCameraPermission, setHasCameraPermission] = useState()
  const [hasMediaPermission, setHasMediaPermission] = useState()
  const [type, setType] = useState(CameraType.back)
  const [photo, setPhoto] = useState()
  const [mode, setMode] = useState(false)

  

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


  const showPicture = ()=>{
    if(mode){
      setMode(false)
    }else{
      setMode(true)
    }
  }
  
  
  const sharePicture = ()=>{
    shareAsync(photo.uri).then(()=>{
    }).catch(e=>{
      alert('Falha no compartilhamento', e)
    })
  }

  return(
    <Camera style={styles.container} type={type}
      ref={cameraRef}>      
      <StatusBar style="auto"/>
     
      <Modal
        animationType="slide"
        transparent={true}
        visible={mode}>

        <View style={{flex:1, margin:30}}>
          <View style={styles.btnPicContainer}>
            <TouchableOpacity style={{marginBottom:10}}
              onPress={sharePicture}>
              <Share name="share" size={30} color='blue'/>
            </TouchableOpacity>
            <TouchableOpacity style={{marginBottom:10}}
              onPress={()=> setMode(false)}>
              <Close name="close-o" size={30} color='red'/>
            </TouchableOpacity>
          </View>
          <Image style={styles.preview} source={{ uri: photo && photo.uri }} />          
        </View>

      </Modal>

      
      <View style={styles.iconContainer}>        
        <TouchableOpacity onPress={showPicture}>
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
  btnPicContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  iconContainer: {
    position:'relative',
    top: '165%',
    margin: 15,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  preview: {
    width: '95%',
    height: '70%'
  }
})

export default App