var Index=require('../app/controllers/index');
var User=require('../app/controllers/user');
var Movie=require('../app/controllers/movie');
var Comment=require('../app/controllers/comment');
var Category=require('../app/controllers/category');
module.exports=function(app){
    //Index
    app.get('/',Index.index);

    //Movie
    app.get('/movie/:id',Movie.detail);
    app.get('/admin/movie/new',User.signinRequired,User.adminRequired,Movie.new);
    app.post('/admin/movie/new',User.signinRequired,User.adminRequired,Movie.savePoster,Movie.save);
    app.get('/admin/movie/list',User.signinRequired,User.adminRequired,Movie.list);
    app.get('/admin/movie/update/:id',Movie.update);
    app.delete('/admin/movie/list',User.signinRequired,User.adminRequired,Movie.del);

    //User
    app.post('/user/signup',User.signup);
    app.post('/user/signin',User.signin);
    app.get('/user/signin',User.showSignIn);
    app.get('/user/signup',User.showSignUp);
    app.get('/user/logout',User.logout);
    app.get('/admin/user/list',User.signinRequired,User.adminRequired,User.userlist);
    app.get('/admin/user/update/:id',User.signinRequired,User.adminRequired,User.updateUser);
    app.post('/admin/user/update',User.signinRequired,User.adminRequired,User.changePass);
    app.delete('/admin/user/update',User.signinRequired,User.adminRequired,User.del);

    //Comment
    app.post('/user/comment',User.signinRequired,Comment.save);

    //Category
    app.get('/admin/category/new',User.signinRequired,User.adminRequired,Category.new);
    app.post('/admin/category',User.signinRequired,User.adminRequired,Category.save);
    app.get('/admin/category/list',User.signinRequired,User.adminRequired,Category.list);

    //result
    app.get('/results',Index.search);
};

