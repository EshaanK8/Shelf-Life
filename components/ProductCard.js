import React, {Component} from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Text, Card, Divider } from 'react-native-elements';
import ItemsLeftPageScreen from '../screens/ItemsLeftPageScreen';
import { useNavigation } from '@react-navigation/native';

export default (props) => {
    const navigation = useNavigation();
    return (
        <TouchableOpacity onPress={() => navigation.push('ProductDetailsScreen')}>
            <View style = {styles.card}>
                <View style ={styles.imageContainer}>
                    <View style = {styles.imageSmallerContainer}>
                        <Image style={{width: "80%", height: "80%"}} source={{uri: props.item.image}}/>
                    </View>
                </View>
                <View style ={styles.textContainer}>
                    <Text style = {styles.nameText}>{props.item.name}</Text>
                    <Text style = {styles.dateText}>{props.item.dateAdded}</Text>
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
        flex:2,
    },
    nameText: {
        fontSize: 20,
        fontWeight: "600",
        marginTop: "8%",
        marginLeft: "8%",
    },
    dateText: {
        marginTop: "2%",
        marginLeft: "8%",
    }
})
