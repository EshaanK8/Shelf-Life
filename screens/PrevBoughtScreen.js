import React, {Component, useState, useEffect} from 'react';
import {StyleSheet,Text,View,Button, TouchableOpacity, TextInput, FlatList, ScrollView, Dimensions, ActivityIndicator} from 'react-native';
import Icon from 'react-native-vector-icons/Fontisto';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Constants from 'expo-constants';
import ProductCard from '../components/ProductCard';
import ScanContainer from '../components/ScanContainer';
import {userContext} from '../components/userContext.js';
import { firebase } from '../src/firebase/config'

export default ({navigation}) => {
  const user = React.useContext(userContext)
  const [userFullData, setUserFullData] = useState([])
  const [productList, setProductList] = useState([
  ]);
  const [refreshing, setRefreshing] = useState(false)

  //Product Storage
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [currentProductItem, setCurrentProductItem] = useState(null)

  //--------------------------------Storage API functions-------------------------------//
  const addPrevProduct = (product, addComplete) => {
    firebase.firestore()
    .collection('users').doc(user).collection('prevProducts')
    .add({
        name: product.name,
        key: product.key,
        dateAdded:  firebase.firestore.FieldValue.serverTimestamp(),
        image: product.image
    }).then((snapshot) => snapshot.get())
    .then((productData) => addComplete(productData.data()))
    .catch((error) => console.log(error))
  }

  const getPrevProducts = async(productsRetreived) => {
      var productList = []
      var snapshot = await firebase.firestore()
      .collection('users').doc(user).collection('prevProducts')
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

  
  const onProductAdded = (product) => {
    setProductList([...productList, product])
  }

  const onProductDeleted = () => {
    var newProductList = [...productList]
    newProductList.splice(selectedIndex, 1)
    setProductList(newProductList)
  }

  const onProductsRecieved = (productList) => {
    setProductList(productList)
  }

  const onUserFullDataRecieved = (userFullData) => {
    setUserFullData(userFullData)
  }

  //Like componentDidMount
  useEffect(() => {
    getPrevProducts(onProductsRecieved)
    getUserFullData(onUserFullDataRecieved)
  }, []);
  handleRefresh = () => {
    setRefreshing(true)
    setTimeout(function(){setRefreshing(false)}, 500);
  }

  return (

    <View style = {{paddingTop: Constants.statusBarHeight, backgroundColor: "white", flex: 1}}>
      <TextInput
        placeholder = "Add Product"
        value={currentProductItem}
        onChangeText = {(text) => setCurrentProductItem(text)}
      />
      <Button 
        style = {{width: 200, height: 100}}
        title='Submit' 
        onPress = {() => 
          addPrevProduct({name: currentProductItem, key: 8, dateAdded: '03/02/21', image: 'https://i5.walmartimages.ca/images/Large/514/354/6000202514354.jpg' }, onProductAdded) 
        }
      />
      <FlatList
      data={productList} 
      renderItem={({item}) => {
          return <ProductCard item = {item}/>
      }}
      refreshing = {refreshing}
      onRefresh = {handleRefresh}
    />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
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
    flex:1,
    paddingRight: "5%",
    paddingTop: "3%",
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
    fontSize: 15,
    alignSelf: 'center'
  },
  scanIcon: {
    width: "100%", 
    height: "65%", 
    alignItems: "center", 
    justifyContent: "center"
  },
  headerContainer: {
    flexDirection: "row",
    height: Dimensions.get('window').height * 0.07,
  },
  welcomeTextContainer: {
    paddingLeft: '5%',
    paddingTop: '3%'
  },
  welcomeText: {
    fontSize:20,
    fontWeight:"700"
  }


});