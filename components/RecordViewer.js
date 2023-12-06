import * as React from "react";
import { Text, View, StyleSheet, Button } from "react-native";
import { Audio } from "expo-av";

const [recording, setRecording] = React.useState();

export async function startRecording() {
  try {
    console.log("Requesting permissions..");
    await Audio.requestPermissionsAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });

    console.log("Starting recording..");
    const { recording } = await Audio.Recording.createAsync(
      Audio.RecordingOptionsPresets.HIGH_QUALITY
    );
    setRecording(recording);
    console.log("Recording started");
  } catch (err) {
    console.error("Failed to start recording", err);
  }

  let uri = await setTimeout(() => {
    stopRecording();
  }, 5000); // stops recording after 5 seconds

  return uri;
}

async function stopRecording() {
  console.log("Stopping recording..");
  setRecording(undefined);
  await recording.stopAndUnloadAsync();
  await Audio.setAudioModeAsync({
    allowsRecordingIOS: false,
  });
  return recording.getURI();
}

/* 
  return (
    <View style={styles.container}>
      <Button
        title={recording ? 'Stop Recording' : 'Start Recording'}
        onPress={recording ? stopRecording : startRecording}
      />
    </View>
  );
  */
