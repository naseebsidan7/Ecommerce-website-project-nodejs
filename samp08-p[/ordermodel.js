const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    product: [
        {
            product_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                default: 1,
            },
            price: {
                type: Number,
                ref: 'Product'
            }
        }
    ],
    total: {
        type: Number,
    },
    status: {
        type: String,
        default: "Pending"
    },
    name: {
        type: String,
    },
    mobile: {
        type: Number,
    },
    state: {
        type: String,
    },
    street: {
        type: String,
    },
    landmark: {
        type: String,
    },
    address: {
        type: String,
    },
    city: {
        type: String,
    },
    zipcode: {
        type: Number,
    },
    payment_method: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now
    },
    status_date: {
        type: Date,
    },
    delivery_date: {
        type: Date,
    }
});

module.exports = mongoose.model("Order", orderSchema)