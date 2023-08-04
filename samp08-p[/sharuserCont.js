const getCart = async (req, res) => {
    try {
      const userId = req.session.userId;
    
      const userCartData = await Cart.findOne({ userId: userId })
        .populate("product.productId")
        .lean()
        .exec();
  
        const productId = userCartData.product.map((data) => {
          return {
            id: data.productId._id.toString()
          };
        });

  
      let totalPrice = 0;
  
      if (
        userCartData &&
        userCartData.product &&
        userCartData.product.length > 0
      ) {
        var ProductPrice = [];
  
        for (let i = 0; i < userCartData.product.length; i++) {
          ProductPrice[i] =
            userCartData.product[i].productId.price * userCartData.product[i].kg;
          totalPrice += ProductPrice[i];
        }
      }
      // if(totalPrice>1000){
      //   shipping==0
      //  }else{
      //    shipping==100
      //  }
  
      res.render("cart", { userCartData, totalPrice, ProductPrice ,productId});
    } catch (error) {
      console.log(error.message);
      res.render("404");
    }
  };








  
const loadCart = async(req,res)=>{
  try {
     const check = await cart_model.findOne({userid:req.session.user_id})
     if(check){
        
     const cart = await cart_model

     .findOne({userid: req.session.user_id})
     .populate("product.productid")
     .lean()
     .exec();

     const cartProducts = cart.product.map((product)=>{

      const total= 
      Number(product.quantity) * Number(product.productid.price);
      
      return {
          _id: product.productid._id.toString(),
          name: product.productid.name,
          price: product.productid.price,
          description: product.productid.description,
          category: product.productid.category,
          image: product.productid.images[0],
          quantity: product.quantity,
          size: product.size,
          total
        };
     });

     const total = cartProducts.reduce(
      (sum, product) => sum + Number(product.total),0
     );

     var isLogin = req.session.userid ? true : false
      const finalAmount = total + 90;
      const allProducts=await Products.find({}).lean()
     
        res.render('users/cart',{
          cartProducts,
          total,
          subtotal:total,
          shipping: 90,
          finalAmount,
          productdetails:JSON.stringify(allProducts),
          isLogin:isLogin
        })
      }else{
      var isLogin = req.session.userid ? true : false
      res.render("users/cart", { message: "Your cart is empty" ,isLogin:isLogin});
     
     }

  } catch (error) {
      error.message
  }
}