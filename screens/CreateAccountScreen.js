import React, { useState } from 'react'
import { Image, TextInput, Button, TouchableOpacity, View, KeyboardAvoidingView, useWindowDimensions, StyleSheet } from 'react-native'
import { firebase } from '../src/firebase/config'
import{AuthContext} from '../components/context'
import profile from '../assets/profile.png'
import AnimatedLoader from 'react-native-animated-loader';

import { ApplicationProvider, Layout, Text } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';

import { default as mapping } from '../mapping.json'; // <-- Import app mapping
import {responsiveHeight,responsiveFontSize} from "react-native-responsive-dimensions";




export default function RegistrationScreen({navigation, route}) {
    const windowHeight = useWindowDimensions().height;  
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [isLoading, setIsLoading] = React.useState(false)

    const {signIn} = React.useContext(AuthContext) //Get the signIn function from the AuthContext

    const AppButton = ({ onPress, title }) => (
      <TouchableOpacity onPress={onPress} style={styles.appButtonContainer}>
        <Text style={styles.appButtonText}>{title}</Text>
      </TouchableOpacity>
    );

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
              let photo

              if (route.params) {
                if (route.params.capturedImage) {
                  console.log(route.params.capturedImage.uri)
                  photo = route.params.capturedImage.uri
                }
              }

              else {
                photo = profile
              }
              const data = {
                  id: uid,
                  email,
                  fullName,
                  photo
              };
              setIsLoading(false)
              navigation.navigate("IntroSlider", {data})
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
        return <View style={{position:"absolute",top:0,bottom:0,left:0,right:0, alignItems: "center", justifyContent: "center", backgroundColor: "#4c29e6"}}>
          <AnimatedLoader visible={true} overlayColor="#4c29e6" source={require("../assets/loader.json")} animationStyle={{width: 80, height: 80}} speed={2}/>
        </View>
    }

    return (
    <ApplicationProvider {...eva} theme={eva.light} customMapping={mapping}>
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <Layout style={[styles.container,{minHeight: Math.round(windowHeight)}]}>
          <Layout style={styles.mainLayout} keyboardShouldPersistTaps="always">

              <View style={styles.welcomeView}>
                <Text style ={styles.welcomeText}>Create Account</Text>
              </View>

                <TouchableOpacity style={{marginTop:"8%"}} onPress={() => navigation.navigate("CameraScreenCreate")}>
                    {((route.params)) ? (route.params.capturedImage && <Image source={{uri: route.params.capturedImage.uri}} style = {{width: responsiveHeight(12), height: responsiveHeight(12), borderRadius:50}}/>) : (<Image source={profile} style = {{width: responsiveHeight(12), height: responsiveHeight(12), borderRadius:50}}/>)}
                </TouchableOpacity>
                <TextInput
                    style={styles.fullNameInput}
                    placeholder='Full name'
                    placeholderTextColor="white"
                    onChangeText={(text) => setFullName(text)}
                    value={fullName}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                    color="white"
                />
                <TextInput
                    style={styles.emailInput}
                    placeholderTextColor="white"
                    placeholder='E-mail'
                    onChangeText={(text) => setEmail(text.replace(/\s/g, ''))}
                    value={email}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                    color="white"
                />
                <TextInput
                    style={styles.passwordInput}
                    placeholder='Password'
                    secureTextEntry
                    placeholderTextColor="white"
                    onChangeText={(text) => setPassword(text.replace(/\s/g, ''))}
                    value={password}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                    color="white"
                />
                <TextInput
                    style={styles.confirmPasswordInput}
                    placeholderTextColor="white"
                    secureTextEntry
                    placeholder='Confirm Password'
                    onChangeText={(text) => setConfirmPassword(text.replace(/\s/g, ''))}
                    value={confirmPassword}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                    color="white"
                />
            
                
                <AppButton title="Create Account" onPress={() => onRegisterPress()}/>
                <View style={styles.createText}>
                  <Text style={{fontSize: responsiveFontSize(1.8),fontFamily: 'PTSans_400Regular', color:"white"}}>Already have an account? </Text>
                  <TouchableOpacity onPress = {onFooterLinkPress}>
                    <Text style={{color: '#FF0079', fontSize: responsiveFontSize(1.8),fontFamily: 'PTSans_400Regular'}}>Sign in</Text>
                  </TouchableOpacity>
                </View>
          </Layout>     
      </Layout>
      </KeyboardAvoidingView>
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
      marginTop: '10%',
      height: 50,
      margin: 12,
      borderWidth: 1,
      borderRadius: 50,
      paddingLeft: 15,
      width: "90%",
      borderColor: "white"
    },
    passwordInput: {
      fontFamily: 'PTSans_400Regular',
      height: 50,
      margin: 12,
      borderWidth: 1,
      borderRadius: 50,
      paddingLeft: 15,
      width: "90%",
      borderColor: "white"
    },
    emailInput: {
      fontFamily: 'PTSans_400Regular',
        height: 50,
        margin: 12,
        borderWidth: 1,
        borderRadius: 50,
        paddingLeft: 15,
        width: "90%",
        borderColor: "white"
    },
    confirmPasswordInput: {
        fontFamily: 'PTSans_400Regular',
        height: 50,
        margin: 12,
        borderWidth: 1,
        borderRadius: 50,
        paddingLeft: 15,
        width: "90%",
        borderColor: "white"
    },

    mainLayout: {
       flex: 1, 
       width: '100%',
       alignItems: 'center',
       backgroundColor: "#4c29e6"
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
    color: "white",
    fontSize: 25,
    fontSize: responsiveFontSize(3.5),
    fontFamily: 'PTSans_700Bold',
  },
  signInText: {
    fontWeight: "bold",
    color: "white",
    fontSize: 20,
    marginTop: "1%"
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
  }
  });
  