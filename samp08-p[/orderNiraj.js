const confirmOrder = async(req,res)=>{
    try {
        console.log(req.body)
        let userId=req.body.userid
        let productDetails = await Cart.findOne({userid:userId}).populate('products.productid')
        console.log(productDetails.products)
        let orderData = new Order({
            userid:userId,
            user:req.body.name,
            email:req.body.email,
            mobile:req.body.phone,
            address:req.body.useraddress,
            total:req.body.total,
            payment_method:req.body.payment,
            products:productDetails.products,
            orderDate:Date.now()
        })
        if(req.body.payment == "Wallet"){
            let user = await User.findById(req.session.userId)
            let walletAmount = user.wallet
            console.log(walletAmount)
            if(req.body.total>walletAmount){
                console.log(req.body.total)
                let balance = req.body.total-walletAmount
                const amount = balance * 100;
                const options = {
                    amount: amount,
                    currency: 'INR',
                    receipt: config.PAY_MAIL,
                };
            
                instance.orders.create(options, async (err, order) => {
                    if (!err) {
                    res.status(200).send({
                        success: true,
                        msg: 'Order Created',
                        order_id: order.id,
                        amount: amount,
                        key_id: config.KEY_ID,
                        name: req.body.name,
                        email: req.body.email,
                        mobile: req.body.phone,
                    });
                    } else {
                    res.status(400).send({ success: false, msg: 'Something went wrong' });
                    }
                });
            }else{
                await User.findByIdAndUpdate(req.session.userId,{$inc:{wallet:-req.body.total}})

                var success=await orderData.save()
            }
        }else{
            var success=await orderData.save()
        }
        if (success){
            let cart = await Cart.findOne({userid:userId})
            // Update the stock count of products
            cart.products.forEach(async (product) => {
                const productId = product.productid;
                const quantity = product.quantity;
        
                // Find the product by ID
                const foundProduct = await Product.findById(productId);
            
                // Calculate the new stock count
                const newStock = parseInt(foundProduct.stock) - parseInt(quantity);
        
                // Update the stock count in the database
                await Product.findByIdAndUpdate(productId, { stock: newStock });
            })
            await Cart.findOneAndDelete({userid:userId})
            console.log('cart also deleted')
            res.redirect('/ordersuccess')
        }
    } catch (error) {
        console.log(error.message);
    }
}