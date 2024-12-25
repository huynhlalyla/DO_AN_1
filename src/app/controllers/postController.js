const Post = require('../modals/Posts');
const User = require('../modals/Users');
class PostController {
    post(req, res) {
        res.render('post');
    }

    async delete(req, res) {
        try {
            //tìm người dùng
            const user = await User.findOne({ _id: req.session.user._id });
            //xáo bài post
            await Post.deleteOne({ _id: req.params.id });
            //giảm số bài post của người dùng
            await User.updateOne({ _id: user._id }, { $inc: { countPost: -1 } });
            res.redirect('/posts');   
        } catch (error) {
            res.json({ error });
        }
    }

    //PUT: /post/edit/:id
    async edit(req, res) {
        try {
            const postId = req.params.id;
            const dataUpdate = req.body;
            const post = await Post.findOne({ _id: postId });
            //ghi đè lại các trường của post
            post.postTitle = dataUpdate.postTitle || post.postTitle;
            post.postContent = dataUpdate.postContent || post.postContent;
            post.industryName = dataUpdate.industryName || post.industryName;
            if(req.files){
                if(req.files.thumnail && req.files.thumnail[0]){
                    const encodedThumnailName = encodeURIComponent(req.files.thumnail[0].filename);
                    post.thumnail = `/uploads/${encodedThumnailName}`;
                }
                if(req.files.file && req.files.file[0]){
                    const encodedFileName = encodeURIComponent(req.files.file[0].filename);
                    post.file = `/uploads/${encodedFileName}`;
                }
            }
            // Lấy ra loại file cụ thể
            if (req.files.file && req.files.file[0]) {
                const typefile = req.files.file[0].mimetype;
                post.type = typefile;
            }
            await post.save();
            res.redirect('/posts');
        } catch (error) {
            res.json({ error });
        }
    }

    //mã hóa
    async upload(req, res, next) {
        const data = req.body;
        let fileUrl = '';
        let thumnailUrl = '/Image/no-image.jpg';
        // res.json({ data, files: req.files })
        // next();
        if (req.files) {
            if (req.files.file && req.files.file[0]) {
                const encodedFileName = encodeURIComponent(req.files.file[0].filename);
                fileUrl = `/uploads/${encodedFileName}`;
            }
            if (req.files.thumnail && req.files.thumnail[0]) {
                const encodedThumnailName = encodeURIComponent(req.files.thumnail[0].filename);
                thumnailUrl = `/uploads/${encodedThumnailName}`;
            }
        }
        //lấy ra loại file cục thể
        const typefile = req.files.file[0].mimetype;
        
        //khởi tạo một post mới
        const post = new Post({
            postTitle: data.postTitle,
            postContent: data.postContent,
            industryName: data.industryName,
            thumnail: thumnailUrl,
            file: fileUrl,
            type: typefile,
            author: req.session.user._id,
        });
        User.updateOne({ _id: req.session.user._id }, { $inc: { countPost: 1 } })
        post.save()
            .then(() => {
                return User.updateOne({ _id: req.session.user._id }, { $inc: { countPost: 1 } });
            })
            .then(() => {
                res.redirect('/');
            })
            .catch(err => {
                res.json({ error: err });
            });
    }
}

module.exports = new PostController;