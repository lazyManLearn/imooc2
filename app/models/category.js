var CategorySchema=require('../schemas/Category');
var mongoose=require('mongoose');
var Category=mongoose.model('Category',CategorySchema);
module.exports=Category;
