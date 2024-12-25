const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
//tích hợp handlebars
const { engine } = require('express-handlebars');
//
const router = require('./router/main');
const db = require('./config/dbconfig');
const methodOverride = require('method-override');
const session = require('express-session');
const localAuthor = require('./config/author');
const Handlebars = require('handlebars');
const moment = require('moment');

// Registering custom helpers
Handlebars.registerHelper({
    eq: (a, b) => a === b,
    gt: (a, b) => a > b,
    lt: (a, b) => a < b,
    range: (start, end) => {
        const arr = [];
        for (let i = start; i <= end; i++) arr.push(i);
        return arr;
    },
    subtract: (a, b) => a - b,
    add: (a, b) => a + b,
    max: (a, b) => Math.max(a, b),
    min: (a, b) => Math.min(a, b),
    neq: (a, b) => a !== b,
    pageRange: (currentPage, totalPages) => {
        const range = [1];

        if (currentPage > 3) range.push('...');
        for (let i = Math.max(2, currentPage - 2); i <= Math.min(totalPages - 1, currentPage + 2); i++) {
            range.push(i);
        }
        if (currentPage < totalPages - 2) range.push('...');
        if (totalPages > 1) range.push(totalPages);

        return range;
    },
});

// body parser
app.use(express.urlencoded({
    extended: true
}));

//sử dụng method ảo
app.use(methodOverride('_method'));
// Cấu hình session
app.use(session({
    secret: 'your_secret_key', // Thay thế bằng khóa bí mật của bạn
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Đặt thành true nếu bạn sử dụng HTTPS
}));


// tích hợp template engine handlebars
app.engine('.hbs', engine({
    extname: '.hbs',
    helpers: {
        eq: function (a, b) {
            return a === b;
        },
        range: function (m,n) {
            let arr = [];
            for (let i = m; i <= n; i++) {
                arr.push(i);
            }
            return arr;
        },
        sameValue(value1, value2) {
            return value1 === value2;
        },
        length: function (value) {
            return value.length;
        },
        contain: function (value1, value2) {
            return value1.includes(value2);
        },
        time: (timestamp) => {
            moment.locale('vi');
            return moment(timestamp).fromNow();
        },
        sum: (a, b) => a + b,
    }
}));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'Resources/views'));

//public cac file css
app.use(express.static(path.join(__dirname, 'public')));

//gán user vào locals
app.use(localAuthor);

//dung cac router
router(app);

//connect db
db.connect();

app.listen(port, () => {
    console.log(`http://localhost:3000`);
})