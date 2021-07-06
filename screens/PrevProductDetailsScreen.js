import React, { useState } from 'react';
import {StyleSheet,View, TouchableOpacity,Image, ImageBackground} from 'react-native';
import {responsiveHeight,responsiveWidth,responsiveFontSize} from "react-native-responsive-dimensions";
import Ionicons from 'react-native-vector-icons/Ionicons';
import Constants from 'expo-constants';
import { Button, Text } from '@ui-kitten/components';
import diet from '../assets/diet.png'
import background from '../assets/background.png'

export default (props) => {

    const [showConfirm, setShowConfirm] = useState(false)

    const handleModalChange = () => {
        props.onModalChange(false)
    }

    const [amount, setAmount] = useState(0)

    const increment = () => {
        setAmount(amount+1)
    }

    const decrement = () => {
        if(amount >= 1){
            setAmount(amount-1)
        }
    }

    const createProduct = () => {
        let newItem = {
          name: props.item.name,
          code: props.item.code,
          id: "",
          dateAdded: null,
          image: props.item.image,
          amount: amount,
          ingredients: props.item.ingredients,
          allergens: props.item.allergens
        }
        return newItem
    }

    closeModal = () => {
        props.onClose(false)
    }

    const submit = () => {
        newItem = createProduct()
        props.onNewItem(newItem)

        if ((newItem.name) && (newItem.code) && (newItem.amount) && (newItem.image)) {
            setShowConfirm(true)
            setTimeout(() => {
                closeModal()
            }, 300)
        }
    }

    const arrayToString = (array) => {
        let newString = ""
        let newArray = []
        for (i = 0; i < array.length; i++) {
             newString = array[i].substring(3)
             newArray.push(newString)
        }

        return newArray.join(", ")
    }

    
    
  return (
    <View style={styles.container}>
        <ImageBackground source={background} style={{flex:1, resizeMode: "cover", alignItems: "center",  width: "100%"}}>
            <View style={styles.headerContainer}>
                <TouchableOpacity style={styles.backButtonContainer} onPress={handleModalChange}>
                    <Ionicons name='arrow-back-outline' size={30}/>
                </TouchableOpacity>
            </View>
            <View style={{flex:0.1}}>

            </View>
            <View style={styles.nameContainer}>
                    <View style ={styles.imageContainer}>
                        <View style = {styles.imageSmallerContainer}>
                            {(props.item.image) ? (
                                <Image style={{width: "80%", height: "100%", resizeMode:'cover', borderRadius: 5}} source={{uri: props.item.image}}/>
                            )
                            : (
                                <Image style={{width: "80%", height: "100%", resizeMode:'cover', borderRadius: 5}} source={diet}/>
                            )}
                        </View>
                    </View>
                    <View style = {styles.textAndButtons}>
                        <View style ={styles.textContainer}>
                            <Text style = {styles.nameText} numberOfLines = {2}>{props.item.name}</Text>
                        </View>
                    </View>
            </View>
            <View style = {styles.buttonsContainer}>
                <TouchableOpacity style = {styles.removeIconContainer} onPress={decrement}>
                    <Ionicons name='ios-remove-circle-outline' style = {styles.removeIcon} size={responsiveHeight(6)}/>
                </TouchableOpacity>
                <View style = {styles.amountTextContainer}>
                    <Text style = {styles.amountText}>{amount}</Text>
                </View>
                <TouchableOpacity style = {styles.addIconContainer} onPress={increment}>
                    <Ionicons name='ios-add-circle-outline' style = {styles.addIcon} size={responsiveHeight(6)}/>
                </TouchableOpacity>
            </View>
            <View style = {styles.submitContainer}>
                <Button onPress={submit} size='medium' status='danger' style={{width: "80%"}}><Text style ={{fontSize: responsiveFontSize(2), fontFamily: 'PTSans_700Bold', color:"white"}}>Submit</Text></Button>
            </View>
            {showConfirm && <View style={styles.confirmationBox}><Ionicons size={responsiveHeight(3)} style = {{marginRight:"2%"}}name="checkmark-circle-outline"/><Text>Product Added!</Text></View>}
        </ImageBackground>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        ...Platform.select({
            ios: {
                marginTop: Constants.statusBarHeight,
            }
        }),
        width: "100%",
        flex: 1,
        alignItems: 'center',
        backgroundColor:'#FAFAFA',
    },
    headerContainer: {
        flexDirection: "column",
        alignItems:"flex-start",
        width:"100%",
        flex:0.25,
        justifyContent: "center",
        marginLeft: responsiveWidth(5),
        marginTop:"5%"
      },
      nameContainer: {
        flex:3,
        width:"80%",
        flexDirection:"column",
        alignContent: "center",
        shadowColor: "#000",
        shadowOffset: {
	        width: 0,
	        height: 1,
        },
        shadowOpacity: 0.18,
        shadowRadius: 1.00,
        elevation: 1,
        backgroundColor:"white",
        overflow: 'hidden',
        borderRadius: 8,
      },
    buttonsContainer: {
        flex:2,
        width:"100%",
        paddingLeft: "5%",
        paddingRight: "5%",
        paddingTop: "3%",
        flexDirection: "row",
        alignItems: "center"
    },
    submitContainer: {
        flex:2,
        width: '100%',
        alignItems: 'center',
        paddingTop:"5%"
    },
    removeIconContainer: {
        marginRight: "auto",
        marginLeft: "15%",
    },
    addIconContainer: {
        marginLeft:"auto",
        marginRight: "15%",
    },
    amountTextContainer: {
    },
    removeIcon: {
        color: "#fc88a8"
    },
    addIcon: {
        color: "#fc88a8"
    },
    amountText: {
        fontSize: responsiveFontSize(4.5),
        fontFamily: 'PTSans_400Regular'
    },
    confirmationBox: {
        flexDirection: "row",
        position: 'absolute', 
        bottom: 0, 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: 'rgb(142, 228, 175)',
        width: "100%",
        height: responsiveHeight(5)
    },

    /*Product Label*/

    card:{
        flexDirection:"column",
        marginBottom: "5%",
        height: responsiveHeight(80),
        alignContent: 'center',
        justifyContent: 'center',
        paddingTop: '2%',
        paddingBottom: '2%'
    },
    imageContainer: {
        flex:2,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "white"
    },
    imageSmallerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: "80%", 
        height: "80%",
        backgroundColor: "white" 
    },
    textContainer: {
        flex:1,
        paddingLeft: "10%",
        paddingRight: "10%"
    },
    nameText: {
        fontSize: responsiveFontSize(3),
        fontWeight: "600",
        fontFamily: 'PTSans_700Bold'
    },
    textAndButtons: {
        flex: 1,
        flexDirection: "column",
    },
});