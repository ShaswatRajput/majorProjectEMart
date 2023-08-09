const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModels");
const sendToken = require("../utils/jwttoken");

//register a user
exports.registerUser = catchAsyncErrors(async(req,res,next)=>{
    const {name,email,password } =req.body;
    const user = await User.create({
        name,
        email,
        password,
        avatar:{
            public_id: "this is a sample id",
            url:"profileUrl",
        }
    })
    sendToken(user,201,res)

})

// Login User
exports.loginUser = catchAsyncErrors(async(req,res,next)=>{
    const { email,password } = req.body;
    
    //checking if user has given both email & password

    if(!email || !password){
        return next(new ErrorHandler("Please Enter Email & Password",400));

    }
    const user = await User.findOne({email}).select("+password");
    if(!user){
        return next(new ErrorHandler("Invalid E-mail or password",401))
    }
    const isPasswordMatched = user.comparePassword(password);
    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid E-mail or password",401));
    }
    sendToken(user,200,res)

})

//logout user
exports.logoutUser = catchAsyncErrors( async(req,res,next)=>{
    res.cookie("token",null,{
        expires: new Date(Date.now()),
        httpOnly:true,
    })
    res.status(200).json({
        success:true,
        message:"Logged Out",
    })
})