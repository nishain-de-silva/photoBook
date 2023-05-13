const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const schema = mongoose.Schema({
    sourceId: {
        required: true,
        type: String
    },
    postedBy: {
        required: true,
        type: ObjectId,
        ref: "User"
    },
    description: {
        type: String
    },
    like: {
        type: [ObjectId],
        default: []
    },
    dislike: {
        type: [ObjectId],
        default: []
    },
    love: {
        type: [ObjectId],
        default: []
    },
    funny: {
        type: [ObjectId],
        default: []
    },
    comments: {
        type: [{
            user: {
                type: ObjectId,
                ref: "User"
            },
            comment: String
        }],
        default: []
    }
})

module.exports = mongoose.model("Photo", schema)