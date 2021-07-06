import React from 'react';
import {StyleSheet, View} from 'react-native';
import BlurSearch from './BlurSearch'
import AddProductScreen from './AddProductScreen'
import {NavigationContainer} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack'

export default ({navigation}) => {
    const AddFoodStack = createStackNavigator();
 
    return (
        <View style={styles.container}>
            <NavigationContainer>
                <AddFoodStack.Navigator initalRouteName = "BlurSearch" screenOptions={{ headerStyle: { backgroundColor: '#fff',elevation:0, borderBottomWidth: 0} }}>
                    <AddFoodStack.Screen name= "BlurSearch" component ={BlurSearch} options={{title: "Sign In", headerShown: false}}/>
                    <AddFoodStack.Screen name= "AddProductScreen"  component ={AddProductScreen} options={{title: "Add a product"}} />
                </AddFoodStack.Navigator>
            </NavigationContainer>
        </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  }
});