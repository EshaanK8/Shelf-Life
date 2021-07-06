import React, { useState} from 'react';
import {StyleSheet,View, TextInput, TouchableOpacity, useWindowDimensions, Button, Alert} from 'react-native';
import{AuthContext} from '../components/context'
import { firebase } from '../src/firebase/config'
import { useFonts } from 'expo-font';
import {responsiveHeight,responsiveFontSize} from "react-native-responsive-dimensions";
import AnimatedLoader from 'react-native-animated-loader';

import * as eva from '@eva-design/eva';
import { ApplicationProvider, Layout, Text } from '@ui-kitten/components';
import { default as mapping } from '../mapping.json'; // <-- Import app mapping

import GradientButton from 'react-native-gradient-buttons';



export default function LoginScreen({navigation}) {
  const [loaded] = useFonts({
    Lato: require('../assets/Lato/Lato-Regular.ttf'),
  });

  const windowHeight = useWindowDimensions().height;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = React.useState(false)
  const {signIn} = React.useContext(AuthContext) //Get the signIn function from the AuthContext

  const AppButton = ({ onPress, title }) => (
    <TouchableOpacity onPress={onPress} style={styles.appButtonContainer}>
      <Text style={styles.appButtonText}>{title}</Text>
    </TouchableOpacity>
  );
  

  const onFooterLinkPress = () => {
    navigation.navigate('CreateAccountScreen')
  }
  

  const doSignIn = () => {
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
    
  

  //Render Loading Screen
  if (isLoading) {
    return <View style={{position:"absolute",top:0,bottom:0,left:0,right:0, alignItems: "center", justifyContent: "center", backgroundColor: "#4c29e6"}}>
      <AnimatedLoader visible={true} overlayColor="#4c29e6" source={require("../assets/loader.json")} animationStyle={{width: 80, height: 80}} speed={2}/>
    </View>
  }

  return (
    <ApplicationProvider {...eva} theme={eva.light} customMapping={mapping}>
      <Layout style={[styles.container, {minHeight: Math.round(windowHeight)}]}>
          <Layout style={styles.mainLayout} keyboardShouldPersistTaps="always">

              <View style={styles.welcomeView}>
                <Text style ={styles.welcomeText}>Your pantry awaits you</Text>
                <Text style ={styles.signInText}>Sign in to continue</Text>
              </View>

                <TextInput
                    style={styles.emailInput}
                    placeholder='E-mail'
                    placeholderTextColor="white"
                    onChangeText={(text) => setEmail(text.replace(/\s/g, ''))}
                    value={email}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                    color="white"
                />
                <TextInput
                    style={styles.passwordInput}
                    placeholderTextColor="white"
                    secureTextEntry
                    placeholder='Password'
                    onChangeText={(text) => setPassword(text.replace(/\s/g, ''))}
                    value={password}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                    color="white"
                />
                <View style={styles.forgotText}>
                  <TouchableOpacity onPress = {() => navigation.navigate('ForgotPasswordScreen')}>
                    <Text style={{color: 'white', fontSize: responsiveFontSize(1.8),fontFamily: 'PTSans_400Regular'}}>Forgot Password?</Text>
                  </TouchableOpacity>
                </View>

                <AppButton title="Sign in" onPress={() => doSignIn()}/>

                <View style={styles.createText}>
                  <Text style={{fontSize: responsiveFontSize(1.8),fontFamily: 'PTSans_400Regular', color:"white"}}>Don't have an account? </Text>
                  <TouchableOpacity onPress = {onFooterLinkPress}>
                    <Text style={{color: '#FF0079', fontSize: responsiveFontSize(1.8),fontFamily: 'PTSans_400Regular'}}>Sign up</Text>
                  </TouchableOpacity>
                </View>
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
    fontFamily: 'PTSans_400Regular',
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
    fontFamily: 'PTSans_400Regular',
    height: 50,
    margin: 12,
    borderWidth: 1,
    borderRadius: 50,
    paddingLeft: 15,
    width: "90%",
    borderColor: "lightgrey"
  },
  mainLayout: {
     flex: 1, 
     width: '100%',
     alignItems: 'center',
     backgroundColor: "#4c29e6",
  },
  signInButton: {
    marginTop:'15%',
    marginBottom:'2%',
    width: "90%",
    borderRadius: 10,
    //backgroundColor: "linear-gradient(90deg, rgba(254,87,89,1) 0%, rgba(217,72,122,1) 35%, rgba(116,32,214,1) 100%);"
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
forgotText: {
  width:"100%",
  paddingRight: "5%",
  flexDirection: 'column', 
  justifyContent: 'center',
  alignItems: "flex-end",
},
welcomeView: {
  marginTop:"3%",
  width: "90%",
  flexDirection: 'column', 
  alignItems: 'flex-start' 
},

welcomeText: {
  color: "white",
  fontSize: responsiveFontSize(3.5),
  fontFamily: 'PTSans_700Bold',
},
signInText: {
  color: "white",
  marginTop: "3%",
  fontSize: responsiveFontSize(3.4),
  fontFamily: 'PTSans_400Regular',
},
appButtonContainer: {
  backgroundColor: "#E100B2",
  borderRadius: 30,
  paddingVertical: "4%",
  paddingHorizontal: "6%",
  width:"70%",
  marginTop:"20%"
},
appButtonText: {
  fontSize: responsiveFontSize(2.2),
  color: "#fff",
  fontFamily: 'PTSans_700Bold',
  alignSelf: "center",
}

});
