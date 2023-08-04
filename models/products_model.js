const mongoose = require('mongoose')
const productSchema = mongoose.Schema({

    product_name:{
        type:String,
        required:true
    },
    brand:{
        type:String,
        required:true
    },
    image:{
        type:Array,
        required:true
    },
    Category:{
        type:String,
        required:true
    },
    stock:{

        type:Number,
        required:true
    },
    size:{
       type:Array,
       required:true
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    is_delete:{
        type:Boolean,
        default:false
     }
})


module.exports = mongoose.model('Product', productSchema)