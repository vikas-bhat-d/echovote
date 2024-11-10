import asyncHandler from "../utils/asyncHandler.utils.js";
import apiError from "../utils/apiError.utils.js"
import apiResponse from "../utils/apiResponse.utils.js"
import {User} from '../models/user.model.js'
import { Playlist } from "../models/playlist.model.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv"

dotenv.config({
    path:'./.env'
})

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

    await Playlist.create({ownerID:createdUser._id,venueName:createdUser.venueName,voteCount:0})
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

const checkLog=asyncHandler(async function(req,res,next) {
    try {
        const accessToken=req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
        console.log(accessToken);
        console.log(req.cookies);
    
        if(!accessToken)
            res.status(400).send(new apiResponse(400,{},"Not Logged in"))
    
        let decodedToken=jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET);
        
        if(!decodedToken)
        {
            res.status(400).send(new apiResponse(400,{},"Not Logged in"))
            return
        }

        
        
        const user=await User.findById(decodedToken._id).select("-password -refreshToken");
        if(!user){
            res.status(400).send(new apiResponse(400,{},"Not Logged in"))
            return
        }

    
        req.user=user;


    } catch (error) {
        throw new apiError(400,error.message||"verifying token failed");
        next(error)
    }
    // res.send(new apiResponse(200,req.user,"User is logged in"));
})

export{
    registerUser,
    loginUser,
    logoutUser,
    checkLog
}