import React, {Component, useState, useEffect} from 'react';
import {StyleSheet,Text, Modal, View,Button, TouchableOpacity, Pressable, TextInput, FlatList, ScrollView, Dimensions} from 'react-native';
import {SearchBar} from 'react-native-elements'
import Icon from 'react-native-vector-icons/Fontisto';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Constants from 'expo-constants';
import ProductCard from '../components/ProductCard';
import ScanContainer from '../components/ScanContainer';
import {userContext} from '../components/userContext.js';
import { firebase } from '../src/firebase/config'
import {responsiveHeight,responsiveWidth,responsiveFontSize, responsiveScreenFontSize} from "react-native-responsive-dimensions";
import { List, ListItem, Avatar } from "react-native-elements";
import TouchableScale from 'react-native-touchable-scale'; // https://github.com/kohver/react-native-touchable-scale
import { useNavigation } from '@react-navigation/native';
import AddProductScreen from './AddProductScreen'
import { BlurView } from 'expo-blur';
import SearchCard from '../components/SearchCard';
import AnimatedLoader from 'react-native-animated-loader';


export default (props) => {
    const navigation = useNavigation();
    const user = React.useContext(userContext)
    const [userFullData, setUserFullData] = useState([])
    const [productList, setProductList] = useState([]);
    const [refreshing, setRefreshing] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [modalVisible, setModalVisible] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);
    

    //Product Storage
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [currentProductItem, setCurrentProductItem] = useState(null)

    //Search Bar
    const [error, setError] = useState(null)
    const [data, setData] = useState([])
    const [searchText, setSearchText] = useState("")
    const [searchBarToggle, setSearchBarToggle] = useState(false)


    //Search Bar function
    const searchFilterFunction = (text) => {
        // Check if searched text is not blank
        if (text) {
        // Inserted text is not blank
        // Filter the masterDataSource
        // Update FilteredDataSource
        const newData = productList.filter(function (item) {
            const itemData = item.name
            ? item.name.toUpperCase()
            : ''.toUpperCase();
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
        });
        setData(newData);
        setSearchText(text);
        } else {
        // Inserted text is blank
        // Update FilteredDataSource with masterDataSource
        setData(productList);
        setSearchText(text);
        }
    };


    //--------------------------------Storage API functions-------------------------------//
    function createDocument() {
        return firebase.firestore().collection('users').doc(user).collection('prevProducts').doc()
    }
    const addPrevProduct = (product, docRef) => {
        docRef.set({
        name: product.name,
        id: product.id,
        dateAdded:  firebase.firestore.FieldValue.serverTimestamp(),
        image: product.image,
        amount: product.amount
        })
        const newProductList = [...productList, product]
        setProductList(newProductList)
        setData(newProductList)
    }

    const getPrevProducts = async(productsRetreived) => {
        var productList = []
        var snapshot = await firebase.firestore()
        .collection('users').doc(user).collection('prevProducts')
        .orderBy('dateAdded')
        .get()

        snapshot.forEach((doc) => {
            productList.push(doc.data())
            data.push(doc.data())
        })

        productsRetreived(productList)
        productsRetreived(data)
    }

    const getUserFullData = async (dataRetreived) => {
        var userFullData = null
        const usersRef = firebase.firestore().collection('users')
            usersRef
                .doc(user)
                .get()
                .then(firestoreDocument => {
                    if (!firestoreDocument.exists) {
                        alert("User does not exist anymore.")
                        return;
                    }
                    userFullData = firestoreDocument.data()
                    dataRetreived(userFullData)
                })
                .catch(error => {
                    setIsLoading(false)
                    alert(error)
                })
    }
    //--------------------------------------------------------------------------------//

    //For inventory screen modal
    const handleModalChange = () => {
        props.onModalChange(false)
    }

   
    
    const handleItemPressed = (item) => {
        console.log(item.product_name)
        setCurrentItem(item)
        setModalVisible(!modalVisible)
    }

    const onModalChange = (newModal) => {
        setModalVisible(newModal)
    }

    const onClose = (newModal) => {
        setModalVisible(newModal)
        props.onModalChange(false)
    }

    const onNewItem = (newItem) => {
        props.onNewItem(newItem)
    }

    handleSearch = () => {
        let url = "https://world.openfoodfacts.org/cgi/search.pl?search_terms="+searchText+"&search_simple=1&action=process&json=true"
        setIsLoading(true)

        fetch(url)
        .then(res => res.json())
        .then(res => {
            setIsLoading(false)
            const products = res.products
            const numOfProducts = res.products.length
            setData(products)
        })
        .catch(error => {
            setIsLoading(false)
            console.log(error)
        });
    }
            
        /*
        fetch('https://oauth.fatsecret.com/connect/token', {
            method: 'POST',
            auth : {
                user : '555b2ba5df894f2ca4e479f92682ae8b',
                password : 'd49c97e7811a43879bd0472a8346be92'
             },
            headers: { 
                Accept: 'application/json',
                'Content-Type': 'application/json'},
            form: {
                'grant_type': 'client_credentials',
                'scope' : 'basic',
                'redirect_uri' : 'http://localhost:19004/'
            },
            json: true
        })
        .then(response => response.json())
        .then(response => {
            console.log(response);
        })
        .catch(err => {
            console.log(err);
        })
*/

    useEffect(() => {
        setIsLoading()
        const delayDebounceFn = setTimeout(() => {
        console.log(searchText)
        handleSearch()
        }, 200)

        return () => clearTimeout(delayDebounceFn)
    }, [searchText])

    return (

            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <TouchableOpacity style={styles.backButtonContainer} onPress={handleModalChange}>
                        <Ionicons name='arrow-back-outline' size={30}/>
                    </TouchableOpacity>
                </View>
                
                <SearchBar placeholder="Pancakes" lightTheme round value = {searchText} onChangeText={(text) => setSearchText(text)} autoCorrect={false}containerStyle = {styles.searchBar}/>

                <View style = {styles.listContainer}>

                {(() => {
                        if (searchText.length === 0) {
                            return (
                                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                    <Text  style= {{color: "grey", fontSize: responsiveScreenFontSize(2)}}>Search for a product</Text>
                                </View>
                                
                            )
                        }

                        else {
                            if (data.length === 0) {
                                return (
                                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                        <Text style= {{color: "grey", fontSize: responsiveScreenFontSize(2)}}>No Items</Text>
                                    </View> 
                                )
                            }
                            return (
                            <FlatList
                                    contentContainerStyle={{width: "100%"}}
                                    data={data} 
                                    renderItem={({ item }) => (
                                        <TouchableOpacity onPress = {()=>handleItemPressed(item)}>
                                            <SearchCard item = {item}/>
                                        </TouchableOpacity>
                                    )}
                                    refreshing = {refreshing}
                                    onRefresh = {handleRefresh}
                                    extraData = {modalVisible}
                                />
                            )}

                })()}
                </View>
                <Modal animationType="fade" transparent={true} visible={modalVisible} onRequestClose={() => {setModalVisible(!modalVisible);}}>
                    <BlurView intensity={100} style={[StyleSheet.absoluteFill, styles.nonBlurredContent]}>
                        <AddProductScreen item={currentItem} onModalChange={onModalChange} onClose={onClose} onNewItem={onNewItem}/>
                    </BlurView>
                </Modal>
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'rgba(52, 52, 52, 0)',
  },
  headerContainer: {
    flexDirection: "column",
    alignItems:"flex-start",
    width:"100%",
    flex:0.05,
    justifyContent: "center",
    marginLeft: responsiveWidth(5),
    marginTop:"5%"
  },
  listContainer: {
    width: "100%",
    flex: 1,
    backgroundColor:'rgba(52, 52, 52, 0)',
  },

  searchBar: {
    backgroundColor:'rgba(52, 52, 52, 0)',
    borderWidth: 0, //no effect,
    width: "100%",
    shadowColor: 'white', //no effect
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent'
  },

 backButtonContainer: {
}
});


{/*<ListItem bottomDivider containerStyle={{backgroundColor:"rgba(52, 52, 52, 0)"}} Component={TouchableScale} onPress={()=>handleItemPressed(item)}>
                                            <Avatar rounded source={{uri: item.image_front_small_url}} />
                                            <ListItem.Content>
                                            <ListItem.Title>{item.product_name}</ListItem.Title>
                                            <ListItem.Subtitle>{item.code}</ListItem.Subtitle>
                                            </ListItem.Content>
                                            <ListItem.Chevron />
                                    </ListItem>*/}