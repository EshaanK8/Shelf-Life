import React, { useState } from 'react'
import { Image, TextInput, TouchableOpacity, View, StyleSheet } from 'react-native'
import { firebase } from '../src/firebase/config'
import{AuthContext} from '../components/context'
import LoadingScreen from './LoadingScreen'

import { ApplicationProvider, Layout, Text, Button } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';

import { default as theme } from '../custom-theme.json'; // <-- Import app theme
import { default as mapping } from '../mapping.json'; // <-- Import app mapping

import GradientButton from 'react-native-gradient-buttons';
import {responsiveHeight,responsiveWidth,responsiveFontSize} from "react-native-responsive-dimensions";




export default function RegistrationScreen({navigation}) {
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [isLoading, setIsLoading] = React.useState(false)

    const {signIn} = React.useContext(AuthContext) //Get the signIn function from the AuthContext


    const onFooterLinkPress = () => {
        navigation.navigate('LoginScreen')
    }

    const onRegisterPress = () => {
      setIsLoading(true)
      if (password !== confirmPassword) {
          alert("Passwords don't match.")
          return
      }
      firebase
          .auth()
          .createUserWithEmailAndPassword(email, password)
          .then((response) => {
              const uid = response.user.uid
              const data = {
                  id: uid,
                  email,
                  fullName,
              };
              signIn(data)
              const usersRef = firebase.firestore().collection('users')
              usersRef
                  .doc(uid)
                  .set(data)
                  .then(() => {
                  })
                  .catch((error) => {
                      setIsLoading(false)
                      alert(error)
                  });
          })
          .catch((error) => {
              setIsLoading(false)
              alert(error)
      });
  }

    //Render Loading Screen
    if (isLoading) {
        return <LoadingScreen/>
    }

    return (
    <ApplicationProvider {...eva} theme={eva.light} customMapping={mapping}>
      <Layout style={styles.container}>
          <Layout style={styles.mainLayout} keyboardShouldPersistTaps="always">

              <View style={styles.welcomeView}>
                <Text style ={styles.welcomeText}>Create Account</Text>
              </View>

                <TextInput
                    style={styles.fullNameInput}
                    placeholder='Full name'
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(text) => setFullName(text)}
                    value={fullName}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.emailInput}
                    placeholderTextColor="#aaaaaa"
                    placeholder='E-mail'
                    onChangeText={(text) => setEmail(text)}
                    value={email}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.passwordInput}
                    placeholder='Password'
                    secureTextEntry
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(text) => setPassword(text)}
                    value={password}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.confirmPasswordInput}
                    placeholderTextColor="#aaaaaa"
                    secureTextEntry
                    placeholder='Confirm Password'
                    onChangeText={(text) => setConfirmPassword(text)}
                    value={confirmPassword}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
            
                
                <GradientButton text="Create Account" width='90%' violetPink textStyle={{ fontSize: responsiveFontSize(2.1), fontFamily: 'PTSans_700Bold' }} impact radius={10} height={responsiveHeight(5)} style={{marginTop:'15%', marginBottom:'2%',}} onPressAction={() => onRegisterPress()}/>
                <View style={styles.createText}>
                  <Text style={{fontSize: responsiveFontSize(1.8),fontFamily: 'PTSans_400Regular'}}>Already have an account? </Text>
                  <TouchableOpacity onPress = {onFooterLinkPress}>
                    <Text style={{color: '#b522f2'}}>Sign in</Text>
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
    fullNameInput: {
      marginTop: '15%',
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
    emailInput: {
        height: 50,
        margin: 12,
        borderWidth: 1,
        borderRadius: 10,
        paddingLeft: 15,
        width: "90%",
        borderColor: "lightgrey"
    },
    confirmPasswordInput: {
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
    createButton: {
      marginTop:'15%',
      marginBottom:'2%',
      width: "90%",
      borderRadius: 10
   },
    alreadyButton: {
      marginTop:'2%',
      marginBottom:'2%',
      width: "90%",
      borderRadius: 10
   },
   createText: {
    marginTop:"20%",
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  welcomeView: {
    marginTop:"5%",
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
    marginTop: "1%"
  },
  
  });
  