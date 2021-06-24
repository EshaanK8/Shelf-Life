import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import Constants from 'expo-constants'
import ProductResult from './ProductResult'
import { Alert } from 'react-native';
import { Button, Text } from '@ui-kitten/components';
import {userContext} from '../components/userContext.js';
import { firebase } from '../src/firebase/config'


export default ({navigation}) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [data, setData] = useState("");
  const [isLoading, setIsLoading] = useState("");
  const user = React.useContext(userContext)

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setData(data)
    setScanned(true);
    setIsLoading(true)
    console.log(data)

    setData(data)
    setScanned(true);
    //check item
    let url = "https://world.openfoodfacts.org/api/v0/product/"+data+".json"
    setIsLoading(true)
    
    fetch(url)
    .then(res => res.json())
    .then(res => {
        setIsLoading(false)

        if (res.status_verbose !== "product found") {
            Alert.alert("You do not have this item in your home inventory")
        }

        else {
            firebase.firestore().collection('users').doc(user).collection('products').where("code", "==", res.product.code).get()
            .then((snapshot)=> {
                setIsLoading(false)
                let sameProducts = []
                snapshot.forEach((doc) => {
                    sameProducts.push(doc.data());
                })
                if (sameProducts.length === 0) {
                    Alert.alert("You do not have this item in your home inventory")
                }
            
                else {
                    Alert.alert("You have " + sameProducts[0].amount + " " + sameProducts[0].name + " left at home" )
                }
            })
            .catch((e) => {
                console.log(e)
            })
        }
    })
    .catch((e) => {
      console.log(e)
    })

    /*
    if (sameProducts.length === 0) {
        Alert.alert("You do not have this item in your home inventory")
    }

    else {
        Alert.alert("You have " + sameProducts[0].amount + " " + sameProducts[0].name + " left at home" )
    }*/
  

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
}

  return (
    <View style={styles.container}>
        <View style={styles.smallContainer}>
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={StyleSheet.absoluteFillObject}
          />
          {isLoading ? <View style={{position:"absolute",top:0,bottom:0,left:0,right:0, alignItems: "center", justifyContent: "center"}}><ActivityIndicator alignSelf="center" size="large" color="rgb(142, 228, 175)"/></View> : null}
          {scanned && <Button onPress={() => setScanned(false)} size='medium' status='success' style={styles.lookButton}>Look for a Barcode</Button>}
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  smallContainer: {
    flex: 1,
    justifyContent: "center",
    flexDirection: "row"
  },
  lookButton: {
    width: "80%",
    bottom: 0,
    alignSelf: "flex-end",
    marginBottom: "15%"
  }
});