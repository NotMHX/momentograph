import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
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
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Look at all your moments!</Text>
      {moments.map((current) => {
        const index = moments.indexOf(current);
        const key = allKeys[index];
        console.log(current.image + " " + current.time);
        if (current) {
          return (
            <View style={styles.listEntry} id={key}>
              <Image source={{ uri: current.image }} />
              <Text>{current.time}</Text>
            </View>
          );
        }
        return <Text>No moments captured yet!</Text>;
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listEntry: {
    marginTop: "10px",
  },
});
