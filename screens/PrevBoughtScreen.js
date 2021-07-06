import React, {useState, useEffect} from 'react';
import {StyleSheet,Text,View,TouchableOpacity, Modal, useWindowDimensions, TextInput, FlatList, ScrollView, Dimensions} from 'react-native';
import {SearchBar} from 'react-native-elements'
import Constants from 'expo-constants';
import PrevProductCard from '../components/PrevProductCard';
import {userContext} from '../components/userContext.js';
import { firebase } from '../src/firebase/config'
import { useIsFocused } from "@react-navigation/native";
import PrevProductDetailsScreen from './PrevProductDetailsScreen';

import {responsiveFontSize, responsiveScreenHeight} from "react-native-responsive-dimensions";

export default ({navigation}) => {
  const user = React.useContext(userContext)
  const [userFullData, setUserFullData] = useState([])
  const [productList, setProductList] = useState([]);
  const [refreshing, setRefreshing] = useState(false)
  const isFocused = useIsFocused();
  const [modalVisible, setModalVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const windowHeight = useWindowDimensions().height;

  //Search Bar
  const [data, setData] = useState([])
  const [searchText, setSearchText] = useState("")


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
    console.log("Hello" + firebase.firestore().collection('users').doc(user).collection('products').doc("x0ShX57DOKR503mqIqlI").name)
    return firebase.firestore().collection('users').doc(user).collection('products').doc()
  }

  const addProduct = (product, docRef) => {
    if ((!product.ingredients)) {
      product.ingredients = []
    }

    if ((!product.allergens)) {
      product.allergens = []
    }
    
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
      //const newProductList = [...productList, product]
      //setProductList(newProductList)
      //setData(newProductList)
    })
    .catch(() => {
      console.log("Couldn't write doc")
    })
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

  const onListChange = (newList) => {
    setProductList(newList)
    setData(newList)
  }
  
  const onProductsRecieved = (productList) => {
    setProductList(productList)
    setData(productList)
  }

  const onUserFullDataRecieved = (userFullData) => {
    setUserFullData(userFullData)
  }

  const handleItemPressed = (item) => {
    console.log(item.name)
    setCurrentItem(item)
    setModalVisible(!modalVisible)
  }

  const handleLongPressButton = (item) => {
    console.log("Hello " + item.name)
  }

  const onModalChange = (newModal) => {
    setModalVisible(newModal)
  }

  const onClose = (newModal) => {
      setModalVisible(newModal)
  }

  const productExists = async(newItem, newItemRetreived) => {
    let sameProducts = []
    var snapshot = await firebase.firestore().collection('users').doc(user).collection('products').where("code", "==", newItem.code).get()
    
    snapshot.forEach((doc) => {
        sameProducts.push(doc.data());
    });

    return newItemRetreived(sameProducts)
  }

  const onNewItemRecieved = (newItem) => {
    return newItem
  }



  const onNewItem = async(newItem) => {
    var sameProducts = await productExists(newItem, onNewItemRecieved)
    if ((newItem.name) && (newItem.code) && (newItem.amount) && (newItem.image)) {
      if (newItem.amount > 0) {
        if (sameProducts.length !== 0) {
          console.log("already exists")
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
          console.log("new")
          var newDoc = createDocument()
          addProduct({name: newItem.name, code: newItem.code, id: newDoc.id, amount: newItem.amount, dateAdded: '03/02/21', image: newItem.image, ingredients: newItem.ingredients, allergens: newItem.allergens}, newDoc)
          console.log("product added")
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


  //Like componentDidMount
  useEffect(() => {
    getPrevProducts(onProductsRecieved)
    getUserFullData(onUserFullDataRecieved)
  }, [isFocused]);
  handleRefresh = () => {
    setRefreshing(true)
    getPrevProducts(onProductsRecieved)
    setTimeout(function(){setRefreshing(false)}, 500);
  }

  return (

    <View style = {{paddingTop: Constants.statusBarHeight, paddingLeft:"5%", paddingRight:"5%", backgroundColor: "white", flex: 1,  minHeight: Math.round(windowHeight)}}>
      <View style={styles.bigTitleContainer}>
        <Text style={styles.title}>Previously Bought Products 🧀</Text>
      </View>
      <View style={{flex:0.92}}>
        <SearchBar 
          placeholder="Gouda Cheese" 
          lightTheme 
          round 
          value = {searchText} 
          onChangeText={(text) => searchFilterFunction(text)} autoCorrect={false}
          containerStyle = {styles.searchBar}
        />
        <FlatList
          data={data} 
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
          renderItem={({item}) => {
              return (
              <TouchableOpacity onPress = {()=>handleItemPressed(item)}>
                <PrevProductCard item = {item} productList = {productList} onListChange={onListChange}/>
              </TouchableOpacity>)
          }}
          refreshing = {refreshing}
          onRefresh = {handleRefresh}
        />
        <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => {setModalVisible(!modalVisible);}}>
            <PrevProductDetailsScreen productList = {productList} item={currentItem} onModalChange={onModalChange} onClose={onClose} onNewItem={onNewItem}/>
        </Modal>
      </View>
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
  },
  searchBar: {
    backgroundColor: 'white',
    borderWidth: 0, //no effect
    shadowColor: 'white', //no effect
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent'
  },
  bigTitleContainer: {
    flexDirection: "row",
    width:"100%",
    flex:0.05,
    paddingLeft: '5%',
    paddingRight: '5%',
    paddingTop: '5%',
  },
  title: {
    fontSize: responsiveFontSize(3),
    fontFamily: 'PTSans_700Bold'
  },
    searchBar: {
    backgroundColor:'rgba(52, 52, 52, 0)',
    borderWidth: 0, //no effect,
    width: "100%",
    shadowColor: 'white', //no effect
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent'
  },
});