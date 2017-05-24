var User=require('../models/user');
//signup
exports.signup=function(req,res){
    var _user=req.body.user;
    var userObj=new User(_user);
    User.findOne({name:_user.name},function(err,user){
        if(err){
            console.log(err);
        }
        if(user){
            return res.redirect('/signin');
        }else{
            userObj.save(function(err,user){
                if(err){
                    console.log(err);
                }
                res.redirect('/');
            })
        }
    });

};

//signin
exports.signin=function(req,res){
    var _user=req.body.user;
    var name=_user.name;
    var password=_user.password;
    User.findOne({name:name},function(err,user){
        if(err){
            console.log(err);
        }
        if(!user){
            return res.redirect('/signup');
        }
        user.comparePassword(password,function(err,isMatch){
            if(err){
                console.log(err);
            }
            if(isMatch){
                req.session.user=user;
                res.redirect('/');
            }else{
                res.redirect('/signin');
                console.log('Password is not matched');
            }
        });
    });
};

//admin update user
exports.updateUser=function(req,res){
    var id=req.params.id;
    if(id){
        User.findById(id,function(err,user){
            res.render('userupdate',{
                title:'imooc 更改用户',
                user: user
            })
        });
    }
};
//change pass
exports.changePass=function(req,res){
    var _user=req.body.user;
    var id=_user._id;
    if(id){
        User.findById(id,function(err,user){
            if(err) console.log(err);
            if(_user.name==user.name){
                user.password=_user.password;
                user.save(function(err,user){
                    if(err) console.log(err);
                    res.redirect('/admin/user/list');
                });
            }else{
                res.redirect('/admin/user/update/'+id);
            }
        });
    }
};

//delete user
exports.del=function(req,res){
    var id=req.query.id;
    var _user=req.session.user;
    if(id){
        User.findById(id,function(err,user){
            if(err) console.log(err);
            if(user.name==_user.name){
                res.json({
                    success:0
                });
            }else{
                User.remove({_id:id},function(err,user){
                    if(err){
                        console.log('Error: '+err);
                    }
                    res.json({
                        success: 1
                    });
                });
            }
        });

    }
};

//showsignin
exports.showSignIn=function(req,res){
    res.render('signin',{
        title: '登录'
    })
};
//showsignup
exports.showSignUp=function(req,res){
    res.render('signup',{
        title: '注册'
    })
};

//logout
exports.logout=function(req,res){
    delete req.session.user;
    res.redirect('/');
};

//userlist
exports.userlist=function(req,res){
    var user=req.session.user;
    User.fetch(function(err,users){
        if(err){
            console.log(err);
        }
        res.render('userlist',{
            title: 'imooc 用户列表',
            users: users
        });
    });

};

//midware for user
exports.signinRequired=function(req,res,next){
    var user=req.session.user;
    if(!user){
        res.redirect('/user/signin');
    }
    next();
};
exports.adminRequired=function(req,res,next){
    var user=req.session.user;
    if(user.role<=10){
        return res.redirect('/');
    }
    next();
};
