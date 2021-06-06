import React, {Component, useState} from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Text, Card, Divider } from 'react-native-elements';
import ItemsLeftPageScreen from '../screens/ItemsLeftPageScreen';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useRoute} from '@react-navigation/native';
import {userContext} from './userContext.js';
import { firebase } from '../src/firebase/config'


export default (props) => {
    const user = React.useContext(userContext)
    const navigation = useNavigation()
    const [amount, setAmount] = useState(props.item.amount)
    const currentScreen = useRoute();

    //--------------------------------Storage API functions-------------------------------//
    
    const increasePrevProduct = () => {
        firebase.firestore().collection('users').doc(user).collection('prevProducts').doc(props.item.id)
        .update({
            amount: amount + 1
        })
        .catch((error) => console.log(error))
    }

    const increaseProduct = () => {
        firebase.firestore().collection('users').doc(user).collection('products').doc(props.item.id)
        .update({
            amount: amount + 1
        })
        .catch((error) => console.log(error))
    }

    const decreasePrevProduct = () => {
        firebase.firestore().collection('users').doc(user).collection('prevProducts').doc(props.item.id)
        .update({
            amount: amount - 1
        })
        .catch((error) => console.log(error))
    }

    const decreaseProduct = () => {
        firebase.firestore().collection('users').doc(user).collection('products').doc(props.item.id)
        .update({
            amount: amount - 1
        })
        .catch((error) => console.log(error))
    }

    const deleteProduct = () => {
        firebase.firestore().collection('users').doc(user).collection('products').doc(props.item.id).delete().then(() => {
            console.log("Document successfully deleted!");
        }).catch((error) => {
            console.error("Error removing document: ", error);
        });
    }

    const deletePrevProduct = () => {
        firebase.firestore().collection('users').doc(user).collection('prevProducts').doc(props.item.id).delete().then(() => {
            console.log("Document successfully deleted!");
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
        console.log(newProductList)
        props.onListChange(newProductList)
    }
    
    const handleRemove = () => {
        if (currentScreen.name === "InventoryScreen") {
            if (amount > 1) {
                setAmount(amount-1)
                decreaseProduct()
            }
    
            else {
                deleteProduct()
                onProductDeleted()
                
            }
        }

        else {
            if (amount > 1) {
                setAmount(amount-1)
                decreasePrevProduct()
            }
    
            else {
                deletePrevProduct()
                onProductDeleted()
            }
        }
        
    }

    const handleAdd = () => {
        if (currentScreen.name === "InventoryScreen") {
            setAmount(amount+1)
            increaseProduct()
        }

        else {
            setAmount(amount+1)
            increasePrevProduct()
        }
    }



    return (
        <TouchableOpacity onPress={() => navigation.push('ProductDetailsScreen')}>
            <View style = {styles.card}>
                <View style ={styles.imageContainer}>
                    <View style = {styles.imageSmallerContainer}>
                        <Image style={{width: "80%", height: "80%"}} source={{uri: props.item.image}}/>
                    </View>
                </View>
                <View style = {styles.textAndButtons}>
                    <View style ={styles.textContainer}>
                        <Text style = {styles.nameText}>{props.item.name}</Text>
                        <Text style = {styles.dateText}>{props.item.id}</Text>
                    </View>
                    <View style = {styles.buttonsContainer}>
                        <TouchableOpacity style = {styles.removeIconContainer} onPress={handleRemove}>
                            <Ionicons name='ios-remove-circle-outline' style = {styles.removeIcon} size={30}/>
                        </TouchableOpacity>
                        <View style = {styles.amountTextContainer}>
                            <Text style = {styles.amountText}>{amount}</Text>
                        </View>
                        <TouchableOpacity style = {styles.addIconContainer} onPress={handleAdd}>
                            <Ionicons name='ios-add-circle-outline' style = {styles.addIcon} size={30}/>
                        </TouchableOpacity>
                    </View>
                </View>
                
            </View>
        </TouchableOpacity>
        
    )
}

const styles = StyleSheet.create({
    card:{
        flexDirection:"row",
        borderRadius:5,
        marginBottom: "5%",
        borderWidth:1,
        borderColor: "lightgrey",
        height: Dimensions.get('window').height * 0.16,
        marginLeft: "5%",
        marginRight: "5%"
    },
    imageContainer: {
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageSmallerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'lightgrey',
        width: "80%", 
        height: "80%", 
        borderRadius: 10
    },
    textContainer: {
        flex:1,
    },
    nameText: {
        fontSize: 18,
        fontWeight: "600",
        marginTop: "8%",
        marginLeft: "8%",
    },
    dateText: {
        marginTop: "2%",
        marginLeft: "8%",
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
        fontSize: 20
    }

})
