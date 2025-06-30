import express from "express"
import cors from "cors"
import cookieparser from "cookie-parser"

const app = express();

app.use(cors({
    origin : process.env.CORS_ORIGIN
}))

app.use(express.json({limit : "16kb"})); // this is for setting limit of json data for security purposes
app.use(express.urlencoded({ extended :true , limit :"16kb"})); // this is for url data for encoding format and for limit 
app.use(express.static("public")); // for static resources
app.use(cookieparser());


// routes import 

import userRouter from "./routes/user.routes.js"


// routes declare

app.use("/api/v1/users" ,userRouter)
export {app}