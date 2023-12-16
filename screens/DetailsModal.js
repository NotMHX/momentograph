import React from "react";
import { View, StyleSheet, Modal, Text, Image, Button } from "react-native";

export default function DetailsModal({ visible, toggle, moment }) {
  return (
    <Modal visible={visible} onRequestClose={toggle} animationType="slide">
      <View style={styles.container}>
        <Image style={styles.imageEntry} source={{ uri: moment.image }} />
        <Text>Time: {moment.time}</Text>
        <Text>Other details are being added soon!</Text>

        <Button style={styles.button} title={"Close"} onPress={toggle} />
      </View>
    </Modal>
  );
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
