const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Post = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    postTitle: {type: String},
    postContent: {type: String},
    industryName: {type: String},
    thumnail: {type: String},
    file: {type: String},
    type: {type: String},
}, {
    timestamps: true,
})
//thêm chỉ mục để tìm kiếm
Post.index({
    postTitle: 'text',
    postContent: 'text',
});

module.exports = mongoose.model('Post', Post);