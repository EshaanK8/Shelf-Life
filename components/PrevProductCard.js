import React, {useState, useEffect} from 'react';
import { StyleSheet, View, Image, TouchableOpacity} from 'react-native';
import { Text} from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import {useRoute} from '@react-navigation/native';
import {userContext} from './userContext.js';
import { firebase } from '../src/firebase/config'
import {responsiveHeight,responsiveFontSize} from "react-native-responsive-dimensions";
import diet from '../assets/diet.png'
import Swipeable from 'react-native-gesture-handler/Swipeable';


export default (props) => {
    const user = React.useContext(userContext)
    const navigation = useNavigation()
    const currentScreen = useRoute();
    const [value, setValue] = useState(props.item.amount);

    useEffect(() => { setValue(props.item.amount) }, [props.item.amount]);

    //--------------------------------Storage API functions-------------------------------//

    const deletePrevProduct = () => {
        firebase.firestore().collection('users').doc(user).collection('prevProducts').doc(props.item.id).delete().then(() => {
        }).catch((error) => {
            console.error("Error removing document: ", error);
        });
    }
    //--------------------------------------------------------------------------------//
    
    function checkId(product) {
        return product.id !== props.item.id;
    }
    
    const onProductDeleted = () => {
        const newProductList = props.productList.filter(checkId);
        props.onListChange(newProductList)
    }
    
    const handleDelete = () => {
        deletePrevProduct()
        onProductDeleted()
    }

    /*-------------- Swipe----------------*/
    const leftSwipe = (progress, dragX) => {
        const trans = dragX.interpolate({
          inputRange: [0, 50, 100, 101],
          outputRange: [-20, 0, 0, 1],
        });
        return (
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Text style={{color:"white", fontSize: responsiveFontSize(2), fontFamily: 'PTSans_700Bold'}}>Delete</Text>
          </TouchableOpacity>
        );
      };


    return (
            <Swipeable renderLeftActions={leftSwipe} overshootLeft={false} leftThreshold={0}>
                <View style = {styles.swipeContainer}>
                    <View style ={styles.imageContainer}>
                        <View style = {styles.imageSmallerContainer}>
                            {(props.item.image) ? (
                                <Image style={{width: "80%", height: "80%"}} source={{uri: props.item.image}}/>
                            )
                            : (
                                <Image style={{width: "80%", height: "80%"}} source={diet}/>
                            )}
                        </View>
                    </View>
                    <View style = {styles.textAndButtons}>
                        <View style ={styles.textContainer}>
                            <Text style = {[styles.nameText, styles.base]} numberOfLines={1}>{props.item.name}</Text>
                            <Text style = {[styles.dateText, styles.light, styles.base]} numberOfLines={1}>{props.item.id}</Text>
                        </View>
                    </View>
                </View>
            </Swipeable>
    )
}

const styles = StyleSheet.create({
    baseFont: {
        fontFamily: 'Roboto',
    },
    lightFont: {
        ...Platform.select({
            ios: {
                fontWeight: '300',
            },
            android: {
                // RN 0.44.0 bug: fontWeight 300 not linked to *Thin or *Light fonts yet...
                fontFamily: 'Roboto-Thin',
            },
        }),
    },
    swipeContainer:{
        flexDirection:"row",
        borderRadius:8,
        marginBottom: "5%",
        height: responsiveHeight(15),
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
        fontSize: responsiveFontSize(2),
        fontFamily: 'PTSans_700Bold',
        marginTop: "8%",
        marginLeft: "8%",
    },
    dateText: {
        marginTop: "2%",
        marginLeft: "8%",
        fontSize: responsiveFontSize(1.2)
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
    deleteButton: {
        backgroundColor: "#fb3d71",
        justifyContent: "center",
        width: 100,
        alignItems: "center",
        borderRadius:8,
        marginBottom: "5%",
        marginLeft:"5%",
        height: responsiveHeight(15),
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
        fontSize: responsiveFontSize(2)
    }

})
