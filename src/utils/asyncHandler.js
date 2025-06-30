// --------------- hard way to create a function wrapper but more efficient ------

const asyncHandler = (requestHandler) => {
    return (req ,res , next) => {
        Promise.resolve(requestHandler(req , res , next)).
        catch((err) => next(err));
    }
}



// ----------this is an easy way to do so it is a type of function wrapper ---------

// const asyncHandler = (fn) => async (req , res , next) => {
//     try {
//         await fn(req , res , next);  
//     } catch (error) {
//         res.status(error.code || 500).json({
//             success : false , 
//             message : error.message,
//         })
//     }
// }

export {asyncHandler}