import asyncHandler from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js"
import apiResponse from "../utils/apiResponse.js"
import {User} from '../models/user.model.js'

const cookieOptions={
    httpOnly:true,
    secure:true
}

const generateTokens=async function (userId) {
    try {
        const user=await User.findById(userId);
        const accessToken=await user.generateAccessToken();
        
        const refreshToken=await user.generateRefreshToken();
        user.refreshToken=refreshToken;
        
        await user.save({validateBeforeSave:false})
    
        return {accessToken,refreshToken}

    } catch (error) {
        throw new apiError(400,error?.message||"tokens couldn't be generated");
    }
}

const registerUser=asyncHandler(async(req,res,next)=>{

    let {username,email,password,venueName,venueType}=req.body;

    if(username.trim()=="" || email.trim()=="" || password.trim()=="" || venueName.trim()=="" ||venueType.trim()=="")
        throw new apiError(400,"All fields are required")

    let existedUser=await User.findOne({
        $or:[{username:username}, {email:email},{venueName:venueName}]
    })

    if(existedUser) throw new apiError(409,"User or venue name already exits");

    await User.create({username,email,password,venueName,venueType})
    let createdUser=await User.findOne({username:username}).select('-password')

    return res
    .status(201)
    .send(new apiResponse(201,createdUser,"User Registration Succesfull"))
})

const loginUser=asyncHandler(async(req,res,next)=>{
    let {user,password}=req.body;
    
    if(user.trim()=="" || password.trim()=="")
        throw new apiError(400,"All fields are required")

    let existedUser=await User.findOne({
        $or:[{username:user},{email:user}]
    })

    if(!existedUser)
        throw new apiError(400,"Wrong Username or Password")

    let isPasswordCorrect=await existedUser.checkPassword(password);
    if(!isPasswordCorrect) 
        throw new apiError(400,"Incorrect password")

    let {accessToken,refreshToken}=await generateTokens(existedUser._id);

    let loggedInUser=await User.find({_id:existedUser._id}).select('-password -refreshToken');

    return res
    .status(200)
    .cookie("accessToken",accessToken,cookieOptions)
    .cookie("refreshToken",refreshToken,cookieOptions)
    .json(
        new apiResponse(200,
            {User:loggedInUser,accessToken,refreshToken},
            "logged user succesfully"
        )
    )
})

const logoutUser=asyncHandler(async(req,res,next)=>{
    await User.findOneAndUpdate(
        {_id:req.user._id},
        {
            $set:{
                refreshToken:undefined
            }
        }
    )
    

    return res
    .clearCookie("accessToken",cookieOptions)
    .clearCookie("refreshToken",cookieOptions)
    .status(200)
    .json(new apiResponse(200,{}, "User logged out succesfully"))

})