const mongoose = require('mongoose')
const userScheme = new mongoose.Schema({
        name:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:true
        },
        mobile:{
            type:String,
            required:true
        },
        otp:{
            type:String,
            default:''
        },
        password:{
            type:String,
            required:true
        },
                
        profileImage: {
            
            type:Array,
            required:true
        },

        is_blocked:{
            type:Boolean,
            default:false
        },
        is_verifed:{
            type:Number,
            default:0  
        },
        referralcode:{
            type:String
        },
        referralCodeUsed:{
            type:Number,
             default:0
        },
        wallet:{
            type:Number,
            default:0
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
});

module.exports= mongoose.model('User',userScheme)