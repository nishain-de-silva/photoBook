import React, { useState } from "react"
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import TextField from "../components/TextField";
import Network from "../Network";
import blankPost from '../assets/blankPost.png'
import Button from "../components/Button";
import { launchImageLibrary } from "react-native-image-picker"
import MultilineField from "../components/MultilineField";

export default ({navigation}) => {
    const [image, setImage] = useState('')
    const [description, setDescription] = useState('')

    const pickImage = () => {
        launchImageLibrary(
            { includeBase64: true, mediaType: "photo" },
            (response) => {
                if(response.assets) {
                    const file = response.assets[0]
                    setImage(`data:${file.type};base64,` + file.base64)
                }
            }
        )
    }

    const post = async () => {
        await Network.post('photo', {
            image,
            description
        })
        navigation.replace("home")
    }

    return <View style={styles.root}>
        <View style={styles.imageContainer}>
            <Text style={styles.heading}>Post Photo</Text>
            <TouchableOpacity onPress={pickImage}>
                <Image source={image ? { uri: image } : blankPost} style={styles.profilePicture} />
            </TouchableOpacity>
            <Text>Tap to change picture</Text>
        </View>
        <MultilineField
            onChange={(text) => { setDescription(text) }}
            value={description} placeholder="Add some description..." />
        {!!description.length && !!image.length && <Button 
            onPress={post}
            backgroundColor="#60ffc5" color="black" >Post</Button>}
    </View>
}

const styles = StyleSheet.create({
    root: {
        height: "100%",
        marginTop: 20,
        alignItems: "stretch",
        padding: 20
    },
    imageContainer: {
        alignItems: 'center'
    },
    profilePicture: {
        borderRadius: 5,
        margin: 10,
        height: 200,
        width: 200
    },
    heading: {
        color: "black",
        fontSize: 30,
        fontWeight: "800"
    }
})   