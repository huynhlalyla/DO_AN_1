const mongoose = require('mongoose');
const User = require('../app/modals/Users');
const Post = require('../app/modals/Posts');

async function connect() {
    try {
        const databaseUrl = 'mongodb+srv://ptthuynhcntt2211017:WdS95PxlQnbvrFlj@doan01.nstcg.mongodb.net/DoAn01-Database?retryWrites=true&w=majority&appName=DoAn01'
        await mongoose.connect(databaseUrl);
        console.log('Connected!');
        await updateUserPostCounts(); // Gọi hàm cập nhật số bài post của user
        await updateOldData(); // Gọi hàm cập nhật dữ liệu cũ
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
        console.log('User post counts updated!');
    } catch (error) {
        console.log(`Lỗi khi cập nhật số bài post của user: ${error}`);
    }
}

async function updateOldData() {
    try {
        const users = await User.find();
        for (const user of users) {
            // Kiểm tra và cập nhật các trường mới
            if (!user.newField) {
                user.newField = 'defaultValue'; // Thêm trường mới với giá trị mặc định
            }
            // Xóa các trường không còn sử dụng
            if (user.oldField) {
                delete user.oldField;
            }
            await user.save();
        }
        console.log('Old data updated!');
    } catch (error) {
        console.log(`Lỗi khi cập nhật dữ liệu cũ: ${error}`);
    }
}

module.exports = { connect, updateUserPostCounts, updateOldData };
