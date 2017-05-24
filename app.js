//入口文件
var express = require('express');
var mongoose=require('mongoose');
var port = process.env.PORT || 3000;
var app=express();
var bodyParser=require('body-parser');
var path=require('path');
var serveStatic=require('serve-static');
var cookieParser=require('cookie-parser');
var session=require('express-session');
var mongoStore=require('connect-mongo')(session);
var logger=require('morgan');
var multiparty=require('connect-multiparty');
var fs=require('fs');
var dbUrl='mongodb://localhost/imooc';
app.locals.moment=require('moment');
app.set('views','./app/views/pages');
app.set('view engine','jade');//注册模板引擎。

mongoose.connect(dbUrl);
//models loading
var models_path=__dirname+'/app/models';
var walk=function(path){
    fs.readdirSync(path)
        .forEach(function(file){
            var newPath=path+'/'+file;
            var stat=fs.statSync(newPath);
            if(stat.isFile()){
                if(/(.*)\.(js|coffee)/.test(file)){
                    require(newPath);
                }
            }else if(stat.isDirectory()){
                walk(newPath);
            }
        });
};
walk(models_path);

app.use(serveStatic(path.join(__dirname,'public')));
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser());
app.use(multiparty());
app.use(session({
    secret: 'imooc',
    store: new mongoStore({
        url: dbUrl,
        collection: 'sessions'
    }),
    resave: false,
    saveUninitialized: true
}));
app.use(function(req,res,next){
    var _user=req.session.user;
    if(_user) res.locals.user=_user;
    next();
});
if('development'===app.get('env')){
    app.set('showStackError',true);
    app.use(logger(':method :url :status'));
    app.locals.pretty=true;
    mongoose.set('debug',true);
}
require('./config/routes')(app);
app.listen(port,function(){
    console.log('imooc started on port '+port);
});


