import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function MomentsScreen() {
  const [allKeys, setAllKeys] = useState([]);
  const [moments, setMoments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setAllKeys(await AsyncStorage.getAllKeys());
        console.log("All keys: " + allKeys.toString());

        const moments = await Promise.all(
          allKeys.map(async (currentKey) => {
            const currentMoment = await AsyncStorage.getItem(currentKey);
            return JSON.parse(currentMoment);
          })
        );
        setMoments(moments);
      } catch (error) {
        console.error("Error fetching data ", error);
      }
    };

    fetchData();
  }, []);

  return (
    <ScrollView
      style={{
        flex: 1,
        contentContainerStyle: "center",
        contentContainerStyle: "center",
      }}
    >
      <Text>Here you go</Text>
      {moments.map((current) => {
        const index = moments.indexOf(current);
        const key = allKeys[index];
        console.log("image #" + index + ": " + current.image);
        if (current) {
          return (
            <View style={styles.listEntry} id={key}>
              <Image
                style={styles.imageEntry}
                source={{ uri: current.image }}
              />
              <Text>{current.time}</Text>
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
