const Admins = require('../../modals/Admins');
const Users = require('../../modals/Users');
const Posts = require('../../modals/Posts');
const {mongooseToObject} = require('../../../until/setUpDatabase');
const {multipleMongooseToObject} = require('../../../until/setUpDatabase');
const session = require('express-session');

class AdminController {
    //GET /admin/login
    login(req, res, next) {
        res.render('admin/login', {layout: 'authLayout'});
    }
    //GET /admin/logout
    logout(req, res, next) {
        req.session.destroy(() => {
            res.redirect('/admin/login');
    })
    }
    //POST /admin/loginStored
    loginStored(req, res, next) {
        //nhận dữ liệu từ form
        const dataAdmin = req.body;
        Admins.findOne({
            name: dataAdmin.adminName, //name admin trong database
            password: dataAdmin.adminPassword //password admin trong database
        })
            .then(admin => {
                if (admin) {
                    //lưu thông tin admin vào session
                    req.session.admin = admin;
                    //chuyển hướng đến trang admin home
                    res.redirect('/admin/home');
                } else {
                    //chuyển hướng đến trang login nếu không tìm thấy admin
                    res.redirect('/admin/login');
                }
            })
            .catch(next);
    }

    //GET /admin/home
    home(req, res, next) {
        const currentPage = parseInt(req.query.page) || 1;  // Sử dụng một phân trang chung
        const limit = 10; // Giới hạn bài đăng và người dùng mỗi trang
        const skip = (currentPage - 1) * limit;

        Users.find({ role: 'user' }).lean()
            .then(users => {
                const userIds = users.map(user => user._id);

                return Promise.all([
                    Posts.find({ author: { $in: userIds } }).skip(skip).limit(limit).lean().populate('author'),
                    Users.countDocuments({ role: 'user' }),
                    Posts.countDocuments({ author: { $in: userIds } })
                        
                ])
                .then(([posts, userCount, postCount]) => {
                    const userTotalPages = Math.ceil(userCount / limit);
                    const postTotalPages = Math.ceil(postCount / limit);
                    const totalPages = Math.max(userTotalPages, postTotalPages);  // Tổng số trang

                    const noUsers = userCount === 0;
                    const noPosts = postCount === 0;

                    const pagination = {
                        currentPage,
                        totalPages,
                        prevPage: currentPage > 1 ? currentPage - 1 : null,
                        nextPage: currentPage < totalPages ? currentPage + 1 : null
                    };
                    res.render('admin/home', {
                        layout: 'adminLayout',
                        users,
                        posts,
                        pagination,
                        noUsers,
                        noPosts,
                    });
                });
            })
            .catch(next);
    }
    
    
    //GET /admin/post
    post(req, res, next) {
        res.render('admin/adminPost', {layout: 'adminLayout'});
    }

    //GET /admin/postManage
    postManage(req, res, next) {
        Posts.find({})
            .populate('author')
            .then(posts => {
                posts = posts.filter(post => post.author.role === 'user');
                res.render('admin/managePost', {
                    layout: 'adminLayout', 
                    posts: multipleMongooseToObject(posts)
                });
            })
            .catch(next);
    }
    //Get /admin/postManage/:slug
    postSearch(req, res, next) {
        const searchData = req.params.slug;
        console.log(searchData);
        Posts.find({$text: {$search: searchData}})
            .populate('author')
            .then(posts => {
                posts = posts.filter(post => post.author.role === 'user');
                res.render('admin/managePost', {
                    layout: 'adminLayout',
                    posts: multipleMongooseToObject(posts)
                });
            })
            .catch(() => {
                res.console.warn('Not found');
                
            });
    }
    //DELETE /admin/postManage/:id
    async postDelete(req, res, next) {
        try {
            const post = await Posts.findById(req.params.id);
            if (!post) {
                return res.status(404).json({ error: 'Post not found' });
            }
            const author = await Users.findById(post.author);

            //xoá bài đăng và giảm bài đếm
            await post.deleteOne({_id: req.params.id});
            await author.updateOne({ $inc: { countPost: -1 } });
            res.redirect('back');
        } catch (err) {
            next(err);
        }
    }
        // //GET /admin/userManage
        // userManage(req, res, next) {
        //     const page = parseInt(req.query.page) || 1;
        //     const limit = 20;
        //     const skip = (page - 1) * limit;
    
