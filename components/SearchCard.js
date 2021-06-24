import React, {Component, useState, useEffect} from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Text, Card, Divider } from 'react-native-elements';
import ItemsLeftPageScreen from '../screens/ItemsLeftPageScreen';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useRoute} from '@react-navigation/native';
import {userContext} from './userContext.js';
import { firebase } from '../src/firebase/config'
import diet from '../assets/diet.png'
import {responsiveHeight,responsiveWidth,responsiveFontSize} from "react-native-responsive-dimensions";


export default (props) => {

    return (
            <View style = {styles.card}>
                 <View style ={styles.imageContainer}>
                    <View style = {styles.imageSmallerContainer}>
                        {(props.item.image_front_small_url) ? (
                            <Image style={{width: "80%", height: "80%"}} source={{uri: props.item.image_front_small_url}}/>
                        )
                        : (
                            <Image style={{width: "80%", height: "80%"}} source={diet}/>
                        )}
                    </View>
                </View>
                <View style = {styles.textAndButtons}>
                    <View style ={styles.textContainer}>
                        <Text style = {[styles.nameText, styles.base]} numberOfLines={2}>{props.item.product_name}</Text>
                    </View>
                </View>
            </View>
    )
}

const styles = StyleSheet.create({
    card:{
        flexDirection:"row",
        borderRadius:8,
        marginBottom: "5%",
        height: responsiveHeight(10),
        marginLeft: "5%",
        marginRight: "5%",
        backgroundColor: "rgba(248,248,248,255)"
    },
    imageContainer: {
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageSmallerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: "80%", 
        height: "80%", 
        borderRadius: 10
    },
    textContainer: {
        flex:1,
        paddingRight:"5%"
    },
    nameText: {
        fontSize: responsiveFontSize(1.5),
        fontFamily: 'PTSans_700Bold',
        marginTop: "8%",
        marginLeft: "8%",
    },
    dateText: {
        marginTop: "2%",
        marginLeft: "8%",
        fontSize: responsiveFontSize(0.8)
    },
    textAndButtons: {
        flex: 1.4,
        flexDirection: "column",
    },
    buttonsContainer: {
        flex: 1,
        flexDirection: "row",
        width: '100%',
        alignItems: 'center',
        paddingLeft: '5%',
        paddingRight: '5%',
    },
    removeIconContainer: {
        marginRight: "auto",
        marginLeft: "15%"
    },
    addIconContainer: {
        marginLeft:"auto",
        marginRight: "15%"
    },
    amountTextContainer: {
    },
    removeIcon: {
        color: "rgb(142, 228, 175)"
    },
    addIcon: {
        color: "rgb(142, 228, 175)"
    },
    amountText: {
        fontSize: responsiveFontSize(1.33)
    }

})
