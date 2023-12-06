import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import CameraViewer from "../components/CameraViewer";
// import { startRecording } from "../components/RecordViewer";
import { Header } from "react-native/Libraries/NewAppScreen";
import { Audio } from "expo-av";
import * as Location from "expo-location";

const [image, setImage] = useState("../assets/icon.png");
const [time, setTime] = useState("2023");
// const [recording, setRecording] = useState("");
// const [sound, setSound] = useState("");

export default function CaptureScreen() {
  const createMoment = async () => {
    setImage(await takePicture(camera));
    setTime(new Date().getDate());
    // setRecording(startRecording());
  };

  const takePicture = async () => {
    if (camera) {
      const data = await camera.takePictureAsync(null);
      console.log(data.uri);
      return data.uri;
    }
  };

  /* async function playSound() {
    console.log("Loading Sound");
    const { sound } = await Audio.Sound.createAsync(recording);
    setSound(sound);

    console.log("Playing Sound");
    await sound.playAsync();
  } */

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <CameraViewer />
      <Button
        style={styles.button}
        title={"Take Picture"}
        onPress={createMoment}
      />

      <h1>Result</h1>
      <img src={image}></img>
      <Text>{time}</Text>
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
