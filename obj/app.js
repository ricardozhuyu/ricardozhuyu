var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var multer  = require('multer');//引入包  类
let objMulter = multer({ dest: './public/upload' }); 
var indexRouter = require('./routes/index');

let cors = require('cors');



//设置存储位置
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if(req.url.indexOf('user') !== -1 || req.url.indexOf('reg') !== -1){
      cb(null, path.join(__dirname,'public','upload','user'))
    }else if(req.url.includes('banner')){
      cb(null, path.join(__dirname,'public','upload','banner'))
    }else{
      cb(null, path.join(__dirname,'public','upload','news'))
    }
  }
})

let upload  = multer({ storage});
//创建web服务器
var app = express();


//安装中间件

app.use(upload.any()); 

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));


app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//多资源托管
app.use(express.static(path.join(__dirname, 'public','template')));
app.use('/supervisor',express.static(path.join(__dirname, 'public','admin')));
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors({
  //允许所有前端域名
  "origin": ["http://localhost:8001","http://localhost:5000","http://127.0.0.1:8848"],  
  "credentials":true,//允许携带凭证
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE", //被允许的提交方式
  "allowedHeaders":['Content-Type','Authorization','token']//被允许的post方式的请求头
}));

//响应
app.all('/api/*', require('./utils/params'));
app.use('/api/news',require('./routes/api/news'));
app.use('/api/reg',require('./routes/api/reg'));
app.use('/api/login',require('./routes/api/login'));
app.use('/api/user',require('./routes/api/user'));
app.use('/api/logout',require('./routes/api/logout'));
// app.use('/api/send-code',require('./routes/api/send-code'));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// 处理错误
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);

  if(req.url.includes('/api')){// 用户端接口不存在 返回  {err:1,msg:'不存在的接口'}
    res.send({err:1,msg:'不存在的接口'})
  }else if(req.url.includes('/admin')){// 管理端接口不存在 返回  res.render('error.ejs')
    res.render('error');
  }else{ // 资源托管没有对应的页面 返回 404.html
    // res.sendFile(path.join(__dirname,'public','template','index.html'))
  }

  
});

module.exports = app;
