import Expo from 'expo';
import { StatusBar } from 'expo-status-bar'
import React, {useEffect} from 'react'
import {StyleSheet, View, Platform} from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import AnimatedLoader from 'react-native-animated-loader';

import { LogBox } from 'react-native';

import * as eva from '@eva-design/eva';
import { ApplicationProvider} from '@ui-kitten/components';
import { default as mapping } from './mapping.json'; // <-- Import app mapping

import { firebase } from './src/firebase/config'

import LoginScreen from './screens/LoginScreen'
import WelcomeScreen from './screens/WelcomeScreen'
import ProductDetailsScreen from './screens/ProductDetailsScreen'
import InventoryScreen from './screens/InventoryScreen'
import BarcodeScannerScreen from './screens/BarcodeScannerScreen'
import CheckScannerScreen from './screens/CheckScannerScreen'
import CreateAccountScreen from './screens/CreateAccountScreen'
import ForgotPasswordScreen from './screens/ForgotPasswordScreen'
import PrevBoughtScreen from './screens/PrevBoughtScreen'
import SettingsScreen from './screens/SettingsScreen'
import ProductResult from './screens/ProductResult'
import CameraScreen from './screens/CameraScreen'
import CameraScreenCreate from './screens/CameraScreenCreate'
import IntroSlider from './screens/IntroSlider'

import {NavigationContainer} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack'
import {AuthContext} from './components/context.js'
import {userContext} from './components/userContext.js';
import AsyncStorage from '@react-native-async-storage/async-storage'

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import {
  useFonts,
  PTSans_400Regular,
  PTSans_400Regular_Italic,
  PTSans_700Bold,
  PTSans_700Bold_Italic,
} from '@expo-google-fonts/pt-sans';
import { responsiveHeight, responsiveScreenHeight } from 'react-native-responsive-dimensions';



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
    <BarcodeStack.Screen name="ProductResult" component={ProductResult} options={{title:""}}/>
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
    <InventoryStack.Screen name= "SettingsScreen" component={SettingsScreen} options={{title: ""}}/>
    <InventoryStack.Screen name="CameraScreen" component={CameraScreen} options={{title:""}}/>
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

  const getTabBarVisibility = (route) => {
    console.log(route)
    const routeName = route.state
      ? route.state.routes[route.state.index].name
      : 'InventoryScreen';
  
    if (routeName !== 'InventoryScreen' && routeName !== 'PrevBoughtScreen') {
      return false;
    }
  
    return true;
  }

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
  
  if (loginState.isLoading || (!fontsLoaded) ) {
    return <View style={{position:"absolute",top:0,bottom:0,left:0,right:0, alignItems: "center", justifyContent: "center", backgroundColor: "#4c29e6"}}>
      <AnimatedLoader visible={true} overlayColor="#4c29e6" source={require("./assets/loader.json")} animationStyle={{width: 80, height: 80}} speed={2}/>
    </View>
  }


  //Render navigation stack depending on if the user is signed in or not
  //The entire tree is wrapped in AuthContext.Provider so that ALL COMPONENTS have access to authContext functions
  return (
      <ApplicationProvider {...eva} theme={eva.light} customMapping={mapping}>
        <AuthContext.Provider value= {authContext}>
        <userContext.Provider value={loginState.userId}>
              <NavigationContainer style={{marginTop: Constants.statusBarHeight}}>
                {console.log(loginState.userId)}
                {((loginState.signedIn == 'true')&&(loginState.userId !== null) && (firebase.auth().currentUser))  ? (
                  <View style={{flex:1}}>
                    <StatusBar
                      backgroundColor="#4c29e6"
                      barStyle="light-content"
                    />
                    <Tabs.Navigator tabBarOptions=
                      {{showLabel: false,
                        style: {
                          ...Platform.select({
                            ios: {
                              height:responsiveScreenHeight(12),
                            },
                            android: {
                              height:responsiveScreenHeight(8),
                            }
                          }),
                          position: 'absolute',
                          backgroundColor:"white",
                          ...styles.shadow,
                          justifyContent: "center",
                          alignItems: "center",
                          borderTopWidth: 0
                        }
                      }}>
                      <Tabs.Screen name= "InventoryScreen" component={InventoryStackScreen} options={({route}) => ({
                        tabBarLabel:() => {return null},
                        tabBarIcon: ({focused}) => (
                          <View style={{alignItems:"center", backgroundColor: focused? "#4c29e6": "white", borderRadius: 20, width:"40%", height:"80%", justifyContent:"center"}}>
                            <Ionicons size={responsiveHeight(3.2)} style = {{marginRight:"2%"}} color={focused? "white": "lightgrey"}name= {focused? "home" : "home"}/>
                          </View>
                        ), 
                        headerShown: false,
                        tabBarVisible: getTabBarVisibility(route)
                      })}/>
                      <Tabs.Screen name= "PrevBoughtScreen" component={PrevBoughtStackScreen} options={({route}) => ({
                        tabBarLabel:() => {return null},
                        tabBarIcon: ({focused}) => (
                          <View style={{alignItems:"center", backgroundColor: focused? "#4c29e6": "white", borderRadius: 20, width:"40%", height:"80%", justifyContent:"center"}}>
                            <Ionicons size={responsiveHeight(3.5)} style = {{marginRight:"2%"}} color={focused? "white": "lightgrey"} name= {focused? "cart" : "cart"}/>
                          </View>
                        ), 
                        headerShown: false,
                        tabBarVisible: getTabBarVisibility(route)
                      })}/>
                    </Tabs.Navigator>
                  </View>
                ) 
                :(
                  <View style={{flex:1}}>
                    <StatusBar
                        backgroundColor="#4c29e6"
                        barStyle="light-content"
                      />
                    <AuthStack.Navigator initalRouteName = "WelcomeScreen" screenOptions={{ headerStyle: { backgroundColor: '#4c29e6',elevation:0, borderBottomWidth: 0}, headerTintColor: 'white', }}>
                        <AuthStack.Screen name= "WelcomeScreen" component ={WelcomeScreen} options={{title: "", headerShown: false}}/>
                        <AuthStack.Screen name= "LoginScreen" component ={LoginScreen} options={{title: ""}}/>
                        <AuthStack.Screen name= "CreateAccountScreen"  component ={CreateAccountScreen} options={{title: ""}} />
                        <AuthStack.Screen name= "ForgotPasswordScreen"  component ={ForgotPasswordScreen} options={{title: ""}} />
                        <AuthStack.Screen name="CameraScreenCreate" component={CameraScreenCreate} options={{title:""}}/>
                        <AuthStack.Screen name="IntroSlider" component={IntroSlider} options={{title:"", headerShown: false}}/>
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
  },
  shadow: {
    shadowColor: "white",
    shadowOffset: {
      width:0,
      height:0
    },
    shadowOpacity:0,
    shadowRadius:0,
    elevation:0
  }
});






