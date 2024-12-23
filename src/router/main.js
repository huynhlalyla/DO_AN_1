const authRouter = require('./auth');
const homeRouter = require('./home');
const postRouter = require('./post');
const documentRouter = require('./document');

// admin
const adminRouter = require('./admin/admin');
function Router(app) {
    // user
    app.use('/auth', authRouter);
    app.use('/post', postRouter);
    app.use('/document', documentRouter);
    // admin
    app.use('/admin', adminRouter);
    app.use('/', homeRouter);


}
module.exports = Router;