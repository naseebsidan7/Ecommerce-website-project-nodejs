const pipeline = [
  {
    $unwind: "$products",
  },
  {
    $lookup: {
      from: "products",
      localField: "products.productId",
      foreignField: "_id",
      as: "productData",
    },
  },
  {
    $unwind: "$productData",
  },
  {
    $project: {
      _id: 1,
      status: 1,
      grandTotal: 1,
      email: 1,
      phone: 1,
      address: 1,
      paymentMethod: 1,
      orderDate: 1,
      discount: 1,
      name: "$productData.modelName",
      productId: "$productData.description",
      quantity: "$products.quantity",
      price: "$products.price",
      size: "$products.size",
      color: "$products.color",
      total: "$products.total",
      image: { $arrayElemAt: ["$productData.image", 0] },
    },
  },
  {
    $group: {
      _id: "$_id",
      status: { $push: "$status" },
      paymentMethod: { $push: "$paymentMethod" },
      products: { $push: "$$ROOT" },
    },
  },
];

const orders = await Order.aggregate(pipeline);
orders.sort((a,b)=> b.products[0].orderDate-a.products[0].orderDate)
// console.log(orders)

// console.log('ith total',orders[orders.length-1].products[0].total)
// console.log(orders[orders.length-1].products[0].total)
res.render("userorders", { admin: false, orders: orders });
 

const mongoose = require("mongoose");

const order = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  status: {
    type: String,
    default: "pending",
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      price:{
        type:Number,
        required:false
      },
      quantity: {
        type: Number,
        required: false,
      },
      size: {
        type: String,
        required: false,
      },
      color: {
        type: String,
        required: false,
      },
      total: {
        type: Number,
        required: false,
      },
    },
  ],
  grandTotal: {
    type: Number,
    required: false,
  },
  email: {
    type: String,
    required: false,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
  deliveredDate: {
    type: Date,
    required: false,
    index:true,
  },
  discount: {
    type: Number,
    required: false,
  },
  couponPassed:{
    type:Boolean,
    default:false
  }
});

module.exports = mongoose.model("Order", order);


const productOrderDetails = async(req,res)=>{

 

  try {
    const ProductId  = req.query.id;
    console.log(" ----------------------> product id   ---->" + ProductId );
    const ProductData = await Products.findOne({ _id: ProductId  });
    const findbrand = ProductData.brand;

    const allProductsData = await Products.find({ brand: findbrand });
    

    const userId = req.session.user_id;
    console.log("user id ...........----.......---->" + userId);

    const cart = await Cart.findOne({ userid: userId })
      .populate('product.productid')
      .lean()
      .exec();

    let cartProducts = [];
    let finalAmount = 0;

    if (cart && cart.product) {
      cartProducts = cart.product.map((item) => {
        const total = Number(item.quantity) * Number(item.productid.price);

        return {
          _id: item.productid._id.toString(),
          name: item.productid.product_name,
          price: item.productid.price,
          image: item.productid.image[0],
          quantity: item.quantity,
          size: item.size,
          total: total,
        };
      });

      finalAmount = cartProducts.reduce(
        (sum, product) => sum + Number(product.total),
        0
      );
    }

    

    const orderData = await Order.findOne({
      "product.productid": ProductId
    }).populate('product.productid');
    
    const orderDetails = {
      orderid: orderData._id,
      name: orderData.name,
      mobile: orderData.address.map(addr => addr.mobile),
      grandTotal: orderData.grandTotal,
      status: orderData.status,
      payment_method: orderData.payment_method,
      orderdate: orderData.date,
      delivery_date: orderData.delivery_date,
      return: orderData.return.status,
      product: orderData.product[0], // Include the single product details
      address: orderData.address ,// Include the entire address array
      quantity:orderData.product[0].quantity
    };
    
 
 

    console.log(" of product ------> "+JSON.stringify(orderData) + "<----------------- the order details of product ------> ");



    res.render('users/productOrderDetail', {
      cartProducts: cartProducts,
      finalAmount: finalAmount,
      Product: ProductData,
      allProducts: allProductsData,
      orderDetails:orderDetails
    });
    
  } catch (error) {
    console.log(error.message);
    // Handle the error appropriately (e.g., show an error page)
    res.render('error', { error: 'An error occurred while loading the product details.' });
  }
};