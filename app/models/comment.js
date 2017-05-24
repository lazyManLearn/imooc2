var CommentSchema=require('../schemas/comment');
var mongoose=require('mongoose');
var Comment=mongoose.model('Comment',CommentSchema);
module.exports=Comment;
