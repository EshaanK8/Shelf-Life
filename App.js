import Expo from 'expo';
import { StatusBar } from 'expo-status-bar'
import React, {useState, useEffect} from 'react'
import {StyleSheet, View} from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import Constants from 'expo-constants';

import { LogBox } from 'react-native';

import * as eva from '@eva-design/eva';
import { ApplicationProvider, Layout, Text, Button } from '@ui-kitten/components';
import { default as theme } from './custom-theme.json'; // <-- Import app theme
import { default as mapping } from './mapping.json'; // <-- Import app mapping

import { CommonActions } from '@react-navigation/native';
import { firebase } from './src/firebase/config'

import LoginScreen from './screens/LoginScreen'
import ProductDetailsScreen from './screens/ProductDetailsScreen'
import ConfirmationPageScreen from './screens/ConfirmationPageScreen'
import InventoryScreen from './screens/InventoryScreen'
import BarcodeScannerScreen from './screens/BarcodeScannerScreen'
import CheckScannerScreen from './screens/CheckScannerScreen'
import ItemsLeftPageScreen from './screens/ItemsLeftPageScreen'
import CreateAccountScreen from './screens/CreateAccountScreen'
import PrevBoughtScreen from './screens/PrevBoughtScreen'
import LoadingScreen from './screens/LoadingScreen'
import SettingsScreen from './screens/SettingsScreen'
import ProfileScreen from './screens/ProfileScreen'
import ProductResult from './screens/ProductResult'


import {NavigationContainer} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack'
import {AuthContext} from './components/context.js'
import {userContext} from './components/userContext.js';
import {CardContext} from './components/cardContext.js';
import AsyncStorage from '@react-native-async-storage/async-storage'

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import {
  useFonts,
  PTSans_400Regular,
  PTSans_400Regular_Italic,
  PTSans_700Bold,
  PTSans_700Bold_Italic,
} from '@expo-google-fonts/pt-sans';



//-------------------------------------------------------------------------------------------------------------//

LogBox.ignoreAllLogs();//Ignore all log notifications


//Navigators
const AuthStack = createStackNavigator();
const Tabs = createBottomTabNavigator();

const InventoryStack = createStackNavigator();
const PrevBoughtStack = createStackNavigator();

const BarcodeStack = createStackNavigator();

const BarcodeStackScreen = (navigation) => (
  <BarcodeStack.Navigator initialRouteName = "BarcodeScannerScreen">
    <BarcodeStack.Screen
      name="BarcodeScannerScreen"
      component={BarcodeScannerScreen}
      options={{title:"Scan Your Barcode"}}
    />
    <BarcodeStack.Screen name="ProductResult" component={ProductResult} options={{title:"Add Product"}}/>
  </BarcodeStack.Navigator>
)

//Inventory Stack
const InventoryStackScreen = (navigation) => (
  <InventoryStack.Navigator initalRouteName = "InventoryScreen">
    <InventoryStack.Screen 
      name="InventoryScreen" 
      component={InventoryScreen}
      options={{headerShown: false, title:""}}
    />
    <InventoryStack.Screen name="BarcodeScannerScreen" component={BarcodeStackScreen} options={{headerShown: false, title:""}}/>
    <InventoryStack.Screen name="CheckScannerScreen" component={CheckScannerScreen} options={{title: "Scan your item"}}/>
    <InventoryStack.Screen name="ProductDetailsScreen" component={ProductDetailsScreen} options={{title: ""}}/>
    <InventoryStack.Screen name= "SettingsScreen" component={SettingsScreen} options={{title: "Settings"}}/>
  </InventoryStack.Navigator>
)

//PrevBought Stack
const PrevBoughtStackScreen = (navigation) => (
  <PrevBoughtStack.Navigator>
    <PrevBoughtStack.Screen 
      name="PrevBoughtScreen" 
      component={PrevBoughtScreen}
      options={{headerShown: false, title:""}}
    />
  </PrevBoughtStack.Navigator>
)

