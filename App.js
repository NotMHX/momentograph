import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import CaptureScreen from "./screens/CaptureScreen";
import MomentsScreen from "./screens/MomentsScreen";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen
          name="Capture New Moments"
          component={CaptureScreen}
          options={{
            tabBarLabel: "New",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="camera-plus"
                color={color}
                size={size}
              />
            ),
          }}
        />
        <Tab.Screen
          name="All Moments"
          component={MomentsScreen}
          options={{
            tabBarLabel: "Moments",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="file-star"
                color={color}
                size={size}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
