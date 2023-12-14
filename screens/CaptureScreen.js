import React, { useState, useEffect, useRef, createRef } from "react";
import { View, Text, StyleSheet, Button, Image } from "react-native";
import CameraViewer from "../components/CameraViewer";
import { Camera } from "expo-camera";
import AsyncStorage from "@react-native-async-storage/async-storage";

// import { startRecording } from "../components/RecordViewer";
import { Header } from "react-native/Libraries/NewAppScreen";
import { Audio } from "expo-av";
import * as Location from "expo-location";

// const [recording, setRecording] = useState("");
// const [sound, setSound] = useState("");

export default function CaptureScreen() {
  let randomUUID = () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        let r = (Math.random() * 16) | 0,
          v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  };

  const createMoment = async () => {
    const image = await takePictureAsync();
    const time = new Date().toLocaleString();
    // setRecording(startRecording());
    saveMoment(image, time);
  };

  const saveMoment = async (newImage, newTime) => {
    const newKey = randomUUID();

    const newJson = {
      image: newImage,
      time: newTime,
    };

    console.log("key: " + newKey);
    console.log("mit stringify: " + JSON.stringify(newJson));

    await AsyncStorage.setItem(newKey, JSON.stringify(newJson));
  };

  // camera logic
  const [cameraPermission, setCameraPermission] = useState();
  const cameraReference = useRef(null);
  const [type, setType] = useState(Camera.Constants.Type.back);

  const takePictureAsync = async () => {
    if (cameraReference.current) {
      const data = await cameraReference.current.takePictureAsync(null);
      console.log(data.uri);
      return data.uri;
    }
  };

  const permisionFunction = async () => {
    // here is how you can get the camera permission
    const cameraPermission = await Camera.requestCameraPermissionsAsync();

    setCameraPermission(cameraPermission.status === "granted");

    if (cameraPermission.status !== "granted") {
      alert("Permission for media access needed.");
    }
  };

  useEffect(() => {
    permisionFunction();
  }, []);

  /* async function playSound() {
    console.log("Loading Sound");
    const { sound } = await Audio.Sound.createAsync(recording);
    setSound(sound);

    console.log("Playing Sound");
    await sound.playAsync();
  } */

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <CameraViewer reference={cameraReference} type={type} />
      <Button
        style={styles.button}
        title={"Take Picture"}
        onPress={createMoment}
      />
      {/* <Button title="Play Sound" onPress={playSound()} /> */}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    flex: 0.1,
    padding: 10,
    marginBottom: 2,
    alignSelf: "flex-end",
    alignItems: "center",
  },
});
