import React from 'react';
import {StyleSheet,Text,View,TouchableOpacity, Image,Dimensions} from 'react-native';
import Icon from 'react-native-vector-icons/Fontisto';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import {responsiveHeight,responsiveFontSize} from "react-native-responsive-dimensions";
import Collapsible from 'react-native-collapsible';
import barcodeAdd from '../assets/barcode.png'
import barcode from '../assets/barcode-3.png'
import search from '../assets/search.png'

export default (props) => {
  const navigation = useNavigation();

  return (
    <View>
      <Collapsible collapsed={!props.show}>
        <View>
          <View style={styles.bigTitleContainer}>
            <View style={styles.bigSmallTitleContainer}>
              <Text style={styles.bigTitle} numberOfLines = {1}>Welcome, {props.fullName} 👋</Text>
            </View>
            <View style = {styles.settingsContainer}>
              <TouchableOpacity onPress={props.handleSettingsButton}>
                <Icon name='player-settings' style = {styles.settingsIcon} size={25} color="white"/>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.container}>
            <View style = {styles.addContainer}>  
              <TouchableOpacity style={[styles.scanButton, styles.receiptButton]} onPress={() => navigation.push('BarcodeScannerScreen')}>
                <View style = {styles.scanIcon}>
                  <Image source = {barcodeAdd} style = {{width: responsiveHeight(8), height: responsiveHeight(8)}}/>
                </View>
                <View style = {styles.headerButtonContainer}>
                  <Text style = {styles.scanText}>Quick add</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style = {[styles.scanButton, styles.barcodeButton]} onPress={props.handleAddButton}>
                <View style = {styles.scanIcon}>
                  <Image source = {search} style = {{width: responsiveHeight(8), height: responsiveHeight(8)}}/>
                </View>
                <View style = {styles.headerButtonContainer}>
                  <Text style = {styles.scanText}>Search for a new item</Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style = {styles.scanContainer}>  
              <TouchableOpacity style={styles.checkButton} onPress={() => navigation.push('CheckScannerScreen')}>
                <View style = {styles.scanIcon}>
                  <Image source = {barcode} style = {{width: responsiveHeight(8), height: responsiveHeight(8)}}/>
                </View>
                <View style = {styles.headerButtonContainer}>
                  <Text style = {styles.scanText}>Check home inventory</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Collapsible>
      <View style={styles.titleContainer}>
        <View style={styles.smallTitleContainer}>
          <Text style={styles.title}>My Products 🥬</Text>
        </View>
        <View style = {styles.searchContainer}>
          <TouchableOpacity onPress={props.handleSearchButton}>
            {(props.show) ? (
              <Ionicons name='ios-search' style = {styles.searchIcon} size={25} color="black"/>
            )
          :(
            <Ionicons name='close-circle-outline' style = {styles.searchIcon} size={25} color="black"/>
          )}
            
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4c29e6',
    borderBottomLeftRadius: 50,
    height: Dimensions.get('window').height * 0.44
  },
  scanContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    paddingLeft: '5%',
    paddingRight: '5%',
  },
  addContainer: {
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
    width:'46.5%',
    height: '70%',
    borderRadius: 15,
  },
  settingsIcon: {
  },
  receiptButton: {
    marginRight:"auto",
    backgroundColor: "#f5ce40"
  },
  checkButton: {
    alignItems: "center",
    justifyContent: "center",
    width:'100%',
    height: '70%',
    borderRadius: 15,
    backgroundColor: "#ff9a97"
  },
  barcodeButton: {
    marginLeft:"auto",
    backgroundColor: "#75cefe"
  },
  scanText: {
    fontSize: responsiveFontSize(1.6),
    fontFamily: 'PTSans_700Bold',
    color: "white",
    textAlign: "center"
  },
  scanIcon: {
    width: "100%", 
    flex:2,
    alignItems: "center", 
    justifyContent: "center",
  },
  headerButtonContainer: {
    width: "80%", 
    flex:1,
    alignItems: "center", 
    justifyContent: "center",
  },
  headerContainer: {
    flexDirection: "row"
  },
  titleContainer: {
    flexDirection: "row",
    width:"100%",
    backgroundColor: "white",
    flex:3,
    paddingLeft: '5%',
    paddingRight: '5%',
    paddingTop: '5%',
    paddingBottom: "2%"
  },
  title: {
    fontSize: responsiveFontSize(3),
    fontFamily: 'PTSans_700Bold'
  },
  bigTitleContainer: {
    flexDirection: "row",
    width:"100%",
    backgroundColor: "#4c29e6",
    height: Dimensions.get('window').height * 0.08,
    paddingLeft: '5%',
    paddingRight: '5%',
    paddingTop: '5%',
  },
  bigTitle: {
    fontSize: responsiveFontSize(3),
    fontFamily: 'PTSans_700Bold',
    color: "white"
  },
  searchContainer: {
    flex:0.5,
    alignItems: "flex-end"
  },
  settingsContainer: {
    flex:0.5,
    alignItems: "flex-end"
  },
  smallTitleContainer: {
    flex:3,
  },
  bigSmallTitleContainer: {
    flex:3
  }
});