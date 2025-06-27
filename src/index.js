import dotenv from "dotenv";
import connectDB from "./db/index.js";

dotenv.config();
connectDB();



// -------------- DB connection------------------------
// direct function in index js or you can create a function in DB folder and export it 
// iife is created and we use semicolon before iife in production to avoid errors 
// async await function is created for parallel and try catch to avoid error 

/*
// import {DB_NAME} from "./constants"
;(async ()=> {
    try {
        await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
        app.on("error" , (error) => {
            console.log("ERROR :" , error);
            throw error
        })

        app.listen(process.env.PORT , () => {
            console.log(`Server running at http://localhost:${process.env.PORT}/`);
        })
    } catch (error) {
        console.log("Error :", error );
        throw error
    }
})()
*/
