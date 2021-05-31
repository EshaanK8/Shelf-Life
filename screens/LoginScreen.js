import React, { Component, useState} from 'react';
import {StyleSheet,View, TextInput, TouchableOpacity, Alert} from 'react-native';
import{AuthContext} from '../components/context'
import { firebase } from '../src/firebase/config'
import LoadingScreen from './LoadingScreen'
import { useFonts } from 'expo-font';

import * as eva from '@eva-design/eva';
import { ApplicationProvider, Layout, Text, Button } from '@ui-kitten/components';
import { default as theme } from '../custom-theme.json'; // <-- Import app theme
import { default as mapping } from '../mapping.json'; // <-- Import app mapping




export default function LoginScreen({navigation}) {
  const [loaded] = useFonts({
    Lato: require('../assets/Lato/Lato-Regular.ttf'),
  });

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = React.useState(false)
  const {signIn} = React.useContext(AuthContext) //Get the signIn function from the AuthContext

  

  const onFooterLinkPress = () => {
    navigation.push('CreateAccountScreen')
  }
  

  const doSignIn = () => {
    setIsLoading(true)
    firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((response) => {

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
    return <LoadingScreen/>
  }

  return (
    <ApplicationProvider {...eva} theme={eva.light} customMapping={mapping}>
      <Layout style={styles.container}>
          <Layout style={styles.mainLayout} keyboardShouldPersistTaps="always">

              <View style={styles.welcomeView}>
                <Text style ={styles.welcomeText}>Welcome to InventoryApp,</Text>
                <Text style ={styles.signInText}>Sign in to continue</Text>
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
                <TextInput
                    style={styles.passwordInput}
                    placeholderTextColor="#aaaaaa"
                    secureTextEntry
                    placeholder='Password'
                    onChangeText={(text) => setPassword(text)}
                    value={password}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
            
                <Button style={styles.signInButton} onPress={() => doSignIn()}>Log in</Button>
                <Button style={styles.signUpButton} onPress={onFooterLinkPress}>Login with Google</Button>


                <View style={styles.createText}>
                  <Text>Don't have an account? </Text>
                  <TouchableOpacity onPress = {onFooterLinkPress}>
                    <Text style={{color: 'blue'}}>Sign up</Text>
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
  fontSize: 25
},
signInText: {
  fontWeight: "bold",
  color: "lightgrey",
  fontSize: 20,
  marginTop: "1%"
},

});
