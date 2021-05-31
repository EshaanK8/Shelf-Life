import React, {Component, useState} from 'react';
import {StyleSheet,Text,View,Button, TouchableOpacity, FlatList} from 'react-native';
import Icon from 'react-native-vector-icons/Fontisto';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Constants from 'expo-constants';
import ProductCard from '../components/ProductCard';

export default ({navigation}) => {

  const [productData, setProductData] = useState([
    {name: "Milk", key: '1', dateAdded: 'June 22, 2021', image: 'https://i5.walmartimages.ca/images/Large/514/354/6000202514354.jpg'}, 
    {name: "Cheese", key: '2', dateAdded: 'June 22, 2021', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUZSdO4N-DM1hOYiMXsc2uDIKlIb1IZGNVaA&usqp=CAU'}, 
    {name: "Bread", key: '3', dateAdded: 'June 22, 2021', image: 'https://dempsters.ca/sites/default/files/styles/large/public/2021-02/excvpcx0pdpa5msj0m08.png?itok=qh-WSJIG'},
  ]);
  
  return (
    <View style={styles.container}>
      <TouchableOpacity style = {styles.settingsContainer} onPress={() => navigation.push('SettingsScreen')}>
        <Icon name='player-settings' style = {styles.settingsIcon} size={30}/>
      </TouchableOpacity>
      <View style = {styles.scanContainer}>
        <TouchableOpacity style={[styles.scanButton, styles.receiptButton]} onPress={() => navigation.push('ReceiptScannerScreen')}>
          <View style = {{marginBottom: "2%"}}>
            <Text style = {styles.scanText}>Scan an item</Text>
          </View>
          <View style = {styles.scanIcon}>
            <Ionicons name='barcode-outline' style = {styles.settingsIcon} size = {100}/>
          </View>
          
        </TouchableOpacity>
        <TouchableOpacity style = {[styles.scanButton, styles.barcodeButton]} onPress={() => navigation.push('BarcodeScannerScreen')}>
          <View style = {{marginBottom: "2%"}}>
            <Text style = {styles.scanText}>Scan your receipt</Text>
          </View>
          <View style = {styles.scanIcon}>
            <Ionicons name='ios-scan' style = {styles.settingsIcon} size = {90}/>
          </View>
        </TouchableOpacity>
      </View>

      <View style = {styles.cardsContainer}>
        <FlatList 
          data={productData} 
          renderItem={({item}) => <ProductCard item = {item}/>} key={(item,index)=>index.toString()}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    paddingTop: Constants.statusBarHeight,
  },
  scanContainer: {
    flex: 1,
    flexDirection: "row",
    width: '100%',
    alignItems: 'center',
    paddingLeft: '5%',
    paddingRight: '5%'
  },
  settingsContainer: {
    width: '100%',
    padding: "5%",
    paddingBottom: "2%",
    paddingTop: "3%",
    alignItems: 'flex-end'
  },
  cardsContainer: {
    flex: 2,
    width: '100%',
    paddingLeft: '5%',
    paddingRight: '5%',
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
    marginRight:"auto"
  },
  barcodeButton: {
    marginLeft:"auto"
  },
  scanText: {
    fontSize: 20,
  },
  scanIcon: {
    width: "100%", 
    height: "65%", 
    alignItems: "center", 
    justifyContent: "center"
  }

});