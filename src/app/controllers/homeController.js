const Posts = require('../modals/Posts');
const Users = require('../modals/Users');
const {multipleMongooseToObject} = require('../../until/setUpDatabase');
class HomeController {
    home(req, res) {
        const limit = 3;

        const fetchPostsByType = (type) => {
            return Posts.find({ type: { $regex: type, $options: 'i' } })
                .populate('author')
                .sort({ createdAt: -1 })
                .limit(limit)
                .then(posts => multipleMongooseToObject(posts));
        };

        Promise.all([
            fetchPostsByType('application/pdf'),
            fetchPostsByType('image/.*'),
            fetchPostsByType('video/.*'),
            fetchPostsByType('application/.*'),
            Posts.find({}).sort({ createdAt: -1 }).limit(limit).populate('author')
        ]).then(([pdfPosts, imagePosts, videoPosts, applicationPosts, latestPosts]) => {
            res.render('home', {
                pdfPosts,
                imagePosts,
                videoPosts,
                applicationPosts,
                latestPosts: multipleMongooseToObject(latestPosts)
            });
            // res.json({pdfPosts, imagePosts, videoPosts, applicationPosts, latestPosts: multipleMongooseToObject(latestPosts)});
        }).catch(err => {
            res.status(500).send(err);
        });
    }
    async search(req, res) {
        const searchData = req.query.query;
        const posts = await Posts.find({$text: {$search: searchData}})
        const users = await Users.find({$text: {$search: searchData}})
        // res.json({posts, users});
        res.render('search', {
            posts: multipleMongooseToObject(posts),
            users: multipleMongooseToObject(users)
        });
        
    }
    posts(req, res) {
        Posts.find({author: req.session.user._id})
            .then(posts => {
                res.render('userManagePost', {
                    posts: multipleMongooseToObject(posts)
                })
            })
    }
}
module.exports = new HomeController;