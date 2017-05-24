var mongoose=require('mongoose');
var bcryptjs=require('bcryptjs');
var SALT_WORK_FACTOR=10;
var UserSchema=new mongoose.Schema({
    name: {
        type: String,
        unique: true
    },
    password: String,
    role:{
        type: Number,
        default: 0
    },
    meta: {
        createAt: {
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    }
});
UserSchema.pre('save',function(next){
    var user=this;
    if(this.isNew){
        this.meta.createAt=this.meta.updateAt=Date.now();
    }else{
        this.meta.updateAt=Date.now();
    }
    bcryptjs.genSalt(SALT_WORK_FACTOR,function(err,salt){
        if(err) return next(err);
        bcryptjs.hash(user.password,salt,function(err,hash){
            if(err) return next(err);
            user.password=hash;
            next();
        });
    });
});
UserSchema.statics={
    fetch: function(cb){
        return this.find({}).sort('meta.updateAt').exec(cb);
    },
    findById:function(id,cb){
        return this.findOne({_id:id}).exec(cb);
    }
};
UserSchema.methods={
    comparePassword: function(password,cb){
        bcryptjs.compare(password,this.password,function(err,isMatch){
            if(err){
                return cb(err);
            }
            cb(null,isMatch);
        });
    }
};
module.exports=UserSchema;

