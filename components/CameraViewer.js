import React, { useState, useEffect } from "react";
import { StyleSheet, View, Image } from "react-native";
import { Camera } from "expo-camera";

function useChange() {
  const [camera, setCamera] = useState(null);
  function set(value) {
    setCamera(value);
  }

  return { set, camera };
}

export default function CameraViewer() {
  const { set, camera } = useChange();
  const [cameraPermission, setCameraPermission] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);

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

  return (
    <View>
      <View style={styles.cameraContainer}>
        <Camera
          ref={(ref) => set(ref)}
          style={styles.fixedRatio}
          type={type}
          ratio={"1:1"}
        />
      </View>

      {imageUri && <Image source={{ uri: imageUri }} style={{ flex: 1 }} />}
    </View>
  );
}

export async function takePhoto() {
  const { set, camera } = useChange();
  if (camera) {
    const data = await camera.takePictureAsync(null);
    console.log(data.uri);
    return data.uri;
  } else {
    return "no image found";
  }
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
