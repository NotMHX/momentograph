import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Modal,
  Pressable,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DetailsModal from "./DetailsModal";

export default function MomentsScreen() {
  const [allKeys, setAllKeys] = useState([]);
  const [moments, setMoments] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    (async () => {
      const allKeys = await fetchKeys();
      setAllKeys(allKeys);
      const moments = await fetchImages(allKeys);
      setMoments(moments);
    })();
  }, []);

  return (
    <ScrollView
      style={{
        flex: 1,
        contentContainerStyle: "center",
        contentContainerStyle: "center",
      }}
    >
      {moments.map((current) => {
        // console.log("image #" + index + ": " + current.image);
        if (current) {
          return (
            <View style={styles.listEntry}>
              <Pressable onPress={toggleModal}>
                <Image
                  style={styles.imageEntry}
                  source={{ uri: current.image }}
                />
              </Pressable>
              <DetailsModal
                visible={modalVisible}
                toggle={toggleModal}
                moment={current}
              />
            </View>
          );
        }
        return (
          <ScrollView>
            <Text>No moments captured yet!</Text>
          </ScrollView>
        );
      })}
    </ScrollView>
  );

  async function fetchKeys() {
    return await AsyncStorage.getAllKeys();
  }

  async function fetchItem(currentKey) {
    currentMoment = await AsyncStorage.getItem(currentKey);
    return currentMoment;
  }

  async function fetchImages(keys) {
    let moments = await Promise.all(
      keys.map(async (currentKey) => {
        var currentMoment = await fetchItem(currentKey);
        return JSON.parse(currentMoment);
      })
    );
    return moments;
  }

  function toggleModal() {
    setModalVisible(!modalVisible);
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listEntry: {
    paddingTop: "10px",
  },
  imageEntry: {
    width: 100, // Set your desired width
    height: 100, // Set your desired height
    resizeMode: "cover", // Adjust as needed
  },
});
