const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModels");
const sendToken = require("../utils/jwttoken");
const sendEmail = require("../utils/sendEmail.js")

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

//Forget Password
exports.forgetPassword = catchAsyncErrors(async (req,res,next)=>{

    const user = await User.findOne({email:req.body.email});

    if(!user){
        return next(new ErrorHandler('User not found',404))
    }

    //Get reset Password Token 
    const resetToken = user.getResetPasswordToken();
    await user.save({validateBeforeSave: false });

    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`
    const message = `Hey user, here is your password reset link- \n\n ${resetPasswordUrl} \n\n If you have not requested this password reset then its time to panic and be concerned about your security`
    
    try {
        
        await sendEmail ({
            email:user.email,
            subject: `MajorEcom password Recovery`,
            message,
             
        })
        res.status(200).json({
            success:true,
            message:`Email sent to ${user.email} successfully`,
        })
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({validateBeforeSave:false})
        return next(new ErrorHandler(error.message, 500))

    }
})