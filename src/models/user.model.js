import mongoose from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"


const userSchema = new mongoose.Schema({
    username : {
        type : String,
        required : true,
        unique : true, 
        lowercase: true, 
        trim : true ,
        index : true,
    }, 
    email : {
        type : String , 
        required :true, 
        unique : true, 
        lowercase : true,
        trim : true,
    }, 
    fullname : {
        type : String , 
        required :true,  
        trim : true,
        index : true,
    } , 
    avatar : {
        type : String, //cloudinary url
        required : true, 
    },
    coverImage : {
        type :String,
    }, 
    watchHistory : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Video"
        }
    ],
    password : {
        type : String,
        required: [true , "password is required"] 
    },
    refreshToken : {
        type : String,
    } 
}, {
    timestamps :true
})
 // it runs before the operation you give in params and also has access to values in schema using this 
userSchema.pre("save" ,async function (next) {
    if(! this.isModified("password")) return next();
    this.password = bcrypt.hash(this.password , 10)
    next()
})
 //  used for generating methods and all these have access to the values present in schema 
userSchema.methods.isPasswordCorrect = async function (password){
    return await bcrypt.compare(password, this.password);
}
userSchema.methods.generateAccessToken = async function (){
    return jwt.sign(
        {
            _id : this._id,
            name : this.username,
            email : this.email,
            fullname : this.fullname,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn : process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = async function (){
    return jwt.sign(
        {
            _id : this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn : process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}
export const User = mongoose.model("User" , userSchema);