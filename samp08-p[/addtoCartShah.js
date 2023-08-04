const addToCart = async (req, res) => {
    try {
      let proid = req.body.id;
      let prosize = req.body.size;
      let procolor = req.body.color;
      let cart = await Cart.findOne({ userId: req.session.userId });
      
      var product = await Product.findOne({ _id: proid });
      const offerPrice=Math.floor((product.price*(100-product.discount))/100)
      
      if (!cart) {
        let newCart = new Cart({ userId: req.session.userId, product: [] });
        await newCart.save();
        cart = newCart;
        }
        //  console.log( cart.userId);
        const existingproductindex = cart?.product.findIndex(
        (product) =>
          product.productId == proid &&
          product.size == prosize &&
          product.color == procolor
      );
      //  console.log(existingproductindex);
  
      if (existingproductindex == -1) {
        cart.product.push({
          productId: proid,
          price:offerPrice,
          quantity: 1,
          size: prosize,
          color: procolor,
          total: offerPrice,
       });
        cart.grandTotal += offerPrice;
      } else {
        cart.product[existingproductindex].quantity += 1;
        // cart.product[existingproductindex].size = req.body.size;
        // cart.product[existingproductindex].color = req.body.color;
  
        cart.product[existingproductindex].total += offerPrice;
        cart.grandTotal += offerPrice;
      }
   
      const c = await cart.save();
    
  
      res.redirect(`/productdetails?id=${proid}`);
    } catch (error) {
      console.log(error.message);
    }
  }