import React, { useState, useEffect, useRef, createRef } from "react";
import { View, Text, StyleSheet, Button, Image } from "react-native";
import CameraViewer from "../components/CameraViewer";
import { Camera } from "expo-camera";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";

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
      const location = await fetchCity();
      await saveMoment(image, time, location);
    } catch (error) {
      console.error("Error creating moment: " + error);
    }
  };

  const saveMoment = async (newImage, newTime, newLocation) => {
    const newKey = randomUUID();

    const newJson = {
      image: newImage,
      time: newTime,
      location: newLocation,
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

    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }
  };

  const fetchCity = async () => {
    const location = await Location.getCurrentPositionAsync({});
    const latitude = location.coords.latitude;
    const longitude = location.coords.longitude;
    console.log(latitude + ", " + longitude);

    const response = await fetch(
      `https://geocode.maps.co/reverse?lat=${latitude}&lon=${longitude}`
    );

    const result = await response.json();

    if (result.address.city) {
      // if recorded in a city
      return result.address.city + ", " + result.address.country;
    } else if (result.address.village) {
      // if recorded in a village
      return result.address.village + ", " + result.address.country;
    } else {
      // if neither is detected
      return result.address.country;
    }
  };

  useEffect(() => {
    permisionFunction();
  }, []);

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
