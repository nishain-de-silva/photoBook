import React, { useEffect, useState } from "react"
import { FlatList, StyleSheet, View, TouchableOpacity, Image, Text } from "react-native"
import Network from "../Network"
import TextField from "../components/TextField"
import send from "../assets/send.png"
import blankProfile from "../assets/blankProfile.png"

const Comment = ({ data }) => {
    return <View style={styles.commentRoot}>
        <View style={styles.commentProfile}>
            <Image
                style={styles.commentProfileImage}
                source={data.profile.picture ? { uri: data.profile.picture } : blankProfile} />
            <Text style={{ fontWeight: "800" }}>{data.profile.name}</Text>
        </View>
        <Text>{data.body}</Text>
    </View>
}

export default ({ route }) => {
    const [commentList, setCommentList] = useState([])
    const [comment, setComment] = useState("")

    useEffect(() => {}, [
        Network.get(`photo/${route.params.postId}/comment`).then((result) => {
            if(result.data.success) {
                setCommentList(result.data.comments)
            }
        })
    ])
    
    const renderComments = ({ item }) => {
        return <Comment data={item} />
    }

    const postComment = async () => {
        if(!comment.length) return
        const result = await Network.post(`photo/${route.params.postId}/comment`, {
            comment
        })
        if(result.data.success) {
            setComment("")
            setCommentList(result.data.comments)
        }
    }

    const EmptyBanner = () => {
        return <Text style={styles.emptyBanner}>No comments to display</Text>
    }

    return <View style={styles.root}>
        <FlatList
            data={commentList}
            style={styles.commentList}
            keyExtractor={(_, index) => `comment_${index}`}
            renderItem={renderComments}
            ListEmptyComponent={EmptyBanner}
        />
        <View style={styles.composer} >
            <TextField
                style={{ flex: 1 }}
                value={comment}
                placeholder="Add a comment..."
                onChange={setComment} />
            <TouchableOpacity style={styles.submit}
                onPress={postComment}
            >
                <Image
                    source={send}
                    style={{ height: 20, width: 20, tintColor: "#498d93" }} />
            </TouchableOpacity>

        </View>
    </View>
}

const styles = StyleSheet.create({
    root: {
        padding: 10,
        height: "100%"
    },
    composer: {
        flexDirection: 'row', alignItems: 'center', marginTop: 10, flex: 0
    },
    commentList: { flex: 1 },
    submit: {
        borderColor: "#498d93",
        flex: 0,
        borderRadius: 25,
        borderWidth: 1,
        padding: 10,
        marginStart: 5
    },
    emptyBanner: {textAlign: "center", margin: 20, color: "black", fontSize: 20},
    commentProfile: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: 'center'
    },
    commentRoot: {
        padding: 10,
        backgroundColor: "#bedbff",
        borderWidth: 1,
        borderColor: '#63bdff',
        borderRadius: 5,
        marginVertical: 7
    },
    commentProfileImage: {
        borderRadius: 10,
        marginEnd: 10,
        width: 30,
        height: 30
    }
})