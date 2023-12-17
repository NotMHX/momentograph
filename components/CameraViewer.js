import { StyleSheet, View } from "react-native";
import { Camera } from "expo-camera";
import { useIsFocused } from "@react-navigation/native";

export default function CameraViewer({ reference, type }) {
  const isFocused = useIsFocused();
  return (
    <View style={styles.cameraContainer}>
      {isFocused && (
        <Camera
          ref={reference}
          style={styles.fixedRatio}
          type={type}
          ratio={"1:1"}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  cameraContainer: {
    flex: 0.8,
  },
  fixedRatio: {
    flex: 1,
    aspectRatio: 1,
  },
  button: {
    flex: 0.1,
    padding: 10,
    alignSelf: "flex-end",
    alignItems: "center",
  },
});

// https://snack.expo.dev/@pipz0r/camera
