const mongoose = require("mongoose")

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required:[true,"Please provide a name"],
        trim:true


    },
    description : {
        type: String,
        required:[true,"Please provide a description"]

    },
    price:{
        type: Number,
        required:[true,"Please provide a valid price"],
        maxLength:[8,"Cant be this expensive,provide a lesser value"]

    },
    rating:{
        type: Number,
        default: 0
    },
    images:[{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
    }],
    category:{
        type:String,
        required:[true,"Please provide a product category"],

    },
    stock:{
        type:Number,
        required:[true,"Please provide a valid stock value"],
        maxLength:[4,"Stock value cannot exceed 9999, sorry"],
        default:1
    },
    numOfReviews:{
        type: Number,
       default:0
    },
    reviews:[
        {
            name:{
                type:String,
                required:true,
            },
            rating:{
                type: Number,
                required: true
            },
            comment:{
                type: String,
                required:[true,"Comment can't be empty,Write something..."]
            }
        }
    ],
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true,
    }
    ,
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model("Product",productSchema);
