const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userid: {
        type:String,
        required: true
    },
    items: [{
        product: {

            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true
        }
    }],
    address: [
        {
            name:{
                type:String
            },
            phone:{
                type:Number
            },
            email:{
                type:String
            },
            head:{
                type:String
            },
            street: {
                type: String,
            },
            city: {
                type: String
            },
            pincode:{
                type:Number,
            },
            state:{
                type:String,
            },
        }
    ], 
    totalamount: {
        type: Number,
        required: true
    },
    paymentmethod:{
        type:String,
        required:true
    },
    status: {
        type: String,
        default: 'Pending'
    },
    orderdate:{
        type:Date
    },
    delivereddate:{
        type:Date
    },
    return:{
        status:{
            type:Boolean,
            default:false
        },
        reason:{
            type:String,
        }
    }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order