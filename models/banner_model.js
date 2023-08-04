const mongoose = require('mongoose')
const BannerSchema = mongoose.Schema({

    bannerName:{
        type:String,
        required:true
    },
    status:{
        type:String,
        default:"Active",
        required:true
    },
    image:{
        type:Array,
        required:true
    },

})

module.exports = mongoose.model('Banner', BannerSchema)