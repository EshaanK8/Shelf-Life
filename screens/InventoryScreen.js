import React, {Component, useState} from 'react';
import {StyleSheet,Text,View,Button, TouchableOpacity, FlatList, ScrollView, Dimensions} from 'react-native';
import Icon from 'react-native-vector-icons/Fontisto';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Constants from 'expo-constants';
import ProductCard from '../components/ProductCard';
import ScanContainer from '../components/ScanContainer';


export default ({navigation}) => {

  const [productData, setProductData] = useState([
    {key: '0'},
    {name: "Milk", key: '1', dateAdded: 'June 22, 2021', image: 'https://i5.walmartimages.ca/images/Large/514/354/6000202514354.jpg'}, 
    {name: "Cheese", key: '2', dateAdded: 'June 22, 2021', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUZSdO4N-DM1hOYiMXsc2uDIKlIb1IZGNVaA&usqp=CAU'}, 
    {name: "Bread", key: '3', dateAdded: 'June 22, 2021', image: 'https://dempsters.ca/sites/default/files/styles/large/public/2021-02/excvpcx0pdpa5msj0m08.png?itok=qh-WSJIG'},
    {name: "Bread", key: '4', dateAdded: 'June 22, 2021', image: 'https://dempsters.ca/sites/default/files/styles/large/public/2021-02/excvpcx0pdpa5msj0m08.png?itok=qh-WSJIG'},
  ]);
  
  return (

    <View style = {{paddingTop: Constants.statusBarHeight, backgroundColor: "white"}}>
      <View style = {styles.headerContainer}>
        <View style = {styles.welcomeTextContainer}>
          <Text style = {styles.welcomeText}>Good Evening</Text>
        </View>
        <TouchableOpacity style = {styles.settingsContainer} onPress={() => navigation.push('SettingsScreen')}>
          <Icon name='player-settings' style = {styles.settingsIcon} size={25}/>
        </TouchableOpacity>
      </View>
      <FlatList
      data={productData} 
      renderItem={({item}) => {
        if (item.key == "0") {
          return <ScanContainer/>
        }
        else {
          return <ProductCard item = {item}/>
        }
      }}
    />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
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
  welcomeTextContainer: {
    height: Dimensions.get('window').height * 0.08,
    paddingLeft: '5%',
    paddingTop: '3%'
  },
  welcomeText: {
    fontSize:20,
    fontWeight:"700"
  }


});