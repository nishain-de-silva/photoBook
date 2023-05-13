import React, { useEffect, useState } from "react";
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import TextField from "../components/TextField";
import Network from "../Network";
import blankProfile from '../assets/blankProfile.png'
import Button from "../components/Button";
import { launchImageLibrary } from "react-native-image-picker"

export default () => {
    const [details, setDetails] = useState({
        name: '',
        email: '',
        profilePicture: '',
        password: ''
    })

    const [password, setPassword] = useState("")

    useEffect(() => {
        Network.get("user/profile").then((result) => {
            setDetails({
                ...result.data.profile
            })
        })
    }, [])

    const pickImage = () => {
        launchImageLibrary(
            { includeBase64: true, mediaType: "photo" },
            (response) => {
                if(response.assets) {
                    const file = response.assets[0]
                    setDetails({
                        ...details,
                        profilePicture: `data:${file.type};base64,` + file.base64
                    })
                }
            }
        )
    }

    const onChange = (name) => {
        return (text) => {
            setDetails({
                ...details,
                [name]: text
            })
        }
    }

    const alert = () => {
        Alert.alert("Profile Updated", "Your profile has updated successfully")
    }

    const setNewPassword = () => {
        Network.put("user/profile", { password }).then((result) => {
            if(result.data.success) {
                setPassword("")
                alert()
            }
        })
    }

    const onSave = async () => {
        const newDetails = {...details}
        if(!newDetails.profilePicture) delete newDetails.profilePicture

        const updatedData = await Network.put("user/profile", newDetails)
        if(updatedData.data.success) {
            setDetails({
                ...updatedData.data.profile
            })
            alert()
        }
        
    }

    return <View style={styles.root}>
        <View style={styles.profileContainer}>
            <TouchableOpacity onPress={pickImage}>
                <Image source={details.profilePicture ? { uri: details.profilePicture } : blankProfile} style={styles.profilePicture} />
            </TouchableOpacity>
            <Text>Tap to change picture</Text>
        </View>
        <Text style={styles.heading}>Profile</Text>
        <TextField 
            onChange={onChange("name")}
            value={details.name} placeholder="Name" />
        <TextField 
            onChange={onChange("email")}
            value={details.email} placeholder="Email" />
        
        <Button 
            onPress={onSave}
            backgroundColor="#60ffc5" color="black" >Save Changes</Button>
        <Text style={styles.changePasswordHeading}>Change Password</Text>
        <TextField 
            onChange={(text) => { setPassword(text) }}
            value={password}
            placeholder="Password" />
        <Button
            onPress={setNewPassword}
            backgroundColor="#60ffc5" color="black" >Save Password</Button>
    </View>
}

const styles = StyleSheet.create({
    root: {
        height: "100%",
        marginTop: 20,
        alignItems: "stretch",
        padding: 20
    },
    changePasswordHeading: { color: "black", marginTop: 25, fontSize: 20, fontWeight: "800" },
    profileContainer: {
        alignItems: 'center'
    },
    profilePicture: {
        borderRadius: 50,
        margin: 10,
        height: 150,
        width: 150
    },
    editButton: {
        paddingHorizontal: 20
    },
    heading: {
        color: "black",
        fontSize: 30,
        fontWeight: "800"
    }
})