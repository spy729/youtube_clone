import dotenv from "dotenv";
import {app} from "./app.js"
import connectDB from "./db/index.js";
dotenv.config();
connectDB()
.then( () => {
    app.on("error" , (error) => {
        console.log("error in server start :" , error);
        throw error;
    })
    app.listen(process.env.PORT || 8000 , () => {
        console.log(`server running at http://localhost/${process.env.PORT}`);
    })
})
.catch( );



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
