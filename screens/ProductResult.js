import React, {useState} from 'react';
import {StyleSheet,View, TouchableOpacity, Alert, TextInput, useWindowDimensions, Image, ImageBackground} from 'react-native';
import {responsiveHeight,responsiveFontSize} from "react-native-responsive-dimensions";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Button, Text } from '@ui-kitten/components';
import diet from '../assets/diet.png'
import background from '../assets/background.png'
import AnimatedLoader from 'react-native-animated-loader';

export default ({ route, navigation }) => {
    const { product } = route.params;
    const windowHeight = useWindowDimensions().height;
    
    const [amount, setAmount] = useState(0)

    const [showConfirm, setShowConfirm] = useState(false)

    const uidGenerator = () => {
        var S4 = function() {
           return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
        };
        return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
    }

    const [isLoading, setIsLoading] = useState("");
    const [barcode, setBarcode] = useState(product.code)
    const [prodName, setProdName] = useState("")
    const [image, setImage] = useState("")
    const [ingredients, setIngredients] = useState("")
    const [allergens, setAllergens] = useState("")
    

    const createProduct = () => {
        let newItem = {
          name: product.product_name,
          code: product.code,
          id: "",
          uniqueId: uidGenerator(),
          dateAdded: null,
          image: product.image_front_small_url,
          amount: amount,
          ingredients: product.ingredients_hierarchy,
          allergens: product.allergens_hierarchy
        }
        return newItem
    }
    
    const submit = () => {
        newItem = createProduct()
        if ((newItem.name) && (newItem.code)) {
            if (newItem.amount > 0) {
                setShowConfirm(true)
                setTimeout(() => {
                    navigation.navigate("InventoryScreen", {navProduct: newItem})
                }, 200)
            }
            else {
                Alert.alert("Please enter more than one item")
            }
        }
        else {
            Alert.alert("This item cannot be added due to missing information")
        }
    }

    const newProductSubmit = () => {
        
    }

    const increment = () => {
        setAmount(amount+1)
    }

    const decrement = () => {
        if(amount >= 1){
            setAmount(amount-1)
        }
    }

    const uploadProduct = () => {
        setIsLoading(true)
        fetch('https://us.openfoodfacts.org/cgi/product_jqm2.pl?code='+barcode+'&imgupload_front=../assets/diet.png&product_name='+prodName+'&ingredients_hierarchy='+ingredients+'&allergens_hierarchy='+allergens)
        .then(res => res.json())
        .then(res => {
            setIsLoading(false)
            const status = res.status
            if (status === 1) {
                handleSearch(barcode)
            }
        })
        .catch(error => {
            setIsLoading(false)
            console.log(error)
        });  
    }

    handleSearch = (data) => {
        let url = "https://world.openfoodfacts.org/api/v0/product/"+data+".json"
        setIsLoading(true)

        fetch(url)
        .then(res => res.json())
        .then(res => {
            setIsLoading(false)
            console.log(res.status_verbose)
            let product = null

            product = res.product

            navigation.push("ProductResult", {product})
            setProduct(product)
            //setModalVisible(!modalVisible)
        })
    }

    
  return (
    <View style={[styles.container, {minHeight: Math.round(windowHeight)}]}>
            {(!product.hasOwnProperty('product_name')) ? (
                <View style={styles.container}>
                    <ImageBackground source={background} style={{flex:1, resizeMode: "cover", alignItems: "center",  width: "100%"}}>
                    <View style={{flex:0.1}}>
                        
                    </View>
                    {isLoading ? <View style={{position:"absolute",top:0,bottom:0,left:0,right:0, alignItems: "center", justifyContent: "center"}}>
                        <AnimatedLoader visible={true} overlayColor="rgba(255,255,255,0.75)" source={require("../assets/loader.json")} animationStyle={{width: 80, height: 80}} speed={2}/>
                    </View> : null}
                    
                    <View style={{width:"100%", flex:2}}>
                        <View style={{flex:1.2}}>
                            <Text style={styles.sorryText}>Sorry, we couldn't find your product.</Text>
                            <Text style={styles.enterText}>Please enter the product's details, and we'll add it to our database</Text>
                        </View>
                        
                        <View style={{flex:1, justifyContent: "flex-end"}}>
                            <Text style={{marginLeft:"5%", fontSize: responsiveFontSize(3), fontFamily: 'PTSans_700Bold'}}>Name</Text>
                            <TextInput
                                style={styles.emailInput}
                                placeholder='Kodiak Cakes'
                                placeholderTextColor="#aaaaaa"
                                onChangeText={(text) => setProdName(text)}
                                value={prodName}
                                underlineColorAndroid="transparent"
                                autoCapitalize="none"
                                inputStyle={{fontFamily: 'PTSans_400Regular'}}
                            />
                        </View>
                        
                        <View style={{flex:1, paddingTop:"3%"}}>
                            <Text style={{marginLeft:"5%", fontSize: responsiveFontSize(3), fontFamily: 'PTSans_700Bold'}}>Barcode</Text>
                            <TextInput
                                style={styles.passwordInput}
                                onChangeText={(text) => setBarcode(text)}
                                value={barcode}
                                underlineColorAndroid="transparent"
                                autoCapitalize="none"
                                inputStyle={{fontFamily: 'PTSans_400Regular'}}
                            />
                        </View>
                    </View>

                    <View style = {styles.submitContainer}>
                        <Button onPress={uploadProduct} size='medium' status='danger' style={{width: "80%"}}><Text style ={{fontSize: responsiveFontSize(2), fontFamily: 'PTSans_700Bold', color: "white"}}>Submit</Text></Button>
                    </View>
                    </ImageBackground>
                </View>
                
            ) : (
                <View style={styles.container}>
                    <ImageBackground source={background} style={{flex:1, resizeMode: "cover", alignItems: "center",  width: "100%"}}>
                        <View style={{flex:0.1}}>

                        </View>
                        <View style={styles.nameContainer}>
                                <View style ={styles.imageContainer}>
                                    <View style = {styles.imageSmallerContainer}>
                                        {(product.image_front_small_url) ? (
                                            <Image style={{width: "80%", height: "100%", resizeMode:'cover', borderRadius: 5}} source={{uri: product.image_front_small_url}}/>
                                        )
                                        : (
                                            <Image style={{width: "80%", height: "100%", resizeMode:'cover', borderRadius: 5}} source={diet}/>
                                        )}
                                    </View>
                                </View>
                                
                                <View style = {styles.textAndButtons}>
                                    <View style ={styles.textContainer}>
                                        <Text style = {styles.nameText} numberOfLines = {2}>{product.product_name}</Text>
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
                            <Button onPress={submit} size='medium' status='danger' style={{width: "80%", fontFamily: 'PTSans_700Bold', color: "white"}}>Submit</Button>
                        </View>
                    </ImageBackground>
                </View>
            )}
            {showConfirm && <View style={styles.confirmationBox}><Ionicons size={responsiveHeight(3)} style = {{marginRight:"2%"}}name="checkmark-circle-outline"/><Text>Product Added!</Text></View>}
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
        flex:1,
        width: '100%',
        alignItems: 'center',
        paddingTop:"5%",
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
    emailInput: {
        height: 50,
        margin: 12,
        borderWidth: 1,
        borderRadius: 50,
        paddingLeft: 15,
        width: "90%",
        borderColor: "lightgrey"
    },
    passwordInput: {
        height: 50,
        margin: 12,
        borderWidth: 1,
        borderRadius: 50,
        paddingLeft: 15,
        width: "90%",
        borderColor: "lightgrey"
    },
    sorryText: {
        color: "black",
        fontSize: responsiveFontSize(3.5),
        fontFamily: 'PTSans_700Bold',
        marginLeft:"5%",
      },
    enterText: {
        color: "black",
        fontSize: responsiveFontSize(2.5),
        fontFamily: 'PTSans_400Regular',
        marginLeft:"5%",
        marginTop: "8%"
    },
});