import React, {useState} from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import{AuthContext} from '../components/context'
import {responsiveFontSize} from "react-native-responsive-dimensions";
import { responsiveHeight, responsiveWidth, responsiveScreenHeight } from 'react-native-responsive-dimensions';
import AnimatedLoader from 'react-native-animated-loader';

export default ({navigation, route}) => {
  const {data} = route.params;
  const {signIn} = React.useContext(AuthContext) //Get the signIn function from the AuthContext
  const [isLoading, setIsLoading] = useState(false)
  const slides = [
    {
        key: 'one',
        title: 'Quick add',
        text: 'Scan the barcode of any item to quickly add it to your inventory',
        image: require('../assets/barcode.png'),
        backgroundColor: '#59b2ab',
    },
    {
        key: 'two',
        title: 'Search for a new item',
        text: "Don't want to scan your item? Give it a quick search!",
        image: require('../assets/search.png'),
        backgroundColor: '#febe29',
    },
    {
        key: 'three',
        title: 'Check your home inventory',
        text: "At the store, wondering if you have any milk left at home? Scan the milk, and we'll tell you how many you already have.",
        image: require('../assets/barcode-3.png'),
        backgroundColor: '#22bcb5',
    }
  ]

  const _renderItem = ({ item }) => {
    return (
      <View style={styles.slide}>
        <View style={{flex:0.3, paddingTop:"30%", paddingLeft:"5%", paddingRight:"5%"}}>
          <Text style={styles.title} numberOfLines = {2}>{item.title}</Text>
        </View>
        <View style={{flex:0.4, width:"100%", alignItems:"center", paddingTop:"5%"}}>
          <Image source={item.image} style={styles.image} />
        </View>
        <View style={{flex:0.3, paddingTop:"5%", paddingLeft:"5%", paddingRight:"5%"}}>
          <Text style={styles.text}>{item.text}</Text>
        </View>
      </View>
    );
  }

  const _onDone = () => {
    setIsLoading(true)
    signIn(data)
  }
  
  if (isLoading) {
    return <View style={{position:"absolute",top:0,bottom:0,left:0,right:0, alignItems: "center", justifyContent: "center", backgroundColor: "#4c29e6"}}>
      <AnimatedLoader visible={true} overlayColor="#4c29e6" source={require("../assets/loader.json")} animationStyle={{width: 80, height: 80}} speed={2}/>
    </View>
  }
  
  return (
    <AppIntroSlider renderItem={_renderItem} data={slides} onDone={_onDone}/>
  )

}

const styles = StyleSheet.create({
    slide: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: '#4c29e6',
    },
    image: {
      width: responsiveWidth(60),
      height: responsiveWidth(60),
      resizeMode: 'contain'
    },
    text: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontFamily: 'PTSans_400Regular',
        fontSize: responsiveFontSize(2.4),
        textAlign: 'center',
        alignSelf: 'stretch'
    },
    title: {
        color: 'white',
        fontFamily: 'PTSans_700Bold',
        fontSize: responsiveFontSize(4.4),
        textAlign: 'center',
    },
    buttonCircle: {
      width: 40,
      height: 40,
      backgroundColor: 'rgba(0, 0, 0, .2)',
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
    }
  });