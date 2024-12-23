const Users = require('../modals/Users');
class AuthController {
    auth(req, res) {
        res.render('auth', { layout: 'authLayout' }); // Sử dụng authLayout
    }
    login(req, res) {
        const { userName, userPassword } = req.body;
        Users.findOne({
            userPassword: userPassword,
            userName: userName
        })
        .then(user => {
            if (!user) {
                //nếu không tìm thấy user thì trả về lỗi
                return res.render('auth', {
                    layout: 'authLayout',
                    error: 'Tài khoản hoặc mật khẩu không chính xác'
                });
            }
            //nếu tìm thấy user thì lưu thông tin user vào session và chuyển hướng về trang chủ
            if (user.status === 'inactive') {
                res.render('options', {
                    layout: false,
                    message: 'Tài khoản của bạn đã bị khóa',
                })
            } else {
                req.session.user = user;
                res.redirect('/?message=login-success');
            }
        });
    }
    
    //GET: /auth/logout
    logout(req, res) {
        req.session.destroy(() => {
            res.redirect('/');
        });
    }
    register(req, res) {
        const { userName, userPassword, userEmail } = req.body;
        Users.findOne({
            userEmail: userEmail
        })
        .then(user => {
            if (user) {
                //nếu tìm thấy user thì trả về lỗi
                return res.redirect('/auth?message=register-error');
            }
            //nếu không tìm thấy user thì tạo mới user và chuyển hướng về trang chủ
            Users.create({
                userName: userName,
                userPassword: userPassword,
                userEmail: userEmail,
                fileCount: 0,
                videoCount: 0,
                status: 'active'
            })
            .then(() => {
                res.redirect('/auth?message=register-success');
            });
        });
    }    
}

module.exports = new AuthController();
