const Razorpay = require('razorpay');
const Coupon = require('../models/coupon_model');
const User = require('../models/User_Model');

const razorpayInstance = new Razorpay({
  key_secret:"UxzVN00OfOi4d8mTflMSn9Zl",
  key_id:"rzp_test_vOT9Bkc7HSH7sm"
});

const OnlinePaymentOrder = async (req, res) => {
  try {
    const originalAmount = req.body.finalAmount * 100;
    const discountedAmount = req.body.discountedAmount * 100; // Use the discounted amount received from the client-side
    const OrginalFinalPrice = req.body.finalOrginalprice * 100;
    console.log(originalAmount+" <---originalAmount");
    console.log(OrginalFinalPrice+" <---OrginalFinalPrice");
    console.log(req.body.discountedAmount+" <---req.body.discountedAmount");
    console.log(discountedAmount+" <---discountedAmount");
    // Use the discounted amount if it is available, otherwise use the original amount
    const amount = discountedAmount || originalAmount || OrginalFinalPrice  ;

    console.log(amount+" <---amount");
    
    const options = {
      amount: amount,
      currency: 'INR',
      receipt: 'naseebsidan6@gmail.com',
    };

    razorpayInstance.orders.create(options, (err, order) => {
      if (!err) {
        // Handle the created order object
        console.log(order);
        res.status(200).send({ 
          success: true,
          message: 'Order Created',
          order_id: order.id,
          amount: amount / 100, // Convert back to the original amount in rupees
          key_id: 'rzp_test_vOT9Bkc7HSH7sm',
          name: 'sidan',
          contact: '9947442414',
          email: 'naseebsidan6@gmail.com'
        });
      } else {
        console.log(err);
        res.status(400).send({ success: false, message: 'Something went wrong!' });
      }
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ success: false, message: 'Internal server error' });
  }
};

const walletPayment = async (req, res) => {
  try {
      const finalPrice = req.body.finalOrginalprice;
      const discountedAmount = req.body.discountedAmount;
      const userId = req.body.userId;
       
      const Amount = discountedAmount || finalPrice ;

      console.log(finalPrice + " < -- -- Price ");
      console.log(discountedAmount + " < -- -- discountedAmount ");
      console.log(Amount + " < -- -- Amount ");
      
       
      const user = await User.findOne({ _id: userId });

      const walletAmount = user.wallet;

      if(Amount <= walletAmount){

        const walletUpdation = await User.findOneAndUpdate(
          { _id: userId },
          {
            $inc: {
              wallet: -Amount
            }
          },
          { new: true }
        );
        console.log(walletUpdation+"walletUpdation");

        res.json({ success: true, message: 'Payment successful' });

      }else{
        console.log("Amount is Suffeicent For Payment ");
        res.json({ success: false, message: 'Amount is Suffeicent For Payment ' });
      }
      
      
       

  

     

  } catch (error) {
      console.log(error.message);
       
  }
}

 


const validateCoupon = async (req,res)=>{
  try {
    const couponApplied = req.body.coupon;
    const Userid = req.session.user_id;
    const ProductAmount = req.body.subtotal;
     
    const CouponData = await Coupon.findOne({couponCode:couponApplied})

    console.log("Userid>>> "+Userid+" <<<Userid");
    console.log("ProductAmount >>>> "+ProductAmount+" <<<< ProductAmount");
    console.log("CouponData >>>>"+CouponData+"<<<< CouponData");

    if(CouponData){
         if(!CouponData.usedUsers.includes(Userid)){
          console.log("user mumb coupon adichatillaa...");
              if(ProductAmount>= parseInt(CouponData.minimumAmount)){
                console.log("minimum amount ine kaatilum kooduthal aahn product amount  , ellaam ok aahn ");

                res.send({ msg: "1", couponAmount:CouponData.couponAmount})
                 
              }else{
                res.send({
                  msg: "2",message: "This Coupon Is Not Applicable For This Purchase Amount",
               
                });
                console.log("This Coupon Is Not Applicable For This Purchase Amount");
              }

         } else {
          res.send({ msg: "2", message: "Coupon Has Been Already Applied" });
          console.log("Coupon Has Been Already Applied");
         }
    }else{
      res.send({ msg: "2", message: "Invalid Coupon Code" });
      console.log("Invalid Coupon Code");
    }
  } catch (error) {
    console.log(error.message);
  }
}

module.exports = {
  OnlinePaymentOrder,
  validateCoupon,
  walletPayment
};
