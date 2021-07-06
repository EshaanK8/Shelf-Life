import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Text } from '@ui-kitten/components';
import GradientButton from 'react-native-gradient-buttons';
import {responsiveHeight,responsiveFontSize} from "react-native-responsive-dimensions";

import AnimatedLoader from 'react-native-animated-loader';
import { Alert } from 'react-native';

export default ({navigation}) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(true);
  const [data, setData] = useState("");
  const [isLoading, setIsLoading] = useState("");
  const [product, setProduct] = useState("");

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setData(data)
    setScanned(true);

    let url = "https://world.openfoodfacts.org/api/v0/product/"+data+".json"
    setIsLoading(true)
    
    fetch(url)
    .then(res => res.json())
    .then(res => {
        setIsLoading(false)
        console.log(res.status_verbose)
        let product = null

        if (res.status_verbose !== "product found") {
          product = {code:data}
        }

        else {
          product = res.product
        }

        navigation.navigate("ProductResult", {product})
        setProduct(product)
    })
    .catch(error => {
        setIsLoading(false)
        console.log(error)
    })
  }

  const checkItem = (data) => {
    let url = "https://world.openfoodfacts.org/api/v0/product/"+data+".json"
    setIsLoading(true)
    
    fetch(url)
    .then(res => res.json())
    .then(res => {
        setIsLoading(false)
        console.log(res.status_verbose)
        let product = null

        if (res.status_verbose !== "product found") {
          product = {code:data}
        }

        else {
          product = res.product
        }

        setProduct(product)
    })
    .catch(error => {
        setIsLoading(false)
        console.log(error)
    })
}
  

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
        <View style={styles.smallContainer}>
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={StyleSheet.absoluteFillObject}
          />
          {isLoading ? <View style={{position:"absolute",top:0,bottom:0,left:0,right:0, alignItems: "center", justifyContent: "center"}}>
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