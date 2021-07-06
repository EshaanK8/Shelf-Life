import React, { useState, useEffect, useRef} from 'react';
import {StyleSheet,Text,View, TouchableOpacity,TextInput, Image, Modal, Alert, useWindowDimensions} from 'react-native';
import {responsiveHeight,responsiveWidth,responsiveFontSize, responsiveScreenHeight} from "react-native-responsive-dimensions";
import { Button } from '@ui-kitten/components';
import { firebase } from '../src/firebase/config'
import{AuthContext} from '../components/context'
import {userContext} from '../components/userContext.js';
import profile from '../assets/profile.png'
import Ionicons from 'react-native-vector-icons/Ionicons';
import AnimatedLoader from 'react-native-animated-loader';

export default ({route, navigation}) => {
  const {signOutG} = React.useContext(AuthContext) //Get the signIn function from the AuthContext
  const [isLoading, setIsLoading] = React.useState(false)
  const user = React.useContext(userContext)
  const [userFullData, setUserFullData] = useState([])
  const windowHeight = useWindowDimensions().height;

  const AppButton = ({ onPress, title }) => (
    <TouchableOpacity onPress={onPress} style={styles.appButtonContainer}>
      <Text style={styles.appButtonText}>{title}</Text>
    </TouchableOpacity>
  );

  const [email, setEmail] = useState()
  const [name, setName] = useState()
  const [photo, setPhoto] = useState()

  const [isLocked, setIsLocked] = useState(true)
  const [modalVisible, setModalVisible] = useState(false)

  const [signInEmail, setSignInEmail] = useState("")
  const [signInPassword, setSignInPassword] = useState("")

  const [token, setToken] = useState(null)



  const getUserFullData = async (dataRetreived) => {
    var userFullData = null
    const usersRef = firebase.firestore().collection('users')
        usersRef
            .doc(user)
            .get()
            .then(firestoreDocument => {
                if (!firestoreDocument.exists) {
                    console.log("User does not exist anymore.")
                    return;
                }
                userFullData = firestoreDocument.data()
                dataRetreived(userFullData)
            })
            .catch(error => {
              console.log(error)
              setIsLoading(false)
            })
  }

  const onUserFullDataRecieved = (userFullData) => {
    setUserFullData(userFullData)
    setEmail(userFullData.email)
    setName(userFullData.fullName)
    if (typeof userFullData.photo !== 'string' || (!(userFullData.photo instanceof String))) {
      setPhoto("../assets/profile.png")
    }

    else {
      setPhoto(userFullData.photo)
    }
  }

  const handleLock = () => {
    if (isLocked) {
      setModalVisible(true)
    }

    else {
      setIsLocked(true)
    }
  }

  const handleLogin = () => {
    firebase.auth()
    .signInWithEmailAndPassword(signInEmail, signInPassword)
    
    .then((response) => {
      const uid = response.user.uid
      const usersRef = firebase.firestore().collection('users')
      usersRef
          .doc(uid)
          .get()
          .then((firestoreDocument) => {
              if (!firestoreDocument.exists) {
                alert("User does not exist anymore.")
                return;
              }
              console.log(userFullData.email)
              if (response.user.email === userFullData.email) {
                setToken(response)
                console.log(response)
              }

              else {
                alert("Invalid account. Please try again.")
              }
          })
          .catch((error) => {
            alert(error)
            setIsLoading(false)
          })
    })
    .catch((error) => {
      alert(error)
    })
  }

  const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  const handleSubmit = () => {
    if (token) {
      console.log("Pressed")
      token.user.updateEmail(email).then(() => {
        if ((name) && (name.length >= 2)) {
          firebase.firestore().collection('users').doc(user).update({"fullName": name})
          .catch((error) => {
            alert(error)
          })

          firebase.firestore().collection('users').doc(user).update({"email": email})
          .catch((error) => {
            alert(error)
          })

          setIsLocked(true)
        }

        else {
          alert("Name must be greater than two characters")
        }
      })
      .catch((error) => {
        alert(error)
      })
    }
  }

  useEffect(() => {
    getUserFullData(onUserFullDataRecieved)
  }, [] );

  const initialRender = useRef(true);
  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
    }
    else {
      setModalVisible(false)
      setIsLocked(false)
    }
  }, [token])

  //Render Loading Screen
  if (isLoading) {
    return <View style={{position:"absolute",top:0,bottom:0,left:0,right:0, alignItems: "center", justifyContent: "center"}}>
      <AnimatedLoader visible={true} overlayColor="rgba(255,255,255,0.75)" source={require("../assets/loader.json")} animationStyle={{width: 80, height: 80}} speed={2}/>
    </View>
  }

  return (
      <View style={[styles.container, { minHeight: Math.round(windowHeight) }]}>
        <View style={styles.headBox}>
          <View style={styles.settingsTextBox}>
            <Text style={styles.settingsText}>Settings</Text>
          </View>
          <View style={styles.imageBox}>
            <TouchableOpacity onPress={() => navigation.navigate("CameraScreen")} style={styles.avatar}>
                { ((route.params)) ? (route.params.capturedImage && <Image source={{uri:route.params.capturedImage.uri}} style = {{width: responsiveHeight(12), height: responsiveHeight(12), borderRadius:50}}/>) 
                  : (<Image source= {(typeof userFullData.photo === 'string') ? {uri: userFullData.photo} : profile} style = {{width: responsiveHeight(12), height: responsiveHeight(12), borderRadius:50}}/>
                )}
            </TouchableOpacity>
          </View>
          <TouchableOpacity style = {styles.lockIconContainer} onPress={handleLock}>
            {!isLocked ? <Ionicons name='lock-open-outline' size={responsiveHeight(3)}/> : <Ionicons name='lock-closed-outline' size={responsiveHeight(3)}/>}
          </TouchableOpacity>
        </View>

        <View style={styles.editBox}>
          <Text style = {styles.nameText}>Name</Text>
          <TextInput
            style={(!isLocked) ? styles.emailInput : styles.emailInputLocked}
            editable={!isLocked}  
            placeholderTextColor="#aaaaaa"
            onChangeText={(text) => setName(text)}
            value={name}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
          />
          <Text style = {styles.emailText}>Email</Text>
          <TextInput
            style={(!isLocked) ? styles.passwordInput : styles.passwordInputLocked}
            editable={!isLocked} 
            onChangeText={(text) => setEmail(text.replace(/\s/g, ''))}
            value={email}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
          />
        </View>
        {!isLocked && <View style={styles.logoutBox}>
          <Button status='success' style={{marginTop:"15%", borderRadius:30}} onPress={handleSubmit}><Text style={{ fontSize: responsiveFontSize(2.1), fontFamily: 'PTSans_700Bold' }}>Submit</Text></Button>
        </View>}
        <View style={styles.logoutBox}>
          <AppButton title="Sign Out" onPress={() => {signOutG()}}/>
        </View>

        <Modal animationType="slide" visible={modalVisible} onRequestClose={() => {setModalVisible(!modalVisible)}}>
          <View style = {[styles.container, { minHeight: Math.round(windowHeight) }]}>
            <View style={styles.headerContainer}>
              <TouchableOpacity style = {{flex:0.5, justifyContent:"center"}} onPress={() => setModalVisible(false)}>
                  <Ionicons name='arrow-back-outline' color="black" size={30}/>
              </TouchableOpacity>
            </View>
            <View style={styles.headBox2}>
              <View style={styles.settingsTextBox}>
                <Text style={styles.settingsText}>Please enter your login information</Text>
              </View>
            </View>

            <View style={styles.editBox}>
              <Text style = {styles.nameText}>Email</Text>
              <TextInput
                style={styles.emailInput}  
                placeholderTextColor="#aaaaaa"
                onChangeText={(text) => setSignInEmail(text.replace(/\s/g, ''))}
                value={signInEmail}
                underlineColorAndroid="transparent"
                autoCapitalize="none"
              />
              <Text style = {styles.emailText}>Password</Text>
              <TextInput
                style={styles.passwordInput}
                secureTextEntry
                onChangeText={(text) => setSignInPassword(text.replace(/\s/g, ''))}
                value={signInPassword}
                underlineColorAndroid="transparent"
                autoCapitalize="none"
              />
            </View>
            <View style={styles.logoutBox}>
              <AppButton title="Authenticate" onPress={handleLogin}/>
            </View>
          </View>
        </Modal>

      </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  headerContainer: {
    flexDirection: "column",
    alignItems:"flex-start",
    width:"100%",
    flex:0.2,
    justifyContent: "center",
    marginLeft: responsiveWidth(5),
    marginTop:"5%"
  },
  headBox: {
    flex:0.6,
    width:"100%",
  },
  headBox2: {
    flex:0.3,
    width:"100%",
  },
  settingsTextBox: {
  },
  imageBox: {
    justifyContent:"center",
    flex:0.8
  },
  editBox: {
    flex:0.6,
    width:"100%",
  },
  logoutBox: {
    flex:0.6,
    width:"100%",
    alignItems:"center",
  },
  avatar: {
    alignSelf:"center",
  },
  emailInput: {
    fontFamily: 'PTSans_400Regular',
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 15,
    width: "90%",
    borderColor: "lightgrey",
    alignSelf: "center",
    borderRadius:50
},
  passwordInput: {
      fontFamily: 'PTSans_400Regular',
      height: 50,
      borderWidth: 1,
      borderRadius: 10,
      paddingLeft: 15,
      width: "90%",
      borderColor: "lightgrey",
      alignSelf: "center",
      borderRadius:50
  },
  emailInputLocked: {
    fontFamily: 'PTSans_400Regular',
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 15,
    width: "90%",
    borderColor: "lightgrey",
    alignSelf: "center",
    borderRadius:50,
    backgroundColor: "lightgrey"
},
  passwordInputLocked: {
      fontFamily: 'PTSans_400Regular',
      height: 50,
      borderWidth: 1,
      borderRadius: 10,
      paddingLeft: 15,
      width: "90%",
      borderColor: "lightgrey",
      alignSelf: "center",
      borderRadius:50,
      backgroundColor: "lightgrey"
  },

  settingsText: {
    marginLeft:"5%",
    fontSize: responsiveFontSize(3.5),
    marginTop:"3%",
    fontFamily: 'PTSans_700Bold'
  },

  nameText: {
    marginLeft:"7%",
    marginBottom:"2%",
    fontSize: responsiveFontSize(2.5),
    fontFamily: 'PTSans_700Bold'
  },

  emailText: {
    marginLeft:"7%",
    marginTop:"10%",
    marginBottom:"2%",
    fontSize: responsiveFontSize(2.5),
    fontFamily: 'PTSans_700Bold'
  },
  logoutButton: {
    borderRadius:10,
    width:"20%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.00,
    elevation: 1,
    backgroundColor:"red",
  },
  lockIconContainer: {
    alignSelf:'flex-end',
    marginRight:"5%"
  },
  appButtonContainer: {
    backgroundColor: "#E100B2",
    borderRadius: 30,
    paddingVertical: "4%",
    paddingHorizontal: "6%",
    width:"70%",
    marginTop:"10%"
  },
  appButtonText: {
    fontSize: responsiveFontSize(2.2),
    color: "#fff",
    fontFamily: 'PTSans_700Bold',
    alignSelf: "center",
  }
});

