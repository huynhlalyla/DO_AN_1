const Post = require('../modals/Posts');
const {multipleMongooseToObject} = require('../../until/setUpDatabase');
const {mongooseToObject} = require('../../until/setUpDatabase');
const { application } = require('express');
class DocumentController {

  async viewAll(req, res) {
    try {
      const posts = await Post.find({}).populate('author');
      res.render('document/view-all', {
        posts: multipleMongooseToObject(posts),
        title: "Tất cả tài liệu"
      });
    } catch (error) {
      
    }
  }

  //GET /document/:type
  async viewOnly(req, res) {
    try {
      const type = req.params.type;
      const types = {
        pdf: {
          title: 'Tài liệu PDF',
          type: 'application/pdf'
        },
        image: {
          title: 'Tài liệu ảnh Ảnh',
          type: 'image/.*'
        },
        video: {
          title: 'Tài liệu Video',
          type: 'video/.*'
        },
        application: {
          title: 'Tài liệu khác',
          type: 'application/.*'
        }
      }

      //phân ttrang, mỗi trang 9 bài viết
      const limit = 9;
      const page = req.query.page || 1;
      const skip = (page - 1) * limit;

      Promise.all([
        Post.find({ type: { $regex: types[type].type, $options: 'i' } })
          .populate('author')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
        Post.countDocuments({ type: { $regex: types[type].type, $options: 'i' } })
      ])
      .then(([posts, totalPosts]) => {
        const totalPages = Math.ceil(totalPosts / limit);
        console.log(totalPages);
        res.render('document/view-all', {
          posts: multipleMongooseToObject(posts),
          title: types[type].title,
          totalPages
        });
      })
    } catch (error) {
      res.status(500).json({message: error.message});
    }
  }

  document(req, res) {
    Post.findOne({_id: req.params.id})
    .populate('author')
      .then(post => {
        res.render('document/view-only', {post: mongooseToObject(post)});
      })
  }
}

module.exports = new DocumentController();