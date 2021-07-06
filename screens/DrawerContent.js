import React from 'react'
import {View, Text} from 'react-native'
import{AuthContext} from '../components/context'
import {DrawerItem, DrawerContentScrollView} from '@react-navigation/drawer'
import { firebase } from '../src/firebase/config'
import AnimatedLoader from 'react-native-animated-loader';


export default function DrawerContent(props) {

    const [isLoading, setIsLoading] = React.useState(false)
    const {signOutG} = React.useContext(AuthContext) //Get the signIn function from the AuthContext

    const doSignOut = () => {
        setIsLoading(true)
        firebase
        .auth()
        .signOut()
        .then((response) => {
            signOutG()
        })
        .catch(function (err) {
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
        
        <View>
            <DrawerContentScrollView {...props}>
                <View>
                    <Text>Hello</Text>
                </View>
            </DrawerContentScrollView>
            <DrawerItem label="Sign Out" marginTop = {100} onPress={() => {doSignOut()}}/>
        </View>
    )
}