import React from 'react';
import {StyleSheet,View, Text, TextInput, ImageBackground, TouchableOpacity, useWindowDimensions, Alert, Image} from 'react-native';
import {responsiveHeight,responsiveFontSize} from "react-native-responsive-dimensions";
import backgroundImage from "../assets/welcomebackground.png"
import GradientButton from 'react-native-gradient-buttons';

export default ({navigation}) => {
    const AppButton = ({ onPress, title }) => (
        <TouchableOpacity onPress={onPress} style={styles.appButtonContainer}>
          <Text style={styles.appButtonText}>{title}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <ImageBackground source={backgroundImage} style={{flex:1, resizeMode: "cover"}}>
                <View style={styles.welcomeView}>
                    <Text style ={styles.welcomeText}>Welcome to</Text>
                    <Text style ={styles.shelfText}>Shelf Life</Text>
                </View>
                <View style={styles.buttonsView}>
                    <AppButton title="Sign in" onPress={() => navigation.navigate('LoginScreen')}/>
                    <AppButton title="Sign up" onPress={() => navigation.navigate('CreateAccountScreen')}/>
                </View>
            </ImageBackground>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: "#4c29e6"
    },
    welcomeView: {
        flex:0.3,
        width:"100%",
        paddingTop:"30%",
        flexDirection: 'column', 
        alignItems: 'flex-start',
        paddingLeft: "5%"
    },
    welcomeText: {
        color: "white",
        fontSize: responsiveFontSize(6),
        fontFamily: 'PTSans_700Bold',
    }, 
    shelfText: {
        color: "white",
        fontSize: responsiveFontSize(6),
        fontFamily: 'PTSans_700Bold',
    }, 
    appButtonContainer: {
        backgroundColor: "#E100B2",
        borderRadius: 30,
        paddingVertical: "4%",
        paddingHorizontal: "6%",
        width:"70%",
        marginTop:"8%"
    },
    appButtonText: {
        fontSize: responsiveFontSize(2.2),
        color: "#fff",
        fontFamily: 'PTSans_700Bold',
        alignSelf: "center",
    },
    buttonsView: {
        flex:1.2,
        alignItems: "center",
        paddingTop:"5%",
        width:"100%",
    }
})