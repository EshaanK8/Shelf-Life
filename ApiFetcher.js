import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';

export default class ApiFetcher extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      isLoading: true,
      dataSource: null,
    }
  }

  componentDidMount() {
    return fetch('https://world.openfoodfacts.org/api/v0/product/024321930204.json')
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          dataSource: responseJson.product.product_name_en,
        })
      })
    
      .catch((error) => {
        console.log(error)
      })

  }


  //Render Method
  render() {
    
    if (this.state.isLoading){
      return (
        <View style={styles.container}>
          <ActivityIndicator/>
        </View>
      )
    }

  

    else {
      return (
        <View style = {styles.container}>
          <Text>{this.state.dataSource}</Text>
        </View>
      ) 
    }
    
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    
  }
});