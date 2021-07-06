import React from 'react';
import {StyleSheet,Text,View,Image, ImageBackground} from 'react-native';
import {responsiveFontSize} from "react-native-responsive-dimensions";
import diet from '../assets/diet.png'
import background from '../assets/background.png'

export default ({route, navigation}) => {
  const {item} = route.params;

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
            <View style={{flex:0.1}}>

            </View>
            <View style={styles.nameContainer}>
                    <View style ={styles.imageContainer}>
                        <View style = {styles.imageSmallerContainer}>
                            {(item.image) ? (
                                <Image style={{width: "80%", height: "100%", resizeMode:'cover', borderRadius: 3}} source={{uri: item.image}}/>
                            )
                            : (
                                <Image style={{width: "80%", height: "100%", resizeMode:'cover', borderRadius: 3}} source={diet}/>
                            )}
                        </View>
                    </View>
                    <View style = {styles.textAndButtons}>
                        <View style ={styles.textContainer}>
                            <Text style = {styles.nameText} numberOfLines = {1}>{item.name}</Text>
                            <Text style = {styles.dateText} numberOfLines = {1}>You have {item.amount} {item.name} left </Text>
                        </View>
                    </View>
            </View>
            <View style={{flex:0.2, width:"100%", paddingTop:"5%", paddingLeft:"5%", paddingRight:"5%", alignItems: "flex-start"}}><Text style={styles.productDetailsText}>Product Details</Text></View>
            <View style={styles.detailsContainer}>
                <View style = {styles.ingredients}>
                    <Text style = {styles.detailsHeader}>Ingredients</Text>
                    {((item.ingredients) && (item.ingredients.length !== 0)) ? (
                        <Text style ={styles.ingredientsText} numberOfLines = {5}>{arrayToString(item.ingredients)}</Text>
                    )
                :(
                    <Text style ={styles.ingredientsText}>Sorry, no ingredients info available for this product</Text>
                )}
                </View>
                <View style={{flex:0.1}}></View>
                <View style = {styles.allergens}>
                    <Text style = {styles.detailsHeader}>Allergens</Text>
                    {((item.allergens) && (item.allergens.length !== 0)) ? (
                        <Text style ={styles.allergensText} numberOfLines = {5}>{arrayToString(item.allergens)}</Text>
                    )
                :(
                    <Text style ={styles.allergensText}>Sorry, no allergens info available for this product</Text>
                )}
                </View>
            </View>
        </ImageBackground>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
      width: "100%",
      flex: 1,
      alignItems: 'center',
      backgroundColor:'#FAFAFA',
  },
nameContainer: {
        flex:2,
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
detailsContainer: {
      flex:1.8,
      width:"100%",
      paddingLeft: "5%",
      paddingRight: "5%",
      paddingTop: "3%"
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
      fontSize: responsiveFontSize(2)
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
      alignItems: "flex-start"
  },
  nameText: {
      fontSize: responsiveFontSize(3),
      fontWeight: "600",
      fontFamily: 'PTSans_700Bold'
  },
  dateText: {
      fontSize: responsiveFontSize(2),
      fontFamily: 'PTSans_400Regular',
      color: "#28C165"
  },
  textAndButtons: {
      flex: 0.6,
      flexDirection: "column",
      paddingTop: "2%",
      paddingLeft:"3%",
      paddingRight:"3%",
  },
  productDetailsText: {
    fontSize: responsiveFontSize(2.5),
    fontFamily: 'PTSans_700Bold',
  },
  ingredients: {
    flex:1,
    padding:"5%",
    borderRadius: 8,
    backgroundColor:"white"
  },
  allergens: {
    flex:1,
    padding:"5%",
    borderRadius: 8,
    backgroundColor:"white"
  },
  ingredientsText: {
    fontSize: responsiveFontSize(1.5),
    fontFamily: 'PTSans_400Regular',
    color: "black"
  },
  allergensText: {
    fontSize: responsiveFontSize(1.5),
    fontFamily: 'PTSans_400Regular',
    color: "black"
  },
  detailsHeader: {
    fontSize: responsiveFontSize(2.5),
    fontFamily: 'PTSans_700Bold',
    color: "black"
  },

});