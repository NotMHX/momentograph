import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function MomentsScreen() {
  const [momentList, setMomentList] = useState([]);
  const [testing, setTesting] = useState("nothing");
  const [allKeys, setAllKeys] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setAllKeys(await AsyncStorage.getAllKeys());
        const moments = await Promise.all(
          allKeys.map((currentKey) => {
            const { key, currentMoment } = AsyncStorage.getItem(currentKey);
            return JSON.parse(currentMoment);
          })
        );
        setTesting(moments);
        setMomentList(moments);
      } catch (error) {
        console.error("Error fetching data ", error);
      }
    };

    fetchData();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Look at all your moments!</Text>
      <Text>{allKeys.toString()}</Text>
      <View>
        {Object.entries(momentList).map((currentItem) => (
          <View style={styles.listEntry}>
            <Image source={{ uri: currentItem.image }}></Image>
            <Text>{currentItem.time}</Text>
          </View>
        ))}
      </View>
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
