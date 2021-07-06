import React, {useState} from 'react';
import {StyleSheet,View, TextInput,useWindowDimensions, TouchableOpacity} from 'react-native';
import { firebase } from '../src/firebase/config'
import { useFonts } from 'expo-font';
import AnimatedLoader from 'react-native-animated-loader';

import * as eva from '@eva-design/eva';
import { ApplicationProvider, Layout, Text } from '@ui-kitten/components';
import { default as mapping } from '../mapping.json'; // <-- Import app mapping

import GradientButton from 'react-native-gradient-buttons';
import {responsiveHeight, responsiveFontSize} from "react-native-responsive-dimensions";




export default function LoginScreen({navigation}) {
  const [loaded] = useFonts({
    Lato: require('../assets/Lato/Lato-Regular.ttf'),
  });
  const windowHeight = useWindowDimensions().height;
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = React.useState(false)
  const [showDone, setShowDone] = useState(false);

  const AppButton = ({ onPress, title }) => (
    <TouchableOpacity onPress={onPress} style={styles.appButtonContainer}>
      <Text style={styles.appButtonText}>{title}</Text>
    </TouchableOpacity>
  );

  forgotPassword = (Email) => {
    firebase.auth().sendPasswordResetEmail(Email)
      .then(function (user) {
        setShowDone(true)
      }).catch(function (e) {
        console.log(e)
      })
  }

  //Render Loading Screen
  if (isLoading) {
    return <View style={{position:"absolute",top:0,bottom:0,left:0,right:0, alignItems: "center", justifyContent: "center"}}>
      <AnimatedLoader visible={true} overlayColor="rgba(255,255,255,0.75)" source={require("../assets/loader.json")} animationStyle={{width: 80, height: 80}} speed={2}/>
    </View>
  }

  return (
    <ApplicationProvider {...eva} theme={eva.light} customMapping={mapping}>
      <Layout style={[styles.container, {minHeight: Math.round(windowHeight)}]}>
          <Layout style={styles.mainLayout} keyboardShouldPersistTaps="always">

              <View style={styles.welcomeView}>
                <Text style ={styles.welcomeText}>Reset Your Password</Text>
                <Text style ={styles.signInText}>Please enter your email</Text>
              </View>

                <TextInput
                    style={styles.emailInput}
                    placeholder='E-mail'
                    placeholderTextColor="white"
                    onChangeText={(text) => setEmail(text.replace(/\s/g, ''))}
                    value={email}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />

                <View>
                    {showDone && <Text style={{color: '#b522f2', fontSize: responsiveFontSize(1.8),fontFamily: 'PTSans_400Regular'}}>Email sent. Please check your email.</Text>}
                </View>
            
                <AppButton title="Send Email" onPress={forgotPassword(email)}/>
          </Layout>
      </Layout>
    </ApplicationProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#F5FCFF'
  },
  emailInput: {
    marginTop: '20%',
    height: 50,
    margin: 12,
    borderWidth: 1,
    borderRadius: 50,
    paddingLeft: 15,
    width: "90%",
    borderColor: "lightgrey"
  },
  passwordInput: {
    height: 50,
    margin: 12,
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 15,
    width: "90%",
    borderColor: "lightgrey"

  },
  mainLayout: {
     flex: 1, 
     width: '100%',
     alignItems: 'center',
     backgroundColor: "#4c29e6"
  },
  signInButton: {
    marginTop:'15%',
    marginBottom:'2%',
    width: "90%",
    borderRadius: 10
 },
  signUpButton: {
    marginTop:'2%',
    marginBottom:'2%',
    width: "90%",
    borderRadius: 10
 },
 createText: {
  marginTop:"30%",
  flexDirection: 'row', 
  justifyContent: 'center', 
  alignItems: 'center' 
},

welcomeView: {
  marginTop:"20%",
  width: "90%",
  flexDirection: 'column', 
  alignItems: 'flex-start' 
},

welcomeText: {
  color: "white",
  fontSize: 25,
  fontSize: responsiveFontSize(3),
  fontFamily: 'PTSans_700Bold',
},
signInText: {
  color: "white",
  fontSize: 20,
  marginTop: "1%",
  fontSize: responsiveFontSize(2.9),
  fontFamily: 'PTSans_400Regular',
},
appButtonContainer: {
  backgroundColor: "#E100B2",
  borderRadius: 30,
  paddingVertical: "4%",
  paddingHorizontal: "6%",
  width:"70%",
  marginTop:"10%"
},
appButtonText: {
  fontSize: responsiveFontSize(2.2),
  color: "#fff",
  fontFamily: 'PTSans_700Bold',
  alignSelf: "center",
},

});
