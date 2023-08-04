const mongoose = require('mongoose')


const cartSchema = new mongoose.Schema({
 
  userid:{
     type: mongoose.Schema.Types.ObjectId,
     ref:"User",
  },

  product: [
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
          }
        }
      ],
      createdAt: {
        type: Date,
        default: Date.now
      },
      grandTotal:{
        type:Number,
        default:0
      }

 });


module.exports = mongoose.model('cart',cartSchema)