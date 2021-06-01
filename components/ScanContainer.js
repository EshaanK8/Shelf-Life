import React, {Component, useState} from 'react';
import {StyleSheet,Text,View,Button, TouchableOpacity, FlatList, ScrollView, Dimensions} from 'react-native';
import Icon from 'react-native-vector-icons/Fontisto';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Constants from 'expo-constants';
import { useNavigation } from '@react-navigation/native';

export default () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style = {styles.scanContainer}>
        <TouchableOpacity style={[styles.scanButton, styles.receiptButton]} onPress={() => navigation.push('BarcodeScannerScreen')}>
          <View>
            <Text style = {styles.scanText}>Scan an item</Text>
          </View>
          <View style = {styles.scanIcon}>
            <Ionicons name='barcode-outline' style = {styles.settingsIcon} size = {90}/>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style = {[styles.scanButton, styles.barcodeButton]} onPress={() => navigation.push('ReceiptScannerScreen')}>
          <View>
            <Text style = {styles.scanText}>Scan your receipt</Text>
          </View>
          <View style = {styles.scanIcon}>
            <Ionicons name='ios-scan' style = {styles.settingsIcon} size = {80}/>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    height: Dimensions.get('window').height * 0.22
  },
  scanContainer: {
    flex: 1,
    flexDirection: "row",
    width: '100%',
    alignItems: 'center',
    paddingLeft: '5%',
    paddingRight: '5%',
  },
  settingsContainer: {
    flex:1,
    paddingRight: "5%",
    paddingTop: "3%",
    alignItems: 'flex-end',
  },
  scanButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#DDDDDD",
    width:'46.5%',
    height: '80%',
    borderRadius: 10,
    backgroundColor: "rgba(142, 228, 175, 0.3)",
  },
  settingsIcon: {
  },
  receiptButton: {
    marginRight:"auto",
  },
  barcodeButton: {
    marginLeft:"auto"
  },
  scanText: {
    fontSize: 15,
    alignSelf: 'center'
  },
  scanIcon: {
    width: "100%", 
    height: "65%", 
    alignItems: "center", 
    justifyContent: "center"
  },
  headerContainer: {
    flexDirection: "row"
  },
});