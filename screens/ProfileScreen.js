import React from 'react';
import {StyleSheet,Text,View,Button} from 'react-native';
import { CommonActions } from '@react-navigation/native';
import { firebase } from '../src/firebase/config'
import{AuthContext} from '../components/context'
import AnimatedLoader from 'react-native-animated-loader';


export default ({navigation}) => {
  const {signOutG} = React.useContext(AuthContext) //Get the signIn function from the AuthContext
  const [isLoading, setIsLoading] = React.useState(false)

  const doSignOut = () => {
    setIsLoading(true)
    navigation.dispatch(

      CommonActions.reset({
        index: 1,
        routes: [
          { name: 'SettingsScreen' },
        ],
      })
    );

    firebase
      .auth()
      .signOut()
      .then((response) => {
          signOutG()
      })
      .catch(function (err) {
        setIsLoading(false)
        alert(error)
      })
  }

  //Render Loading Screen
  if (isLoading) {
    return <View style={{position:"absolute",top:0,bottom:0,left:0,right:0, alignItems: "center", justifyContent: "center"}}>
      <AnimatedLoader visible={true} overlayColor="rgba(255,255,255,0.75)" source={require("../assets/loader.json")} animationStyle={{width: 80, height: 80}} speed={2}/>
    </View>
  }


  return (
      <View style={styles.container}>
      <Text>Profile</Text>
      <Button title="Sign Out" marginTop = {100} onPress={() => {doSignOut()}}/>
      </View>
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

