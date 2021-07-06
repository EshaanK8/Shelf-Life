import React, {Component, useState, useEffect} from 'react';
import {StyleSheet,Text,View,Button, TouchableOpacity, TextInput, FlatList, Modal, ScrollView, useWindowDimensions, Dimensions, Image} from 'react-native';
import {SearchBar} from 'react-native-elements'
import Icon from 'react-native-vector-icons/Fontisto';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Constants from 'expo-constants';
import ProductCard from '../components/ProductCard';
import ScanContainer from '../components/ScanContainer';
import BlurSearch from './BlurSearch';
import {userContext} from '../components/userContext.js';
import { firebase } from '../src/firebase/config'
import { BlurView } from 'expo-blur';
import {createStackNavigator} from '@react-navigation/stack'
import { useIsFocused } from "@react-navigation/native";
//import {addProduct, getProducts, getUserFullData} from '../src/firebase/StorageApi'
import AnimatedLoader from 'react-native-animated-loader';
import {responsiveFontSize, responsiveScreenHeight} from "react-native-responsive-dimensions";
import { Alert } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';


export default ({navigation, route}) => {
  const user = React.useContext(userContext)
  const [userFullData, setUserFullData] = useState([])
  const [productList, setProductList] = useState([]);
  const [refreshing, setRefreshing] = useState(false)
  const [modalVisible, setModalVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const isFocused = useIsFocused();
  const [currentNavProduct, setCurrentNavProduct] = useState({uniqueId: "none"})
  const [isLoading, setIsLoading] = useState(false)
  const windowHeight = useWindowDimensions().height;

  //Search Bar
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

  const handleSearchButton = () => {
    setSearchBarToggle(!searchBarToggle)
    setData(productList)
  }

  const handleSettingsButton = () => {
    navigation.navigate("SettingsScreen")
  }

  const handleAddButton = () => {
    setModalVisible(!modalVisible)
  }


  //--------------------------------Storage API functions-------------------------------//
  
  function createDocument() {
    return firebase.firestore().collection('users').doc(user).collection('products').doc()
  }

  function createPrevDocument() {
    return firebase.firestore().collection('users').doc(user).collection('prevProducts').doc()
  }

  const addProduct = (product, docRef) => {
    docRef.set({
      name: product.name,
      code: product.code,
      id: product.id,
      dateAdded:  firebase.firestore.FieldValue.serverTimestamp(),
      image: product.image,
      amount: product.amount,
      ingredients: product.ingredients,
      allergens: product.allergens
    })
    .then(() => {
      console.log("Doc written")
      const newProductList = [...productList, product]
      setProductList(newProductList)
      setData(newProductList)
    })
    .catch(() => {
      console.log("Couldn't write doc")
    })
  }

  const addPrevProduct = (product, docRef) => {
    docRef.set({
      name: product.name,
      code: product.code,
      id: product.id,
      dateAdded:  firebase.firestore.FieldValue.serverTimestamp(),
      image: product.image,
      amount: product.amount
    })
    const newProductList = [...productList, product]

    const setParamsAction = NavigationActions.setParams({
      params: { data: newProductList },
      key: 'PrevBoughtScreen',
    });
    this.props.navigation.dispatch(setParamsAction);
  }


  const getProducts = async(productsRetreived) => {
      var productList = []
      var data = []
      var snapshot = await firebase.firestore()
      .collection('users').doc(user).collection('products')
      .orderBy('dateAdded')
      .get()

      snapshot.forEach((doc) => {
          productList.push(doc.data())
      })

      productsRetreived(productList)
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

  const onListChange = (newList) => {
    setProductList(newList)
    setData(newList)
  }

  const onAmountChange = () => {
    getProducts(onProductsRecieved)
  }

  const productExists = async(newItem, newItemRetreived) => {
    let sameProducts = []
    var snapshot = await firebase.firestore().collection('users').doc(user).collection('products').where("code", "==", newItem.code).get()
    
    snapshot.forEach((doc) => {
        sameProducts.push(doc.data());
    });

    return newItemRetreived(sameProducts)
  }

  const onNewItem = async(newItem) => {
    var sameProducts = await productExists(newItem, onNewItemRecieved)
    if ((newItem.name) && (newItem.code)) {
      if (newItem.amount > 0) {
        if (sameProducts.length !== 0) {
          let productID = sameProducts[0].id
          firebase.firestore().collection('users').doc(user).collection('products').doc(productID).update({amount: firebase.firestore.FieldValue.increment(newItem.amount)})

          const newProductList = [...productList]
          for (i = 0; i < productList.length; i++){
            if (productList[i].code === newItem.code) {
              newProductList[i].amount += newItem.amount
            }
          }
          setProductList(newProductList)
          setData(newProductList)
      }
        else {
          var newDoc = createDocument()
          var newPrevDoc = createPrevDocument()
          
          if ((!newItem.ingredients)) {
            newItem.ingredients = []
          }
      
          if ((!newItem.allergens)) {
            newItem.allergens = []
          } 
      
          if ((!newItem.image)) {
            newItem.image = ""
          } 

          addProduct({name: newItem.name, code: newItem.code, id: newDoc.id, amount: newItem.amount, dateAdded: '03/02/21', image: newItem.image, ingredients: newItem.ingredients, allergens: newItem.allergens }, newDoc)
          addPrevProduct({name: newItem.name, code: newItem.code, id: newDoc.id, amount: newItem.amount, dateAdded: '03/02/21', image: newItem.image, ingredients: newItem.ingredients, allergens: newItem.allergens }, newPrevDoc)  
        }
      }

      else {
        Alert.alert("Please enter more than one item")
      }
      
    }

    else {
      Alert.alert("This item cannot be added due to missing information")
    }
    getProducts(onProductsRecieved)
  }

  const onNewNavItem = async(newItem) => {
    var sameProducts = await productExists(newItem, onNewItemRecieved)
        if (sameProducts.length !== 0) {
          let productID = sameProducts[0].id
          firebase.firestore().collection('users').doc(user).collection('products').doc(productID).update({amount: firebase.firestore.FieldValue.increment(newItem.amount)})

          const newProductList = [...productList]
          for (i = 0; i < productList.length; i++){
            if (productList[i].code === newItem.code) {
              newProductList[i].amount += newItem.amount
            }
          }
          setProductList(newProductList)
          setData(newProductList)
      }
        else {
          var newDoc = createDocument()
          var newPrevDoc = createPrevDocument()

          if ((!newItem.ingredients)) {
            newItem.ingredients = []
          }
      
          if ((!newItem.allergens)) {
            newItem.allergens = []
          } 
      
          if ((!newItem.image)) {
            newItem.image = ""
          } 
          
          addProduct({name: newItem.name, code: newItem.code, id: newDoc.id, amount: newItem.amount, dateAdded: '03/02/21', image: newItem.image, ingredients: newItem.ingredients, allergens: newItem.allergens }, newDoc)
          addPrevProduct({name: newItem.name, code: newItem.code, id: newDoc.id, amount: newItem.amount, dateAdded: '03/02/21', image: newItem.image, ingredients: newItem.ingredients, allergens: newItem.allergens }, newPrevDoc)  
        }
    getProducts(onProductsRecieved)
  }



  const handleItemPressed = (item) => {
    setCurrentItem(item)
    navigation.navigate("ProductDetailsScreen", {item})
}

  const onModalChange = (newModal) => {
    getProducts(onProductsRecieved)
    setModalVisible(newModal)
  }
  
  const onProductsRecieved = (productList) => {
    setProductList(productList)
    setData(productList)
  }

  const onNewItemRecieved = (newItem) => {
    return newItem
  }

  const onUserFullDataRecieved = (userFullData) => {
    setUserFullData(userFullData)
  }

  //Like componentDidMount
  useEffect(() => {
    if (route.params) {
      const { navProduct } = route.params;
      //If its a new item that came in
      if (navProduct.uniqueId !== currentNavProduct.uniqueId) {
        setCurrentNavProduct(navProduct)
        onNewNavItem(navProduct)
      }
    }
    getProducts(onProductsRecieved)
    getUserFullData(onUserFullDataRecieved)
  }, [isFocused] );
  
  handleRefresh = () => {
    setRefreshing(true)
    getProducts(onProductsRecieved)
    setTimeout(function(){setRefreshing(false)}, 500);
  }

  return (
    <View style = {{marginTop: Constants.statusBarHeight, backgroundColor: "white", flex: 1, minHeight: Math.round(windowHeight)}}>
      
      {(isLoading) ? (
        <AnimatedLoader visible={visible} overlayColor="rgba(255,255,255,0.75)" animationStyle={{width: 100, height: 100, }} speed={1}/>
      ) 
      :(
        <FlatList
          contentContainerStyle={{
            ...Platform.select({
              ios: {
                paddingBottom:responsiveScreenHeight(12),
              },
              android: {
                paddingBottom:responsiveScreenHeight(8),
              }
            })
          }}
          ListHeaderComponent= {
          <View>
            <ScanContainer show = {!searchBarToggle}handleAddButton = {handleAddButton} handleSearchButton = {handleSearchButton} handleSettingsButton = {handleSettingsButton} fullName = {userFullData.fullName}/>
            {searchBarToggle && <SearchBar placeholder="Sourdough Bread" lightTheme round value = {searchText} onChangeText={(text) => searchFilterFunction(text)} autoCorrect={false} containerStyle = {styles.searchBar} inputStyle={{fontFamily: 'PTSans_400Regular'}}/>}
          </View>}
          data={data} 
          renderItem={({item}) => {
              return (
                <TouchableOpacity onPress = {()=>handleItemPressed(item)} style={{paddingLeft: "5%", paddingRight: "5%"}}>
                  <ProductCard item = {item} productList = {productList} onListChange={onListChange} onAmountChange={onAmountChange}/>
                </TouchableOpacity>
                
              )
          }}
          refreshing = {refreshing}
          onRefresh = {handleRefresh}
        />
      )}
    
      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => {setModalVisible(!modalVisible);}}>
        <BlurView intensity={330} style={[StyleSheet.absoluteFill, styles.nonBlurredContent]}>
          <BlurSearch productList = {productList} onNewItem = {onNewItem} onModalChange={onModalChange}/>
        </BlurView>
      </Modal>
    </View>
    
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2F1F8',
  },
  scanContainer: {
    flex: 1,
    flexDirection: "row",
    width: '100%',
    alignItems: 'center',
    paddingLeft: '5%',
    paddingRight: '5%',
  },
  settingsContainer: {
    flex:0.5,
    paddingRight: "5%",
    paddingTop: "3%",
    alignItems: 'flex-end',
  },
  searchContainer: {
    flex:0.5,
    paddingRight: "3%",
    paddingTop: "3.5%",
    alignItems: 'flex-end',
  },
  addContainer: {
    flex:0.5,
    paddingRight: "3%",
    paddingTop: "3.5%",
    alignItems: 'flex-end',
  },
  scanButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#DDDDDD",
    width:'46.5%',
    height: '80%',
    borderRadius: 10,
    backgroundColor: "rgba(142, 228, 175, 0.3)",
  },
  settingsIcon: {
  },
  receiptButton: {
    marginRight:"auto",
  },
  barcodeButton: {
    marginLeft:"auto"
  },
  scanText: {
    fontSize: responsiveFontSize(100),
    alignSelf: 'center'
  },
  scanIcon: {
    width: "100%", 
    height: "65%", 
    alignItems: "center", 
    justifyContent: "center"
  },
  welcomeTextContainer: {
    flex:4,
    paddingLeft: '5%',
    paddingTop: '3%'
  },
  welcomeText: {
    fontSize: responsiveFontSize(2),
    fontWeight:"700"
  },
  searchBar: {
    backgroundColor:'rgba(52, 52, 52, 0)',
    borderWidth: 0, //no effect
    shadowColor: 'white', //no effect
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
    borderRadius:50
  },
  nonBlurredContent: {
    width:"100%",
    height:"100%",
    alignItems: 'center',
    justifyContent: 'center',
  },


});