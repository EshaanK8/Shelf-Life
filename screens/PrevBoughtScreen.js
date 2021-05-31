import React, { Component } from 'react';
import {StyleSheet,Text,View,Button} from 'react-native';

export default ({navigation}) => {
 
  return (
    <View style={styles.container}>
      <Button title="Product Details" onPress={() => navigation.push('ProductDetailsScreen')}/>
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