const Razorpay=require('razorpay')

// const {RAZORPAY_ID_KEY,RAZORPAY_SECRET_KEY}=process.env
const Order=require('../models/orderModel')
const razorpayInstance=new Razorpay({
    key_id:'rzp_test_sl4QQ3hN2rdt4A',
    key_secret:"ARyaBWiEFZdJWruJhioa9x0N"
});


const orderDetailsLoad = async (req, res) => {
    try {
      const id = req.query.id;
      console.log('rrrrrrrrrrrrrrrrrrrrrrrrrrrrr',id);
    
      const orders=await Order.findOne({_id:id}).populate('orderItems.productId').exec()
  console.log('ttttttttttttt',orders.orderItems);
  
      // Render the order details view with the order and associated product details
      res.render('orderDetails', { orders: orders })
    } catch (error) {
      console.log(error.message);
      res.render('404');
    }
  }

  
const createOrder=async(req,res)=>{
console.log("///////////////////////")
    try {
   const amount=req.body.amount*100
      const options={
        amount:amount,
        currency:'INR',
        receipt:'mohammedsharbas33@gmail.com'
      }
      razorpayInstance.orders.create(options,async(err,order)=>{
        if(!err){
            console.log('SUCCESS')
            res.status(200).send({
                success:true,
                msg:'Order Created',
                order_id:order.id,
                amount:amount,
                key_id:'rzp_test_sl4QQ3hN2rdt4A',
                // product_name:req.body.description,
                contact:'8086548059',
                name:'Sharbas mohammed',
                email:'mohammedsharbas33@gmail.com'
            });
            
        }else{
            res.status(400).send({success:false,msg:'Something went wrong!'})
        }
       } 
        )
    } catch (error) {
      console.log(error.message);
      res.render('404');
    }
  
  }


  module.exports={
    orderDetailsLoad,
    createOrder
  }