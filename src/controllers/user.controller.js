import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {User}from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/Cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js"

const generateRefreshNdAccessTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave : false});

        return {accessToken , refreshToken}
    } catch (error) {
        throw new ApiError(500 , "smthg went wrong while generating tokens")
    }
}

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

    const existedUser = await User.findOne({
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

    const user = await User.create({
    fullname, 
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email, 
    password,
    username: username.toLowerCase()
    });

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    if (!createdUser) {
        throw new ApiError(500, "user not created error in server");
    }


    return res.status(201).json(
        new ApiResponse(200 , createdUser , "User registered successfully")
    )
})

const loginUser = asyncHandler(async (req , res) => {
    // req body -> data
    // username or email
    // find the user 
    // password check 
    // generate refresh and access token 
    // send cookie

    const {email , username, password} = req.body

    if(!username && !email){
        throw new ApiError(400 , "username or email is required");
    }

    const userExisted = await User.findOne({
        $or: [{username} , {email}]
    })

    if(! userExisted){
        throw new ApiError(404 , "cannot find user");
    }

    const isPasswordValid = user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new ApiError(404 , "Password is not valid");
    }
    generateRefreshNdAccessTokens(userExisted._id);

    const loggedInUser = await User.findById(userExisted._id).select(
        "-password -refreshToken"   
    )

    const options = {
        httpOnly : true,
        secure : true,
    }

    return res.status(200)
    .cookie("accessToken" , accessToken , options)
    .cookie("refreshToken" , refreshToken , options)
    .json(
        new ApiResponse(
            200,
            {
                user : loggedInUser , accessToken , refreshToken
            },
            "User logged in Success"
        )
    )

})

const logoutUser = asyncHandler(async (req , res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken : undefined
            },
        },
        {
            new :true,
        },
    )

    const options = {
        httpOnly : true , 
        secure :true,
    }

    return res.status(200)
    .clearCokkie("accessToken" , options)
    .clearCokkie("refreshToken" , options)
    .json
    (new ApiResponse(200 , {} , "user logged out successfully"))
})

export {
    registerUser,
    loginUser,
    logoutUser,
}
