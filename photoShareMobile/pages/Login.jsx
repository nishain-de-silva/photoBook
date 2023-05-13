import React, { useEffect, useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    useColorScheme,
    View,
} from 'react-native';
import { Header } from 'react-native/Libraries/NewAppScreen';
import Button from '../components/Button';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TextField from '../components/TextField';
import Network, { networkNavigation } from '../Network';

const DEFUALT_DETAILS = {
    name: '',
    password: '',
    email: ''
}

function Login({ navigation }) {
    const [isLogin, setIsLogin] = useState(true)
    const [details, setDetails] = useState(DEFUALT_DETAILS)
    const [alertMessage, setAlertMessage] = useState("")
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        networkNavigation.navigate = navigation.navigate
        AsyncStorage.getItem("authToken").then((value) => {
            if (value) navigation.replace("home")
            else setIsLoading(false)
        })
    }, [])

    const displayAlert = (message) => {
        setAlertMessage(message),
            setTimeout(() => {
                setAlertMessage("")
            }, 3500)
    }

    const onButtonPress = async () => {
        if (isLogin) {
            const result = await Network.post('login', {
                email: details.email,
                password: details.password
            })

            if (result.data.success) {
                AsyncStorage.setItem('authToken', result.data.token)
                navigation.replace("home")
            } else {
                displayAlert(result.data.message)
            }
        } else {

            const result = await Network.post('register', {
                email: details.email,
                password: details.password,
                name: details.name
            })
            if (result.data.success) {
                AsyncStorage.setItem('authToken', result.data.token)
                navigation.replace("home")
            } else {
                displayAlert(result.data.message)
            }
        }
    }

    const onValueChange = (name) => {
        return (text) => {
            setDetails({
                ...details,
                [name]: text
            })
        }
    }
    if (isLoading)
        return <View style={styles.container} >
            <Text style={styles.loadingLabel}>Loading...</Text>
        </View>
    return (
        <SafeAreaView>
            <View style={styles.container} >
                <Text style={styles.topTile}>
                    {isLogin ? "Login" : "Register"}
                </Text>
                <View style={styles.form}>
                    {!isLogin && <TextField
                        value={details.name}
                        onChange={onValueChange('name')}
                        placeholder='UserName'
                    />}
                    <TextField
                        onChange={onValueChange('email')}
                        value={details.email}
                        placeholder='Email'
                    />
                    <TextField
                        onChange={onValueChange('password')}
                        value={details.password}
                        placeholder='Password'
                        password={isLogin}
                    />

                    <Button backgroundColor="orange" onPress={onButtonPress} >{isLogin ? "Login" : "Register"}</Button>
                    {!!alertMessage && <Text style={styles.warningAlert}>{alertMessage}</Text>}
                    <View style={{ flexDirection: 'row', marginTop: 10, justifyContent: 'center' }}>
                        <Text>{isLogin ? "Don't have an accont? " : "Already have an account? "}</Text>
                        <TouchableOpacity onPress={() => { 
                            setDetails({
                                ...DEFUALT_DETAILS
                            })
                            setIsLogin(!isLogin)
                        }}>
                            <Text style={{ color: "blue", fontWeight: "600" }}>{isLogin ? "Sign Up" : "Login"}</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </View>
        </SafeAreaView>
    );
}



const styles = StyleSheet.create({
    primaryButton: {
        padding: 10,
        borderRadius: 5,
        color: 'white',
        backgroundColor: 'blue'
    },
    warningAlert: {
        padding: 5,
        marginTop: 5,
        backgroundColor: "white",
        borderRadius: 5,
        color: "#f14730",
        fontWeight: "800",
        fontSize: 15,
        borderColor: "#f1736e",
        borderWidth: 2,
        textAlign: "center"
    },
    container: {
        justifyContent: 'center',
        height: '100%',
        alignSelf: 'stretch',
        alignItems: 'center',
        backgroundColor: 'lightgreen'
    },
    inputField: {
        marginVertical: 10,
        paddingHorizontal: 10,
        padding: 5,
        borderColor: 'grey',
        borderWidth: 1,
        borderRadius: 5
    },
    topTile: {
        fontSize: 40,
        color: 'black',
        fontWeight: '600'
    },
    form: {
        marginTop: 10,
        backgroundColor: "white",
        padding: 10,
        borderRadius: 15,
        width: "80%"
    },
    sectionContainer: {
        marginTop: 32,
        paddingHorizontal: 24,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '600',
    },
    sectionDescription: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: '400',
    },
    loadingLabel: {
        fontSize: 25,
        fontWeight: 'bold',
        textAlign: "center",
        color: "white"
    },
    highlight: {
        fontWeight: '700',
    },
});

export default Login;  