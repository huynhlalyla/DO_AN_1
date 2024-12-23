const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
    userName: {
        type: String,
        required: true,
        trim: true
    },
    userPassword: {
        type: String,
        required: true
    },
    userEmail: {
        type: String,
        required: true,
    },
    userAvatar: {
        type: String,
        default: '/Image/default-user.png'
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    countPost: {
        type: Number,
        default: 0
    },
}, {
    timestamps: true
});

User.index({userName: 'text', userEmail: 'text', status: 'text'});

module.exports = mongoose.model('User', User);