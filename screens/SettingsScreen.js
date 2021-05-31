import React, { Component, useState, useEffect, useFocusEffect} from 'react';
import {StyleSheet,Text,View,Button} from 'react-native';
import InventoryScreen from './InventoryScreen'
import { CommonActions } from '@react-navigation/native';
import { firebase } from '../src/firebase/config'
import LoadingScreen from './LoadingScreen'
import{AuthContext} from '../components/context'

export default ({navigation}) => {
  const {signOutG} = React.useContext(AuthContext) //Get the signIn function from the AuthContext
  const [isLoading, setIsLoading] = React.useState(false)

  //Render Loading Screen
  if (isLoading) {
    return <LoadingScreen/>
  }


  return (
      <View style={styles.container}>
      <Text>Settings</Text>
      <Button title="Sign Out" marginTop = {100} onPress={() => {signOutG()}}/>
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

