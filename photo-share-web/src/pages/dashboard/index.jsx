import logoutIcon from '../dashboard/assets/logout.png'
import blankProfile from '../dashboard/assets/blankProfile.webp'
import EditableField from './components/EditableField'
import Post from './components/Post'
import { useEffect, useState } from 'react'
import Network from '../../Network'

const styles = {
    icon: {
        height: 20,
        width: 20,
    },
    navButton: {
        backgroundColor: 'white'
    },
    gradientButton: {
        backgroundImage: 'linear-gradient(to right bottom, rgb(0, 178, 244), rgb(54 132 235))',
        color: 'white',
        fontWeight: 'bold'
    },
    photoListContainer: {
        backgroundColor: '#c1c1ea',
        height: '100vh',
        overflow: 'scroll'
    },
    profilePicture: {
        borderRadius: 50,
        height: 100,
        width: 100
    }
}

function Dashboard() {

    const [captureDescription, setCaptureDescription] = useState(false)
    const [description, setDescription] = useState("")
    const [posts, setPosts] = useState([])
    const [userInfo, setUserInfo] = useState({
        name: '',
        email: '',
        profilePicture: ''
    })

    const refreshPosts = async () => {
        const result = await Network.get('photo')

        if (result.data.success) {
            setPosts(result.data.data)
        }
    }

    const logout = () => {
        localStorage.clear()
        window.location.href = "/auth"
    }

    useEffect(() => {
        Network.get('user/profile').then((result) => {
            const fetchedData = result.data.profile
            
            const profileData = {
                name: fetchedData.name,
                email: fetchedData.email,
                profilePicture: fetchedData.profilePicture
            }
            setUserInfo(profileData)
        })
        refreshPosts()
    }, [])

    const loadComments = async (postId) => {
        const comments = await Network.get(`photo/${postId}/comment`)
        if(comments.data.success) {
            const index = posts.findIndex((post) => post.id == postId)
            posts[index].comments = comments.data.comments
            setPosts([...posts])
        }
        
    }

    const addComment = async (comment, postId) => {
        if(!comment) return
        const comments = await Network.post(`photo/${postId}/comment`, {
            comment
        })
        if(comments.data.success) {
            const index = posts.findIndex((post) => post.id == postId)
            
            posts[index].comments = comments.data.comments
            setPosts([...posts])
        }
    }

    const onPublishPhoto = (event) => {
        const reader = new FileReader()
        reader.onload = async () => {
            const result = await Network.post('photo', {
                image: reader.result,
                description
            })

            if (result.data.success) {
                setDescription("")
                setCaptureDescription(false)
                refreshPosts()
            }
        }
        reader.readAsDataURL(event.currentTarget.getElementsByTagName('input')[0].files[0])
    }

    const cancelPhotoPost = () => {
        setCaptureDescription(false)
        setDescription("")
    }

    const onProfilePictureChange = (event) => {
        const reader = new FileReader()
        reader.onload = async () => {
            const result = await Network.put('user/profile', {
                profilePicture: reader.result
            })
            setUserInfo({
                ...userInfo,
                profilePicture: result.data.profile.profilePicture
            })
        }

        reader.readAsDataURL(event.target.files[0])
    }

    const onProfileChange = (attributeName) => {
        return async (value) => {
            const result = await Network.put('user/profile', {
                [attributeName]: value
            })

            if(attributeName == "password") return
            setUserInfo({
                ...userInfo,
                [attributeName]: result.data.profile[attributeName]
            })
        }
    }

    const onFileUploadClick = (event) => {
        event.currentTarget.getElementsByTagName('input')[0].value = ''
        event.currentTarget.getElementsByTagName('input')[0].click()
    }

    const onReacted = async (reactionType, didReacted, id) => {
        const result = await Network.put('photo/react', { type: reactionType, reacted: didReacted, id })
        if(result.data.success) {
            const updatedReactions = result.data.updatedReactions
            const index = posts.findIndex((post) => post.id == id)
            
            const { like, dislike, love, funny, selfReaction } = updatedReactions
            posts[index] = {
                ...posts[index],
                like, dislike, love, funny, selfReaction
            }
            setPosts([...posts])
        }
    }

    const deletePost = async (postId) => {
        const result = await Network.delete(`photo/${postId}`)
        if(result.data.success) {
            refreshPosts()
        }
    }

    return <div className="Dashboard">
        <nav class="navbar navbar-expand-lg navbar-light" style={{
            backgroundImage: 'linear-gradient(to left top, #8e00ff, #00ffdb)'
        }}>
            <div class="container-fluid">
                <a class="navbar-brand" href="#">Photo Sharing</a>
                <div>
                    <button
                        className='btn ms-3'
                        style={styles.navButton}
                        onClick={logout}
                    >
                        <img src={logoutIcon} style={styles.icon} />
                    </button>
                </div>
            </div>
        </nav>
        <div className='row container-fluid'>
            <div className='col-4 p-4'>
                <div className='m-auto card'>
                    <div className='card-body ps-3'>
                        <h5 className='card-title'>Profile</h5>
                        <div className='col col-gutter'>
                            <div className='d-flex  align-items-center'>
                                <img src={userInfo.profilePicture || blankProfile} style={styles.profilePicture} />
                                <button className='ms-2 btn btn-primary' onClick={onFileUploadClick}>
                                    <input type="file" hidden onChange={onProfilePictureChange} />
                                    Change
                                </button>
                            </div>

                            <EditableField value={userInfo.name} setvalue={onProfileChange('name')} />
                            <EditableField value={userInfo.email} setvalue={onProfileChange('email')} />
                            <EditableField value={userInfo.password} isPassword setvalue={onProfileChange('password')} />

                            {captureDescription && <div className='my-3 row'>
                                <label class="form-label">Tell something photo</label>
                                <textarea class="form-control" value={description}
                                    onChange={
                                        (e) => setDescription(e.target.value)
                                    }
                                    rows="3"
                                />
                            </div>}
                            <div className='row d-flex justify-content-center'>
                                <button
                                    className="btn btn-primary"
                                    onClick={captureDescription ? onPublishPhoto : onFileUploadClick} >
                                    <input type="file"
                                        onChange={() => { setCaptureDescription(true) }}
                                        hidden accept="image/png, image/gif, image/jpeg" />
                                    Post Photo
                                </button>
                                {captureDescription && <button
                                    onClick={cancelPhotoPost}
                                    className='mt-3 btn btn-danger' >
                                    Cancel
                                </button>}
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            <div
                className='col-8'
                style={styles.photoListContainer}>
                {
                    posts.map((post) =>
                        <Post
                            key={post.id}
                            data={post}
                            setReaction={onReacted}
                            loadComments={loadComments}
                            postComment={addComment}
                            deletePost={deletePost}
                        />)
                }

            </div>


        </div>

    </div>
}

export default Dashboard