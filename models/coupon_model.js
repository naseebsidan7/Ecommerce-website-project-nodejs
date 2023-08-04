const mongoose = require('mongoose');

const CouponSchema = mongoose.Schema({
 
  usedUsers:[
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
  ],
  couponCode: {
    type: String,
    required: true,
  },
  couponAmount: {
    type: Number,
    required: true,
  },
  expireDate: {
    type: Date,
    required: true,
  },
  couponDescription: {
    type: String,
    required: true,
  },
  minimumAmount: {
    type: Number,  
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Coupon', CouponSchema);
