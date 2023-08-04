const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({

  userid:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"User",
 },
 name:{
    type:String,
    required:true
 },
 email:{
    type:String,
    required:true
 },
 password:{
  type:String,
  
}, 
discoundAmount:{
  type:String
},
  status:{
  type:String,
  default:"Not yet dispatched"
},

address:[ {
  state:{
  type:String
 },
 location:{
  type:String
 },
 landmark:{
  type:String
 },
 city:{
  type:String
 },
 pincode:{
  type:String
 },
 country:{
  type:String
 },
 mobile:{
  type:String
 }
}]

,   product: [
  {
    productid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      default: 1,
      required: true
    },
    size:{
      type:String,
      required:true
    },
    total:{
      type:String,
      default:0
    },
    status:{
      type:String,
      default:"Not yet dispatched"
    }
  }
],

  
grandTotal:{
  type:Number,
  default:0
}, 
payment_method: {
  type: String,
},
date: {
  type: Date,
  default: Date.now
},
delivery_date: {
  type: Date,
},
return:{
  status:{
      type:Boolean,
      default:false
  },
  reason:{
      type:String,
  }
},




});

module.exports = mongoose.model('OrderItem', orderItemSchema);
