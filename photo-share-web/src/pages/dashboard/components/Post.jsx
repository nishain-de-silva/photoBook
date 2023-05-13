import likeIcon from '../assets/like.png'
import dislikeIcon from '../assets/dislike.png'
import heartIcon from '../assets/heart.png'
import laughIcon from '../assets/laugh.png'
import deleteIcon from '../assets/cancel.png'
import blankProfile from '../assets/blankProfile.webp'
import { useEffect, useState } from 'react'
import Comment from './Comment'
import CriticalPrompt from './CriticalPrompt'

const styles = {
    reactionIcon: {
        height: 15,
        width: 15,
        marginRight: 10
    },
    delete: {
        height: 15,
        width: 15
    },
    commentCompose: {
        position: "sticky",
        bottom: 0,
        backgroundColor: "white",
        paddingBottom: "1rem"
    }
}

export default ({ data, setReaction, loadComments, postComment, deletePost }) => {
    const [commentsVisible, setCommentsVisible] = useState(false)
    const [comment, setComment] = useState("")
    const [deletePromptVisible, setDeletePromptVisible] = useState(false)

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

    useEffect(() => {
        if (commentsVisible)
            loadComments(data.id)
    }, [commentsVisible])

    return <div className='mt-3 ms-2 me-2 row'>
        <div className="card ps-0 pe-0" style={{ width: "50%" }}>
            {data.isSelf && !deletePromptVisible && <div 
                style={{ position: "absolute", right: 0 }}
                className="d-flex justify-content-end">
                <div
                    onClick={() => { setDeletePromptVisible(true) }}
                    className="mt-3 me-3 close-button">
                    <img
                        src={deleteIcon}
                        style={styles.delete} />
                </div>
            </div>}
            {deletePromptVisible && <CriticalPrompt
                buttonLabel="Yes"
                onDismiss={() => { setDeletePromptVisible(false) }}
                message="Are you sure you want to delete this post?"
                onConfirm={() => { deletePost(data.id) }}
            />}
            <img src={data.image} class="card-img-top" alt="..." />

            <div class="card-body">

                <div style={{ position: 'relative', marginBottom: "45px" }}>
                    <div className="d-flex align-items-center position-absolute" style={{ top: "-45px" }}>
                        <img
                            src={data.profile.image || blankProfile}
                            style={{
                                width: 90,
                                height: 90,
                                borderRadius: '50%'
                            }}
                        />
                        <h5 class="card-title ms-2" >{data.profile.username}</h5>
                    </div>
                </div>

                <p class="card-text">{data.description}</p>
                {data.selfReaction != "none" && <span className='row'>{`You have reacted on this post with ${data.selfReaction}`}</span>}
                <div className="row">
                    <button
                        onClick={react('like')}
                        className="btn reactionButton col d-flex align-items-center"
                    >
                        <img src={likeIcon} style={styles.reactionIcon} />
                        <span>{data.like}</span>
                    </button>
                    <button
                        onClick={react('dislike')}
                        className="btn reactionButton col d-flex align-items-center"
                    >
                        <img src={dislikeIcon} style={styles.reactionIcon} />
                        <span>{data.dislike}</span>
                    </button>
                    <button
                        onClick={react('love')}
                        className="btn reactionButton col d-flex align-items-center"
                    >
                        <img src={heartIcon} style={styles.reactionIcon} />
                        <span>{data.love}</span>
                    </button>
                    <button
                        onClick={react('funny')}
                        className="btn reactionButton col d-flex align-items-center"
                    >
                        <img src={laughIcon} style={styles.reactionIcon} />
                        <span>{data.funny}</span>
                    </button>
                </div>

                <button
                    class={`mt-1 btn btn-${commentsVisible ? 'danger' : 'primary'}`}
                    onClick={() => {
                        setCommentsVisible(!commentsVisible)
                    }}
                >
                    {commentsVisible ? "Hide comments" : "See comments"}
                </button>
            </div>
        </div>

        {commentsVisible && <div class="col card ms-2" style={{ height: '80vh' }}>
            <div class="card-body pb-0" style={{ overflow: 'scroll' }}>
                <h5 class="card-title">Comments</h5>
                <div className="d-flex flex-column" >
                    {!(data.comments || []).length && <span className="my-2">No comments to display</span>}
                    {(data.comments || []).map((comment, index) =>
                        <Comment key={`comment-key-${index}`} data={comment} />
                    )}
                    <div className='d-flex' style={styles.commentCompose}>
                        <input
                            className='form-control'
                            placeholder="Enter a comment..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                        <button
                            className='btn btn-primary ms-1'
                            onClick={() => {
                                postComment(comment, data.id)
                                setComment("")
                            }}
                        >
                            Post
                        </button>
                    </div>
                </div>
            </div>
        </div>}
    </div>

}