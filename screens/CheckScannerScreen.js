import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Alert } from 'react-native';
import { Text } from '@ui-kitten/components';
import {userContext} from '../components/userContext.js';
import { firebase } from '../src/firebase/config'
import GradientButton from 'react-native-gradient-buttons';
import {responsiveHeight,responsiveFontSize} from "react-native-responsive-dimensions";
import AnimatedLoader from 'react-native-animated-loader';

export default ({navigation}) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(true);
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
          {isLoading ? 
            <View style={{position:"absolute",top:0,bottom:0,left:0,right:0, alignItems: "center", justifyContent: "center"}}>
              <AnimatedLoader visible={true} overlayColor="rgba(255,255,255,0.75)" source={require("../assets/loader.json")} animationStyle={{width: 80, height: 80}} speed={2}/>
            </View> : null}
          {scanned && <GradientButton text="Look for a Barcode" width='90%' violetPink  textStyle={{ fontSize: responsiveFontSize(2.1), fontFamily: 'PTSans_700Bold' }} impact radius={10} height={responsiveHeight(7)} style={styles.lookButton} onPressAction={() => setScanned(false)}/>}
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