export default () => {

  const [isLoading, setIsLoading] = React.useState(true)
  
  let [fontsLoaded] = useFonts({
    PTSans_400Regular,
    PTSans_400Regular_Italic,
    PTSans_700Bold,
    PTSans_700Bold_Italic,
  });

  const initialLoginState = {
    isLoading: true,
    signedIn: 'false',
    userId: ''
  }

  //LoginReducer takes in the prevState and an action (either Retreieve_Token, Login, Logout, or Register). It changes the state according to the
  //action passed in.
  /*
  When you call dispatch('LOGIN'), loginReducer(prevState, 'LOGIN) is called.
  Now, username and userToken are set and the screen stops loading.

  */
  const loginReducer = (prevState, action) => {
    switch(action.type) {
      case 'RETRIEVE_TOKEN':
        return {
          ...prevState,
          isLoading: false,
          signedIn:action.token,
          userId:action.userIn
        }
      case 'SIGNIN':
        return {
          ...prevState,
          isLoading: false,
          signedIn:'true',
          userId:action.userIn
        }
      case 'SIGNOUT':
        return {
          ...prevState,
          isLoading: false,
          signedIn:'false',
          userId:action.userIn
        }
    }
  }
  
  //This is similar to useState(). It simply sets the initial state to initialLoginState and changes the state using the loginReducer function.
  const [loginState, dispatch] = React.useReducer(loginReducer, initialLoginState)

  const authContext = React.useMemo(() => ({
    signOutG: async() => {
      signedIn = 'false'
      userId = ''
      try {
        await AsyncStorage.setItem('signedIn', signedIn)
        await AsyncStorage.setItem('userId', userId)
      }
      catch(error){
        console.log(error)
      }
      
      dispatch({type: 'SIGNOUT', userIn: userId})
    },

    signIn: async(userData) => {
      console.log(userData.email)
      signedIn = 'true'
      userId = userData.id
      try {
        await AsyncStorage.setItem('signedIn', signedIn)
        await AsyncStorage.setItem('userId', userId)
      }
      catch(error){
        console.log(error)
      }
     
      dispatch({type: 'SIGNIN', userIn: userId})
    },
  }), [])

  /*
   // This code is for it to run whenever your variable, timerOn, changes
   useEffect(() => {
    console.log("Hello" + userId)
  }, [userId]); // The second parameters are the variables this useEffect is listening to for changes.
  */
  //Set time to login
  
  useEffect (() => {
    let mounted = true;
    if (mounted){
    setTimeout(async() => {
      let userSignedIn = 'false'
      let currentUser = ''
      try {
        userSignedIn = await AsyncStorage.getItem('signedIn')
        currentUser = await AsyncStorage.getItem('userId')
      } catch(e) {
        console.log(e)
      }
      
        dispatch({type: 'RETRIEVE_TOKEN', token: userSignedIn, userIn: currentUser})
      
    },1000)
    return () => mounted = false;
  }}, [])

  //Render Loading Screen
  if (loginState.isLoading || (!fontsLoaded)) {
    return <LoadingScreen/>
  }


  //Render navigation stack depending on if the user is signed in or not
  //The entire tree is wrapped in AuthContext.Provider so that ALL COMPONENTS have access to authContext functions
  return (
      <ApplicationProvider {...eva} theme={eva.light} customMapping={mapping}>
        <AuthContext.Provider value= {authContext}>
        <userContext.Provider value={loginState.userId}>
              <NavigationContainer style={{marginTop: Constants.statusBarHeight}}>
                {((loginState.signedIn == 'true')&&(loginState.userId !==null))  ? (
                  <View style={{flex:1}}>
                    <StatusBar
                      backgroundColor="#4c29e6"
                      barStyle="light-content"
                    />
                    <Tabs.Navigator>
                      <Tabs.Screen name= "InventoryScreen" component={InventoryStackScreen} options={{title: "Inventory", headerShown: false}}/>
                      <Tabs.Screen name= "PrevBoughtScreen" component={PrevBoughtStackScreen} options={{title: "Previously Bought", headerShown: false}}/>
                    </Tabs.Navigator>
                  </View>
                ) 
                :(
                  <View style={{flex:1}}>
                    <StatusBar
                        backgroundColor="#4c29e6"
                        barStyle="light-content"
                      />
                    <AuthStack.Navigator initalRouteName = "LoginScreen" screenOptions={{ headerStyle: { backgroundColor: '#fff',elevation:0, borderBottomWidth: 0} }}>
                        <AuthStack.Screen name= "LoginScreen" component ={LoginScreen} options={{title: "Sign In", headerShown: false}}/>
                        <AuthStack.Screen name= "CreateAccountScreen"  component ={CreateAccountScreen} options={{title: ""}} />
                    </AuthStack.Navigator>
                  </View>
                )}
              </NavigationContainer>
          </userContext.Provider>
        </AuthContext.Provider>
      </ApplicationProvider>
  )
}
  


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  }
});






