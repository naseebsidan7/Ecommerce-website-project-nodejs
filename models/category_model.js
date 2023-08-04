const mongoose = require('mongoose')
const categorySchema = mongoose.Schema({

    Category:{
        type:String,
        required:true
    },
    is_Delete:{
       type:Boolean,
       default:false
    }
    // <input type="text" name="id" value="<%= Product._id %>" hidden>
})

module.exports = mongoose.model('Category', categorySchema) 