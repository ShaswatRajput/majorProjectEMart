const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModels");
const sendToken = require("../utils/jwttoken");
const sendEmail = require("../utils/sendEmail.js")
const crypto = require("crypto")

//register a user
exports.registerUser = catchAsyncErrors(async(req,res,next)=>{
    const {name,email,password} =req.body;
    const user = await User.create({
        name,
        email,
        password,
        avatar:{
            public_id: "this is a sample id",
            url:"profileUrl",
        },
       
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
    const isPasswordMatched = await user.comparePassword(password);
   
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

//Reset Password 
exports.resetPassword = catchAsyncErrors(async (req,res,next)=>{
    
    //Creating token hash
    const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex")

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: {$gt: Date.now()},
    })
    if(!user){
        return next(new ErrorHandler("Reset Password Token is invalid or has expired",400));

    }
    if(req.body.password !==req.body.confirmPassword){
        return next(new ErrorHandler("Password and Confirm Password doesn't match",400));
    }
    
    user.password = req.body.password
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();
    sendToken(user,200,res);

})

// get user details

exports.getUserDetails = catchAsyncErrors(async(req,res,next)=>{
    const user = await User.findById(req.user.id)

    res.status(200).json({
        success:true,
        user,
    })

})

//Update user password 
exports.updatePassword = catchAsyncErrors(async(req,res,next)=>{
    
    const user = await User.findById(req.user.id).select("+password") 
    
    const isPasswordMatched = await user.comparePassword(req.body.oldPassword)

    if(!isPasswordMatched){
        return next(new ErrorHandler("Old Password is incorrect",400))
    }

    if(req.body.newPassword !== req.body.confirmPassword){
        return next(new ErrorHandler("Password and confirm Password doesnt match",400))
    }

    user.password = req.body.newPassword
    await user.save()
    sendToken(user,200,res);

})

//Edit profile
exports.updateProfile = catchAsyncErrors(async(req,res,next)=>{
    
    const newDataObj = {
        name:req.body.name,
        email:req.body.email
    }
    //we will add cloudiary later
    const user = await User.findByIdAndUpdate(req.user.id,newDataObj,{
        new:true,
        runValidators:true,
        useFindAndModify:false,
    })
    res.status(200).json({
        success:true,
    })

})

//get list of all users (Admin)

exports.getAllUsers = catchAsyncErrors(async(req,res,next)=>{
    const users = await User.find({})

    res.status(200).json({
        success:true,
        users
    })
})

//get single user (Admin)

exports.getSingleUser = catchAsyncErrors(async(req,res,next)=>{
    const user = await User.findById(req.params.id)
    if(!user){
        return next(new ErrorHandler(`No user found with ID: ${req.params.id}`,400))
    }

    res.status(200).json({
        success:true,
        user
    })
})

//Update Role (Admin)

exports.updateRole = catchAsyncErrors(async(req,res,next)=>{
    
    const newDataObj = {
        name:req.body.name,
        email:req.body.email,
        role:req.body.role
    }
  
    const user = await User.findByIdAndUpdate(req.params.id,newDataObj,{
        new:true,
        runValidators:true,
        useFindAndModify:false,
    })
    if(!user){
        return next(new ErrorHandler(`We couldn't find any user with ID: ${req.params.id}`))
    }
    res.status(200).json({
        success:true,
    })

})

// Delete a particular user (Admin)

exports.deleteUser = catchAsyncErrors(async(req,res,next)=>{
    
    const user = await User.findById(req.params.id)
    //we will remove cloudinary later

    if(!user){
        return next(new ErrorHandler(`We can't find a user by ID ${req.params.id}`,400))
    }
    await user.deleteOne() 

    res.status(200).json({
        success:true,
        message:"user deleted succesfully"
    })

})
