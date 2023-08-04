const getCart = async (req, res) => {
    // req.session.userid = '6461e3224ab9eed5f2ef9aaf';
  
    try {
      const check = await cartmodel.findOne({ userid: req.session.userid });
      if (check) {
        const cart = await cartmodel
  
          .findOne({ userid: req.session.userid })
          .populate("product.productid")
          .lean()
          .exec();
          
        const products = cart.product.map((product) => {
          const total =
            Number(product.quantity) * Number(product.productid.price);
          return {
            _id: product.productid._id.toString(),
            name: product.productid.product_name,
            price: product.productid.price,
            description: product.productid.description,
            Category: product.productid.Category,
            image: product.productid.image[0],
            quantity: product.quantity,
            size: product.size,
            brand:product.productid.brand,
            total,  
            stock:product.productid.stock
          };
        });
  
        const total = products.reduce(
          (sum, product) => sum + Number(product.total),
          0
        );
        var isLogin = req.session.userid ? true : false
        const finalAmount = total + 90;
          const allProducts=await productmodel.find({}).lean()
        res.render("user/ucart", {
          products,
          total,
          subtotal: total,
          shipping: 90,
          finalAmount,
          productdetails:JSON.stringify(allProducts),
          isLogin:isLogin
        });
        // res.send('H ')
      } else {
        var isLogin = req.session.userid ? true : false
        res.render("user/ucart", { message: "Your cart is empty" ,isLogin:isLogin});
      }
    } catch (error) {
      console.log(error.message);
      res.render("user/error");
    }
  };
  
  const addTocart = async (req, res) => {
    try {
      var isLogin = req.session.userid ? true : false
      if(isLogin==true){
        let proid = req.body.proid;
        let prosize = req.body.size;
    
        let cart = await cartmodel.findOne({ userid: req.session.userid });
    
        if (!cart) {
          let newCart = new cartmodel({ userid: req.session.userid, product: [] });
          await newCart.save();
          cart = newCart;
        }
    
        const existingproductindex = cart?.product.findIndex(
          (product) => product.productid == proid && product.size == prosize
        );
    
        if (existingproductindex == -1) {
          cart.product.push({ productid: proid, quantity: 1, size: prosize });
        } else {
          cart.product[existingproductindex].quantity += 1;
          cart.product.size = req.body.size;
        }
    
        await cart.save();
    
        // res.redirect("/loadProductview" + "?id=" + proid);
        res.send({ ok: true });
      }
     
    } catch (error) {
      console.log(error.message);
      res.render("user/error");
    }
  };  