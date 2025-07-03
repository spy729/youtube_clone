import mongoose from "mongoose"

const subscriptionSchema = new Schema({
    subscriber : {
        type : Schema.Types.ObjectId, // user subscribing
        ref : "User",
    },channel : {
        type : Schema.Types.ObjectId, // user who owns channel
        ref : "User",
    }
} , {timestamps : true})

export const Subscription = mongoose.model("Subscription" , subscriptionSchema)