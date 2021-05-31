import React, { Component } from 'react';
import {StyleSheet,Text,View,Button} from 'react-native';

export default ({navigation}) => {
 
  return (
    <View style={styles.container}>
      <Text>Items Left</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  }
});