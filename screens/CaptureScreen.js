import React, { useState, useEffect, useRef, createRef } from "react";
import { View, Text, StyleSheet, Button, Image } from "react-native";
import CameraViewer from "../components/CameraViewer";
import { Camera } from "expo-camera";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { Magnetometer } from "expo-sensors";
import { useBatteryLevel } from "expo-battery";

export default function CaptureScreen() {
  let randomUUID = () => {
    return "xxxxxxxx-xxxx-4xxx".replace(/[xy]/g, function (c) {
      let r = (Math.random() * 16) | 0,
        v = c == "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  const currentBattery = useBatteryLevel();

  const createMoment = async () => {
    try {
      const image = await takePictureAsync();
      const time = new Date().toLocaleString();
      const location = await fetchCity();
      const compass = await fetchCompass();
      const battery = Math.round(currentBattery * 100, 1);
      await saveMoment(image, time, location, compass, battery);
    } catch (error) {
      console.error("Error creating moment: " + error);
    }
  };

  const saveMoment = async (
    newImage,
    newTime,
    newLocation,
    newCompass,
    newBattery
  ) => {
    const newKey = randomUUID();

    const newJson = {
      image: newImage,
      time: newTime,
      location: newLocation,
      compass: newCompass,
      battery: newBattery,
    };

    const newJsonString = JSON.stringify(newJson);

    console.log("key: " + newKey);
    console.log("moment: " + newJsonString);

    await AsyncStorage.setItem(newKey, newJsonString);
  };

  // camera logic
  const [cameraPermission, setCameraPermission] = useState();
  const cameraReference = useRef(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [mag, setMag] = useState({
    x: 0,
    y: 0,
    z: 0,
  });

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

  const fetchCompass = async () => {
    const subscription = Magnetometer.addListener((result) => {
      setMag(result);
      subscription.remove(); // Remove the listener after getting the data
    });
    console.log(mag.x);
    const angle = getAngle(mag);
    const angleDir = getDirection(angle);
    return angle + "° " + angleDir;
  };

  const getDirection = (degree) => {
    if (degree >= 22.5 && degree < 67.5) {
      return "NE";
    } else if (degree >= 67.5 && degree < 112.5) {
      return "E";
    } else if (degree >= 112.5 && degree < 157.5) {
      return "SE";
    } else if (degree >= 157.5 && degree < 202.5) {
      return "S";
    } else if (degree >= 202.5 && degree < 247.5) {
      return "SW";
    } else if (degree >= 247.5 && degree < 292.5) {
      return "W";
    } else if (degree >= 292.5 && degree < 337.5) {
      return "NW";
    } else {
      return "N";
    }
  };

  const getAngle = (magnetometer) => {
    let angle = 0;
    if (magnetometer) {
      let { x, y, z } = magnetometer;
      if (Math.atan2(y, x) >= 0) {
        angle = Math.atan2(y, x) * (180 / Math.PI);
      } else {
        angle = (Math.atan2(y, x) + 2 * Math.PI) * (180 / Math.PI);
      }
    }
    return Math.round(angle);
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
