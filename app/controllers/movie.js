var Movie=require('../models/movie');
var Comment=require('../models/comment');
var Category=require('../models/category');
var underscore=require('underscore');
var fs=require('fs');
var path=require('path');
//admin page
exports.new=function(req,res){
    Category.find({},function(err,categories){
        res.render('admin',{
            title: 'imooc 后台录入页',
            movie: {},
            categories: categories
        })
    });

};

//admin post movie
exports.save=function(req,res){
    var id=req.body.movie._id;
    var movieObj=req.body.movie;
    var _movie=null;
    var categoryId=movieObj.category;
    var categoryName=movieObj.categoryName;
    if(req.poster){
        movieObj.poster=req.poster;
    }
    if(id){
        Movie.findById(id,function(err,movie){
            if(err){
                console.log('Error: '+err);
            }
            if(categoryId){
                if(movie.category==categoryId){
                    _movie=underscore.extend(movie,movieObj);
                    _movie.save(function(err,movie){
                        if(err){
                            console.log('Error: '+err);
                        }
                        res.redirect('/movie/'+_movie._id);
                    });
                }else{
                    Category.findOne({_id: movie.category},function(err,cat){
                        var index=cat.movies.indexOf(id);
                        cat.movies.splice(index,1);
                        cat.save(function(err,category){
                            _movie=underscore.extend(movie,movieObj);
                            _movie.save(function(err,movie){
                                if(err){
                                    console.log('Error: '+err);
                                }
                                Category.findOne({_id:movie.category},function(err,cat){
                                    if(cat.movies.indexOf(id)==-1) cat.movies.push(id);
                                    cat.save(function(err,category){
                                        res.redirect('/movie/'+_movie._id);
                                    });
                                });
                            });
                        });
                    });
                }
            }else if(categoryName){
                var _cat=new Category({name: categoryName,movies:[id]});
                Category.findOne({_id: movie.category},function(err,category){
                    var index=category.movies.indexOf(id);
                    category.movies.splice(index,1);
                    category.save(function(err){
                        _cat.save(function(err,cat){
                            _movie=underscore.extend(movie,movieObj);
                            _movie.save(function(err,movie) {
                                if (err) {
                                    console.log('Error: ' + err);
                                }
                                res.redirect('/movie/'+_movie._id);
                            });
                        });
                    });
                });
            }
        });
    }else{
        _movie=new Movie(movieObj);
        _movie.save(function(err,movie){
            if(err){
                console.log('Error: '+err);
            }
            if(categoryId){
                Category.findById(categoryId,function(err,category){
                    category.movies.push(movie._id);
                    category.save(function(err,category){
                        res.redirect('/movie/'+movie._id);
                    });
                });
            }else if(categoryName){
                var category=new Category({name:categoryName,movies:[movie._id]});
                category.save(function(err,category){
                    movie.category=category._id;
                    movie.save(function(err,m){
                        console.log(m);
                        res.redirect('/movie/'+m._id);
                    });
                });
            }
        });
    }
};

//save poster
exports.savePoster=function(req,res,next){
    var posterData=req.files.uploadPoster;
    var filePath=posterData.path;
    var originalFilename=posterData.originalFilename;
    if(originalFilename){
        fs.readFile(filePath,function(err,data){
            var timestamp=Date.now();
            var type=posterData.type.split('/')[1];
            var poster=timestamp+'.'+type;
            var newPath=path.join(__dirname,'../../','/public/upload/'+poster);
            fs.writeFile(newPath,data,function(err){
                req.poster=poster;
                next();
            });
        });
    }else{
        next();
    }
};


//detail page
exports.detail=function(req,res){
    var id=req.params.id;
    Movie.findById(id,function(err,movie){
        if(err){
            console.log('Error: '+err);
        }
        Movie.update({_id:id},{$inc:{pv:1}},function(err){
            if(err){
                console.log(err);
            }
        });
        Comment.find({'movie':id})
            .populate('from','name _id')
            .populate('reply.from reply.to','name content')
            .exec(function(err,comments){
                res.render('detail',{
                    title: 'imooc '+movie.title,
                    movie: movie,
                    comments: comments
                })
            })

    });
};

//list page
exports.list=function(req,res){
    Movie.find({})
        .populate('category','name')
        .exec(function(err,movies){
            if(err){
                console.log('Error: '+err);
            }
            res.render('list',{
                title: 'imooc 列表页',
                movies:movies
            });
        });

};

//admin movie update
exports.update=function(req,res){
    var id=req.params.id;
    if(id){
        Movie.findById(id,function(err,movie){
            Category.find({},function(err,categories){
                res.render('admin',{
                    title:'imooc 后台更新页',
                    movie: movie,
                    categories: categories
                })
            });

        })
    }
};

//list delete movie
exports.del=function(req,res){
    var id=req.query.id;
    if(id){
        Movie.findOne({_id:id},function(err,movie){
            Category.findOne({_id: movie.category},function(err,category){
                var index=category.movies.indexOf(id);
                category.movies.splice(index,1);
                category.save(function(err,cat){
                    Movie.remove({_id:id},function(err,result){
                        if(err){
                            console.log('Error: '+err);
                        }
                        res.json({
                            success: 1
                        });
                    });
                });
            });
        });

    }
};
