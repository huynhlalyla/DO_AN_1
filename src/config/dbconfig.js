const mongoose = require('mongoose');
const User = require('../app/modals/Users');
const Post = require('../app/modals/Posts');

async function connect() {
    try {
        const databaseUrl = 'mongodb+srv://ptthuynhcntt2211017:WdS95PxlQnbvrFlj@doan01.nstcg.mongodb.net/DoAn01-Database?retryWrites=true&w=majority&appName=DoAn01'
        await mongoose.connect(databaseUrl);
        console.log('Kết nối database thành công!');
        await updateUserPostCounts(); // Gọi hàm cập nhật số bài post của user
    } catch (error) {
        console.log(`Lỗi: ${error}`);
    }
}

async function updateUserPostCounts() {
    try {
        const users = await User.find();
        for (const user of users) {
            const postCount = await Post.countDocuments({ author: user._id });
            user.countPost = postCount;
            await user.save();
        }
        console.log('Đã đồng bộ cơ sở dữ liệu lại!');
    } catch (error) {
        console.log(`Lỗi khi cập nhật số bài post của user: ${error}`);
    }
}


module.exports = { connect, updateUserPostCounts };
