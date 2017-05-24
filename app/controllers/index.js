var Category=require('../models/category');
var Movie=require('../models/movie');
//index page
exports.index=function(req,res){
    Category.find({})
        .populate({path: 'movies',options: {limit: 5}})
        .exec(function(err,categories){
            if(err){
                console.log(err);
            }
            console.log(categories);
            res.render('index',{
                title: 'imooc 首页',
                categories: categories
            })
        });
};
//search page
exports.search=function(req,res){
    var catId=req.query.cat;
    var q=req.query.q;
    var page=isNaN(parseInt(req.query.p))?0: parseInt(req.query.p);
    var perPage=1;
    var showPageNum=3;
    var index=page*perPage;
    if(catId){
        Category.find({_id: catId})
            .populate({
                path: 'movies',
                select: 'title poster'
            })
            .exec(function(err,categories){
                if(err) console.log(err);
                var category=categories[0]||{};
                var allMovies=category.movies||[];
                var total=allMovies.length;
                var totalPage=Math.ceil(total/perPage);
                if(index>=total){
                    index=total-1;
                    page=totalPage-1;
                }
                var movies=total>0?allMovies.slice(index,index+perPage):[];
                var query='cat='+catId;

                var next=Math.min(totalPage,(page+1));
                var prev=Math.max(0,(page-1));
                res.render('result',{
                    title: 'imooc 结果列表页',
                    keywords: category.name,
                    currentPage: page,
                    next: next,
                    prev: prev,
                    totalPage: totalPage,
                    showPageNum: showPageNum,
                    query: query,
                    movies: movies
                })
            });
    }else{
        Movie.find({title:new RegExp(q)})
            .exec(function(err,films){
                if(err) console.log(err);
                var allMovies=films||[];
                var total=allMovies.length;
                var totalPage=Math.ceil(total/perPage);
                if(index>=total){
                    index=total-1;
                    page=totalPage-1;
                }
                var movies=total>0?allMovies.slice(index,index+perPage):[];
                var query='q='+catId;

                var next=Math.min(totalPage,(page+1));
                var prev=Math.max(0,(page-1));
                res.render('result',{
                    title: 'imooc 结果列表页',
                    keywords: q,
                    currentPage: page,
                    next: next,
                    prev: prev,
                    totalPage: totalPage,
                    showPageNum: showPageNum,
                    query: query,
                    movies: movies
                })
            });
    }
};
