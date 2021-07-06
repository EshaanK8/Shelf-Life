import React from 'react';
import {StyleSheet,Text,View} from 'react-native';

export default ({navigation}) => {
 
  return (
    <View style={styles.container}>
      <Text>Confirm Products</Text>
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