import Expo from 'expo';
import { StatusBar } from 'expo-status-bar'
import React, {useState, useEffect} from 'react'
import {StyleSheet, View} from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';

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
import ReceiptScannerScreen from './screens/ReceiptScannerScreen'
import BarcodeScannerScreen from './screens/BarcodeScannerScreen'
import ItemsLeftPageScreen from './screens/ItemsLeftPageScreen'
import CreateAccountScreen from './screens/CreateAccountScreen'
import PrevBoughtScreen from './screens/PrevBoughtScreen'
import LoadingScreen from './screens/LoadingScreen'
import SettingsScreen from './screens/SettingsScreen'
import ProfileScreen from './screens/ProfileScreen'


import {NavigationContainer} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack'
import {AuthContext} from './components/context.js'
import {userContext} from './components/userContext.js';
import {CardContext} from './components/cardContext.js';
import AsyncStorage from '@react-native-async-storage/async-storage'

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'

//-------------------------------------------------------------------------------------------------------------//

//Navigators
const AuthStack = createStackNavigator();
const Tabs = createBottomTabNavigator();

const InventoryStack = createStackNavigator();
const PrevBoughtStack = createStackNavigator();

//Inventory Stack
const InventoryStackScreen = (navigation) => (
  <InventoryStack.Navigator initalRouteName = "InventoryScreen">
    <InventoryStack.Screen 
      name="InventoryScreen" 
      component={InventoryScreen}
      options={{headerShown: false, title:""}}
    />
    <InventoryStack.Screen name="ReceiptScannerScreen" component={ReceiptScannerScreen} options={{title: "Scan Your Receipt"}}/>
    <InventoryStack.Screen name="BarcodeScannerScreen" component={BarcodeScannerScreen} options={{title: "Scan Your Barcode"}}/>
    <InventoryStack.Screen name="ProductDetailsScreen" component={ProductDetailsScreen} options={{title: ""}}/>
    <InventoryStack.Screen name= "SettingsScreen" component={SettingsScreen} options={{title: "Settings"}}/>
  </InventoryStack.Navigator>
)

//PrevBought Stack
const PrevBoughtStackScreen = () => (
  <PrevBoughtStack.Navigator>
    <PrevBoughtStack.Screen 
      name="PrevBoughtScreen" 
      component={PrevBoughtScreen}
      options={{headerShown: false, title:""}}
    />
    <InventoryStack.Screen name="ProductDetailsScreen" component={ProductDetailsScreen} options={{title: ""}}/>
  </PrevBoughtStack.Navigator>
)

export default () => {

  //State
  const [isLoading, setIsLoading] = React.useState(true)
  //const [userId, setUserId] = useState('');

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
  if (loginState.isLoading) {
    return <LoadingScreen/>
  }


  //Render navigation stack depending on if the user is signed in or not
  //The entire tree is wrapped in AuthContext.Provider so that ALL COMPONENTS have access to authContext functions
  return (
    <ApplicationProvider {...eva} theme={eva.light} customMapping={mapping}>
      <AuthContext.Provider value= {authContext}>
      <userContext.Provider value={loginState.userId}>
            <NavigationContainer>
              {((loginState.signedIn == 'true')&&(loginState.userId !==null))  ? (
                <Tabs.Navigator>
                  <Tabs.Screen name= "InventoryScreen" component={InventoryStackScreen} options={{title: "Inventory", headerShown: false}}/>
                  <Tabs.Screen name= "PrevBoughtScreen" component={PrevBoughtStackScreen} options={{title: "Previously Bought", headerShown: false}}/>
                </Tabs.Navigator>
              ) 
              :(
                <AuthStack.Navigator initalRouteName = "LoginScreen" screenOptions={{ headerStyle: { backgroundColor: '#fff',elevation:0, borderBottomWidth: 0} }}>
                    <AuthStack.Screen name= "LoginScreen" component ={LoginScreen} options={{title: "Sign In", headerShown: false}}/>
                    <AuthStack.Screen name= "CreateAccountScreen"  component ={CreateAccountScreen} options={{title: ""}} />
                  </AuthStack.Navigator>
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






