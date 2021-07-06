import React, {useState, useEffect} from 'react';
import {StyleSheet,Text, Modal, View,TouchableOpacity, FlatList} from 'react-native';
import {SearchBar} from 'react-native-elements'
import Ionicons from 'react-native-vector-icons/Ionicons';
import Constants from 'expo-constants';
import {userContext} from '../components/userContext.js';
import { firebase } from '../src/firebase/config'
import {responsiveWidth,responsiveScreenFontSize} from "react-native-responsive-dimensions";
import AddProductScreen from './AddProductScreen'
import { BlurView } from 'expo-blur';
import SearchCard from '../components/SearchCard';


export default (props) => {
    const user = React.useContext(userContext)
    const [productList, setProductList] = useState([]);
    const [refreshing, setRefreshing] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [modalVisible, setModalVisible] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);

    //Search Bar
    const [data, setData] = useState([])
    const [searchText, setSearchText] = useState("")

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
                
                <SearchBar placeholder="Pancakes" lightTheme round value = {searchText} onChangeText={(text) => setSearchText(text)} autoCorrect={false} containerStyle = {styles.searchBar} inputStyle={{fontFamily: 'PTSans_400Regular'}}/>

                <View style = {styles.listContainer}>

                {(() => {
                        if (searchText.length === 0) {
                            return (
                                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                    <Text  style= {{color: "grey", fontSize: responsiveScreenFontSize(2), fontFamily: 'PTSans_400Regular'}}>Search for a product</Text>
                                </View>
                                
                            )
                        }

                        else {
                            if (data.length === 0) {
                                return (
                                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                        <Text style= {{color: "grey", fontSize: responsiveScreenFontSize(2), fontFamily: 'PTSans_400Regular'}}>No Items</Text>
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
    borderTopColor: 'transparent',
    borderRadius:50
  },

 backButtonContainer: {
}
});