import React, { useState, useEffect, useRef, createRef } from "react";
import { View, Text, StyleSheet, Button, Image } from "react-native";
import CameraViewer from "../components/CameraViewer";
import { Camera } from "expo-camera";
import AsyncStorage from "@react-native-async-storage/async-storage";

import RecordViewer from "../components/RecordViewer";
import { Header } from "react-native/Libraries/NewAppScreen";
import { Audio } from "expo-av";
// import * as Location from "expo-location";

export default function CaptureScreen() {
  let randomUUID = () => {
    return "xxxxxxxx-xxxx-4xxx".replace(/[xy]/g, function (c) {
      let r = (Math.random() * 16) | 0,
        v = c == "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  const createMoment = async () => {
    try {
      const image = await takePictureAsync();
      const time = new Date().toLocaleString();
      const recording = await RecordViewer.startRecording();
      await saveMoment(image, time, recording);
    } catch (error) {
      console.error("Error creating moment: " + error);
    }
  };

  const saveMoment = async (newImage, newTime, newRecording) => {
    const newKey = randomUUID();

    const newJson = {
      image: newImage,
      time: newTime,
      recording: newRecording,
    };

    const newJsonString = JSON.stringify(newJson);

    console.log("key: " + newKey);
    console.log("mit stringify: " + newJsonString);
    console.log("can it convert back? " + JSON.parse(newJsonString).image);

    await AsyncStorage.setItem(newKey, newJsonString);
  };

  // camera logic
  const [cameraPermission, setCameraPermission] = useState();
  const cameraReference = useRef(null);
  const [type, setType] = useState(Camera.Constants.Type.back);

  const takePictureAsync = async () => {
    if (cameraReference.current) {
      const data = await cameraReference.current.takePictureAsync(null);
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

  async function playSound() {
    console.log("Loading Sound");
    const { sound } = await Audio.Sound.createAsync(recording);
    setSound(sound);

    console.log("Playing Sound");
    await sound.playAsync();
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <CameraViewer reference={cameraReference} type={type} />
      <Button style={styles.button} title={"Create!"} onPress={createMoment} />
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
