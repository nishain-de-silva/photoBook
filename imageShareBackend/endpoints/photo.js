const router = require('express').Router()
const Photo = require('../models/Photo')
const fs = require('fs')
const { getProfilePicture } = require('../utils')

router.post('/', async (req, res) => {
    const base64Content = req.body.image
    const description = req.body.description || "No description"
    const sourceId = `${req.user.id}-${Date.now().toString()}`
    fs.writeFileSync(`storage/images/${sourceId}`, base64Content)
    const newImage = await new Photo({ sourceId, postedBy: req.user.id, description }).save()
    return res.json({
        success: true,
        message: "photo successfully uploaded",
        image: newImage
    })
})

router.delete("/:id", async (req, res) => {
    const deletedPhoto = await Photo.findByIdAndDelete(req.params.id)
    fs.rmSync(`storage/images/${deletedPhoto.sourceId}`)
    return res.json({
        success: true
    })
})

const getSelfReaction = (req, data) => {
    const reactions = ['like', 'dislike', 'love', 'funny']
    for(const reaction of reactions) {
        if(data[reaction].includes(req.user.id))
            return reaction
    }
    return 'none'
}

router.get('/', async (req, res) => {
    const photos = await Photo
        .find({})
        .populate('postedBy')
    
    const data = photos.map((value) => ({
        id: value.id,
        image: fs.readFileSync(`storage/images/${value.sourceId}`).toString('utf-8'),
        isSelf: value.postedBy?.id == req.user.id,
        selfReaction: getSelfReaction(req, value),
        like: value.like.length,
        dislike: value.dislike.length,
        love: value.love.length,
        funny: value.funny.length,
        description: value.description,
        profile: {
            image: getProfilePicture(value.postedBy?.id),
            username: value.postedBy?.name || 'anonymous'
        }
    }))
    
    return res.json({
        success: true,
        data
    })
})

router.get('/:photoId', async (req, res) => {
    try {
        const photo = await Photo.findById(req.params.photoId)
        return res.json({
            success: true,
            data: photo
        })
    } catch (error) {
        console.log(error)
        return res.json({
            success: false,
            message: 'unable to retrieve to photo. Motly likely photo id is incorrect format.'
        })
    }
})

router.put('/react', async (req, res) => {
    const { type, reacted, id } = req.body
    var updatedPost
    if(reacted)
        updatedPost = await Photo.findByIdAndUpdate(id, { $push: { [type]: req.user.id } }, { returnOriginal: false })
    else
        updatedPost = await Photo.findByIdAndUpdate(id, { $pull: { [type]: req.user.id } }, { returnOriginal: false })
    return res.json({
        success: true,
        updatedReactions: {
            selfReaction: getSelfReaction(req, updatedPost),
            like: updatedPost.like.length,
            dislike: updatedPost.dislike.length,
            love: updatedPost.love.length,
            funny: updatedPost.funny.length
        }
    })
})

router.get('/:photoId/comment/', async (req, res) => {
    const photoId = req.params.photoId
    const photoWithComments = await Photo.findById(photoId).populate('comments.user')
    const comments = photoWithComments.comments.map(rawComment => ({
        profile: {
            picture: getProfilePicture(rawComment.user?.id),
            name: rawComment.user?.name || 'anonymous'
        },
        body: rawComment.comment
    }))

    return res.json({
        success: true,
        comments
    })
})

router.post('/:photoId/comment/', async (req, res) => {
    const photoId = req.params.photoId
    const comment = req.body.comment
    const updatedData = await Photo.findByIdAndUpdate(photoId, 
        { $push: { comments: { user: req.user.id, comment } } },
        { returnOriginal: false }
    ).populate('comments.user')
    const comments = updatedData.comments.map(rawComment => ({
        profile: {
            picture: getProfilePicture(rawComment.user?.id),
            name: rawComment.user?.name || 'anonymous'
        },
        body: rawComment.comment
    }))
    
    return res.json({
        success: true,
        comments
    })
})

module.exports = router
