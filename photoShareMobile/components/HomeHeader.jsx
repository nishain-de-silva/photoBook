import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import Button from "./Button";
import settingIcon from '../assets/profileSettings.png'
import postIcon from '../assets/post.png'
import AsyncStorage from "@react-native-async-storage/async-storage";

export default ({ navigation }) => {
    const logout = () => {
        AsyncStorage.clear()
        navigation.replace("auth")
    }
    return <View style={{
        justifyContent: "flex-end",
        alignContent: "center",
        flexDirection: 'row',
        backgroundColor: "white",
        borderBottomColor: "gray",
        borderBottomWidth: 1,
        padding: 10
    }}>
        <TouchableOpacity
            onPress={() => { navigation.navigate("post") }}
        >
            <Image
                source={postIcon}
                style={styles.iconButton}
            />
        </TouchableOpacity>
        <TouchableOpacity
            onPress={() => { navigation.navigate("settings") }}
        >
            <Image
                source={settingIcon}
                style={styles.iconButton}
            />
        </TouchableOpacity>
        <Button
            onPress={logout}
            backgroundColor="#498d93"
            color="white">
            Logout
        </Button>
    </View>
}

const styles = StyleSheet.create({
    iconButton: {
        tintColor: "#498d93",
        height: 30,
        width: 30,
        marginEnd: 20
    }
})