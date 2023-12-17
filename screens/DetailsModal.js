import React, { useState } from "react";
import { View, StyleSheet, Modal, Text, Image, Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function DetailsModal({ visible, toggle, moment, passedKey }) {
  const [showConfirmation, setShowConfirmation] = useState(false);

  return (
    <Modal visible={visible} onRequestClose={toggle} animationType="slide">
      <View style={styles.container}>
        <Button style={styles.button} title={"Close"} onPress={toggle} />
        <Image style={styles.imageEntry} source={{ uri: moment.image }} />
        <Text>Time: {moment.time}</Text>
        <Text>Location: {moment.location}</Text>
        <Text>Other details are being added soon!</Text>
        {!showConfirmation && (
          <View>
            <Button
              style={styles.button}
              title={"Delete"}
              onPress={confirmRemoval}
            />
          </View>
        )}
        {showConfirmation && (
          <View>
            <Text>Are you sure you want to delete this moment?</Text>
            <Button
              style={styles.button}
              title={"Yes"}
              onPress={handleConfirmRemoval}
            />
            <Button
              style={styles.button}
              title={"Cancel"}
              onPress={handleCancelRemoval}
            />
          </View>
        )}
      </View>
    </Modal>
  );

  function confirmRemoval() {
    setShowConfirmation(true);
  }

  async function handleConfirmRemoval() {
    setShowConfirmation(false);
    try {
      await AsyncStorage.removeItem(passedKey);
      console.log("Moment " + passedKey + " deleted.");
      toggle();
    } catch {
      console.log("Error with deleting moment " + passedKey);
    }
  }

  function handleCancelRemoval() {
    setShowConfirmation(false);
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageEntry: {
    width: 300, // Set your desired width
    height: 300, // Set your desired height
    // Adjust as needed
  },
  button: {
    flex: 0.1,
    padding: 10,
    marginBottom: 2,
    alignSelf: "flex-end",
    alignItems: "center",
  },
});
