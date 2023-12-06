import * as React from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import CameraViewer from "../components/CameraViewer";

export default function CaptureScreen() {
  const takePicture = async () => {
    if (camera) {
      const data = await camera.takePictureAsync(null);
      console.log(data.uri);
      setImageUri(data.uri);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <CameraViewer />
      <Button
        style={styles.button}
        title={"Take Picture"}
        onPress={takePicture}
      />
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
