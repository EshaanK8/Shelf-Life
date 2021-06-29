import React from "react";
import {StyleSheet, Text, View} from "react-native";
import AnimatedLoader from 'react-native-animated-loader';

const App = () => (
  <View style={[styles.container, styles.horizontal]}>
    <AnimatedLoader visible={true} overlayColor="rgba(255,255,255,0.75)" source={require("../assets/loader.json")} animationStyle={{width: 80, height: 80}} speed={2}/>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center"
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10
  }
});

export default App;