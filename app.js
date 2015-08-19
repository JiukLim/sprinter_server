var express = require('express');
var http = require('http');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes');

var users = require('./routes/user');
var contents = require('./routes/content');
var markets = require('./routes/market');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(express.bodyParser());

app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);

//app.get('/', function(req, res){
//    db.collection('users').findOne({}, function(err, doc){
//        if(err) throw err;
//        res.send(doc);
//    });
//});

/*작업 부분*/
// api 파라미터 설정
// test
// app.get('/', routes.index);
app.get('/users', users.list);
app.get('/users/hello', users.hello);

// user 관리 부분
app.post('/users/join/:userId', users.join);
app.get('/users/duplicate/:userId', users.duplicate);
app.post('/users/login/:userId', users.login);
app.get('/users/logout/:userId', users.logout);

// content 관리 부분
app.post('/users/content/upload/:userId', contents.upload);
app.get('/users/content/download/:userId', contents.download);
app.get('/users/content/like/count/:userId/:contentId', contents.like_count);
app.post('/users/content/like/update/:userId/:contentId', contents.like_update);
app.get('/users/content/like/check/:userId/:contentId', contents.like_check);

// market 관리 부분
app.get('/users/market/contents/:category/:userId', markets.contents_list_bycategory);
app.get('/users/market/find/:findname/:userId', markets.contents_list_byfind);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
