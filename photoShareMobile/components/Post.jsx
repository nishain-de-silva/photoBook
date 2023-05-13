import React from "react"
import { Image, StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native"
import blankProfile from '../assets/blankProfile.png'
import like from '../assets/like.png'
import dislike from '../assets/dislike.png'
import love from '../assets/heart.png'
import funny from '../assets/laugh.png'
import Button from "./Button"
import deleteIcon from "../assets/cancel.png"

import { useNavigation } from "@react-navigation/native"
export default ({ data, setReaction, deletePost }) => {
    const navigation = useNavigation()
    const openComments = () => {
        navigation.navigate("comments", { postId: data.id })
    }

    const react = (reactionType) => {
        return () => {
            if (data.selfReaction == "none" || reactionType == data.selfReaction) {
                if (data.selfReaction == "none")
                    setReaction(reactionType, true, data.id)
                else
                    setReaction(reactionType, false, data.id)
            }
        }
    }

    const openDeleteConfirmation = () => {
        Alert.alert(
            "Are you sure?",
            "Are you sure you want to delete this post  ?",
            [
                {
                    text: "No keep",
                    style: "cancel"
                },
                {
                    text: "Yes delete",
                    onPress: () => { deletePost(data.id) },
                    style: "destructive"
                }
            ], { cancelable: true }
            )
    }

    return <View style={styles.root}>
        {data.isSelf && <View style={{ padding: 5, flexDirection: "row", justifyContent: "flex-end", marginBottom: 10 }}>
        <TouchableOpacity onPress={openDeleteConfirmation}>
            <Image source={deleteIcon} style={{ height: 15, width: 15 }} />
        </TouchableOpacity>
        </View>}
        
        <View style={styles.postProfileBanner}>
            <Image
                source={data.profile.image ? { uri: data.profile.image } : blankProfile}
                style={styles.profilePicture}
            />
            <Text style={styles.topUsername}>{data.profile.username}</Text>
        </View>

        <Image resizeMode="contain"
            source={data.image ? { uri: data.image } : blankProfile} style={styles.image} />
        <Text style={styles.description}>{data.description}</Text>
        {data.selfReaction != "none" && <Text style={styles.selfReactionLabel}>{`You have reacted on this post with ${data.selfReaction}`}</Text>}
        <View style={styles.reactionContainer}>
            <TouchableOpacity style={styles.reaction} onPress={react('like')} >
                <Image source={like} style={styles.reactionIcon} />
                <Text>{data.like}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.reaction} onPress={react('dislike')} >
                <Image source={dislike} style={styles.reactionIcon} />
                <Text>{data.dislike}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.reaction} onPress={react('love')} >
                <Image source={love} style={styles.reactionIcon} />
                <Text>{data.love}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.reaction} onPress={react('funny')} >
                <Image source={funny} style={styles.reactionIcon} />
                <Text>{data.funny}</Text>
            </TouchableOpacity>
        </View>
        <Button
            color="black"
            style={styles.commentSectionButton}
            onPress={openComments}>
            View Comments
        </Button>
    </View>
}

const styles = StyleSheet.create({
    profilePicture: {
        borderRadius: 550,
        height: 50,
        width: 50
    },
    postProfileBanner: {
        flexDirection: "row",
        marginBottom: 10,
        alignItems: 'center'
    },
    reaction: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    reactionContainer: {
        marginTop: 8,
        flexDirection: "row",
        justifyContent: "space-between",
        marginHorizontal: 15
    },
    reactionIcon: {
        height: 20,
        width: 20,
        marginEnd: 10
    },
    description: {
        marginTop: 8,
        color: "black",
        fontSize: 15,
    },
    topUsername: {
        color: "black",
        fontSize: 21,
        fontWeight: "900",
        marginStart: 10
    },
    selfReactionLabel: {
        marginTop: 8,
        color: "black",
        fontSize: 15,
        fontWeight: "600"
    },
    image: {
        width: "100%",
        height: 200,
        borderRadius: 5
    },
    commentSectionButton: {
        borderColor: 1,
        borderWidth: 1
    },
    root: {
        padding: 10,
        borderRadius: 10,
        marginVertical: 10,
        backgroundColor: 'white'
    }
})