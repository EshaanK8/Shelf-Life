import React, { Component, useState} from 'react';
import {StyleSheet,View, TextInput, TouchableOpacity, useWindowDimensions, Alert} from 'react-native';
import{AuthContext} from '../components/context'
import { firebase } from '../src/firebase/config'
import LoadingScreen from './LoadingScreen'
import { useFonts } from 'expo-font';
import AnimatedLoader from 'react-native-animated-loader';

import * as eva from '@eva-design/eva';
import { ApplicationProvider, Layout, Text, Button } from '@ui-kitten/components';
import { default as theme } from '../custom-theme.json'; // <-- Import app theme
import { default as mapping } from '../mapping.json'; // <-- Import app mapping

import GradientButton from 'react-native-gradient-buttons';
import {responsiveHeight,responsiveWidth,responsiveFontSize} from "react-native-responsive-dimensions";




export default function LoginScreen({navigation}) {
  const [loaded] = useFonts({
    Lato: require('../assets/Lato/Lato-Regular.ttf'),
  });
  const windowHeight = useWindowDimensions().height;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = React.useState(false)
  const {signIn} = React.useContext(AuthContext) //Get the signIn function from the AuthContext
  const [showDone, setShowDone] = useState(false);


  

  const onFooterLinkPress = () => {
    navigation.push('CreateAccountScreen')
  }
  

  const doSignIn = () => {
    console.log("start")
    setIsLoading(true)
    firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((response) => {
      console.log("Logged in!")
      //firebase.firestore().settings({ experimentalForceLongPolling: true });

        const uid = response.user.uid
        const usersRef = firebase.firestore().collection('users')
        usersRef
            .doc(uid)
            .get()
            .then(firestoreDocument => {
                if (!firestoreDocument.exists) {
                    alert("User does not exist anymore.")
                    return;
                }
                const user = firestoreDocument.data()
                signIn(user)
            })
            .catch(error => {
                setIsLoading(false)
                alert(error)
            })
    })
    .catch(error => {
        setIsLoading(false)
        alert(error)
    })
  }

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
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(text) => setEmail(text)}
                    value={email}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />

                <View>
                    {showDone && <Text style={{color: '#b522f2', fontSize: responsiveFontSize(1.8),fontFamily: 'PTSans_400Regular'}}>Email sent. Please check your email.</Text>}
                </View>
            
                <GradientButton text="Send Email" width='90%' violetPink textStyle={{ fontSize: responsiveFontSize(2.1), fontFamily: 'PTSans_700Bold' }} impact radius={10} height={responsiveHeight(5)} style={{marginTop:'15%', marginBottom:'2%',}} onPressAction={forgotPassword(email)}/>
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
    borderRadius: 10,
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
     alignItems: 'center'
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
  marginTop:"30%",
  width: "90%",
  flexDirection: 'column', 
  alignItems: 'flex-start' 
},

welcomeText: {
  fontWeight: "bold",
  color: "black",
  fontSize: 25,
  fontSize: responsiveFontSize(3),
  fontFamily: 'PTSans_700Bold',
},
signInText: {
  fontWeight: "bold",
  color: "lightgrey",
  fontSize: 20,
  marginTop: "1%",
  fontSize: responsiveFontSize(2.9),
  fontFamily: 'PTSans_700Bold',
},

});