        //     Users.countDocuments({})
        //         .then(count => {
        //             const totalPages = Math.ceil(count / limit);
        //             console.log(totalPages);
        //             Users.find({role: 'user'})
        //                 .skip(skip)
        //                 .limit(limit)
        //                 .then(users => {
        //                     res.render('admin/manageUsers', {
        //                         layout: 'adminLayout',
        //                         users: multipleMongooseToObject(users),
        //                         currentPage: page,
        //                         totalPages: totalPages
        //                     });
        //                 })
        //                 .catch(next);
        //         })
        //         .catch(next);
        // }
    userManage(req, res, next) {
        let page = parseInt(req.query.page) || 1; // Lấy trang hiện tại từ query string
        const limit = parseInt(req.query.limit) || 10; // Giới hạn số lượng người dùng mỗi trang, mặc định là 10
        
        // Ensure the page is always >= 1
        if (page < 1) page = 1;
        
        const skip = (page - 1) * limit; // Số lượng người dùng cần bỏ qua
        const searchQuery = req.query.search || ''; // Lấy từ khóa tìm kiếm nếu có
        
        // Tạo filter tìm kiếm với điều kiện là tìm theo ID hoặc userName
        const searchFilter = searchQuery ? {
            $or: [
                { _id: { $regex: searchQuery, $options: 'i' } }, // Tìm kiếm theo ID
                { userName: { $regex: searchQuery, $options: 'i' } } // Tìm kiếm theo userName
            ]
        } : {};
    
        // Đếm số lượng người dùng thỏa mãn điều kiện tìm kiếm và chỉ lấy người dùng có role là 'user'
        Users.countDocuments({ role: 'user', ...searchFilter })
            .then(count => {
                const totalPages = Math.ceil(count / limit); // Tính tổng số trang
    
                // Ensure page is within valid range
                if (page > totalPages && totalPages > 0) {
                    return res.redirect(`/admin/userManage?page=${totalPages}&search=${searchQuery}&limit=${limit}`);
                }
    
                // Tính toán trang trước và trang sau
                const prevPage = page > 1 ? page - 1 : null; // Nếu có trang trước thì giảm trang hiện tại đi 1
                const nextPage = page < totalPages ? page + 1 : null; // Nếu có trang sau thì tăng trang hiện tại lên 1
    
                // Lấy danh sách người dùng theo filter và phân trang
                Users.find({ role: 'user', ...searchFilter })
                    .skip(skip) // Số người dùng cần bỏ qua
                    .limit(limit) // Giới hạn số lượng người dùng lấy ra
                    .then(users => {
                        res.render('admin/manageUsers', {
                            layout: 'adminLayout',
                            users: multipleMongooseToObject(users),
                            currentPage: page, // Trang hiện tại
                            totalPages: totalPages, // Tổng số trang
                            prevPage: prevPage, // Trang trước
                            nextPage: nextPage, // Trang sau
                            searchQuery: searchQuery, // Từ khóa tìm kiếm
                            limit: limit // Giới hạn số lượng người dùng mỗi trang
                        });
                    })
                    .catch(next);
            })
            .catch(next);
    }
       
    
    //GET /admin/userManage/:slug
    userSearch(req, res, next) {
        const searchData = req.params.slug;
        console.log(searchData);
        Users.find({
            $text: {$search: searchData},
            role: 'user'
        })
            .then(users => {
                res.render('admin/manageUsers', {
                    layout: 'adminLayout',
                    users: multipleMongooseToObject(users)
                });
            })
            .catch(() => {
                res.console.warn('Not found');
                
            });
    }
    //PUT /admin/userManage/:slug
    userOption(req, res, next) {
        const dataUser = req.body;
        // res.json(dataUser);
        Users.updateOne({_id: req.params.slug}, {
            status: dataUser.status
        })
            .then(() => {
                res.redirect('back');
            })
            .catch(next);
    }
    //GET /admin/stored
    stored(req, res, next) {
        const adminName = req.session.admin.name;
        Posts.find({author: adminName})
            .then(posts => {
                res.json(posts);
            })
    }

    //GET /admin/postAdmin
    postAdmin(req, res, next) {
        Posts.find({author: req.session.user._id})
            .then(posts => {
                res.render('admin/postAdmin', {
                    layout: 'adminLayout',
                    posts: multipleMongooseToObject(posts)
                });
            })
            .catch(next);
    }
    //GET /admin/postAdmin/:slug
    postAdminSearch(req, res, next) {
        const searchData = req.params.slug;
        console.log(searchData);
        Posts.find({
            $and: [
                {$text: {$search: searchData}},
                {author: req.session.user._id},
            ]
        })
            .then(posts => {
                res.render('admin/postAdmin', {
                    layout: 'adminLayout',
                    posts: multipleMongooseToObject(posts)
                });
                // res.json(posts);
            })
            .catch(() => {
                res.console.warn('Not found');
                
            });
    }
}

module.exports = new AdminController;