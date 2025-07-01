import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {User}from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/Cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js"

const registerUser = asyncHandler( async (req , res) => {

    // get user details from frontend
    // validation - empty or email corrct etc
    // check if user already exist
    // check for image ,check for avatar
    // upload them to cloudinary
    // create user object - enter in db
    // remove password and refresh token from response 
    // check for user creation 
    // return response 


    const {fullname , email , username , password} = req.body

    // if(fullname === ""){
    //     throw new ApiError(400 , "FullName is required")
    // }

    if(
        [fullname , email , username , password].some((field) => 
        field?.trim()==="")
    ){
        throw new ApiError(400 , "all fields are required")
    }

    const existedUser = User.findOne({
        $or : [ {username}, {email}] 
    })

    if(existedUser){
        throw new ApiError( 409 ,"user with username or email exist" )
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if(!avatarLocalPath){
        throw new ApiError(400 , "avatar required");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new ApiError(400 , "avatar required");
    }

    const user = User.create({
        fullname , 
        avatar : avatar.url,
        coverImage : coverImage?.url || "",
        email, 
        password,
        username : username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500 , "user not created error in server")
    }

    return res.status(201).json(
        new ApiResponse(200 , createdUser , "User registered successfully")
    )
})

export {registerUser}
