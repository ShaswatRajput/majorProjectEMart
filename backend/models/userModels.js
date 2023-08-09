const mongoose = require("mongoose");
const validator = require("validator");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please enter your Name"],
        maxLength:[30,"Name can't be longer than 30 characters"],
        minLength:[3,"Name should be atleast 4 characters"],
    },
    email:{
        type:String,
        required:[true,"Please enter your e-mail"],
        unique:true,
        validate:[validator.isEmail,"Please enter a valid e-mail"],
    },
    password:{
        type:String,
        required:[true,"Please enter your password"],
        minLength:[8,"Password should be atleast 8 characters"],
        select:false,
    },
    avatar:{
        public_id:{
            type:String,
            required:true,
        },
        url:{
            type:String,
            required:true,
        }
    },
    role:{
        type:String,
        default:"user",
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date,
});
//password hashing
userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        next();
    }
    this.password = await bcryptjs.hash(this.password,10);
})
//JWT token
userSchema.methods.getJWTToken = function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE,
    })
    
}
userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcryptjs.compare(enteredPassword,this.password);
}
module.exports = mongoose.model("User",userSchema);