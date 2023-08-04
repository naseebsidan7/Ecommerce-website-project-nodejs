const checkout = async (req, res) => {
    try {
        let username = req.session.username
        let session = req.session.loggedIn
        let userData = await User.findOne({ _id: req.session.user_id })
        let home = userData.homeaddress
        let work = userData.workaddress
        let personal = userData.personaladdress
        let balance = encodeURIComponent(JSON.stringify(userData.wallet))

        let cart = await Cart.findOne({ user_id: req.session.user_id }).populate("products.product_id").lean().exec()
        if (cart) {
            const total = cart.products.map(prod => {
                return Number(prod.quantity) * Number(prod.product_id.price)
            })
            const products = cart.products.map(prod => {
                const totals = Number(prod.quantity) * Number(prod.product_id.price)
                return ({
                    _id: prod.product_id._id.toString(),
                    name: prod.product_id.name,
                    price: prod.product_id.price,
                    image: prod.product_id.image,
                    quantity: prod.quantity,
                    total: totals,
                })
            })
            let totalamount = total.reduce((a, b) => {
                return a + b;
            });
            res.render('checkout', { title: "User Cart", cartData: products, username, session, message: '', total: "Total amount payable", totalamount, userData, total, home: encodeURIComponent(JSON.stringify(home)), work: encodeURIComponent(JSON.stringify(work)), personal: encodeURIComponent(JSON.stringify(personal)), balance })
        } else {
            res.render('checkout', { title: 'User Cart', message: "Cart is empty", cartData: '', total: '', totalamount: '', total: '', home: encodeURIComponent(JSON.stringify(home)), work: encodeURIComponent(JSON.stringify(work)), personal: encodeURIComponent(JSON.stringify(personal)), balance })
        }
    } catch (error) {
        console.log(error.message)
        res.render('errorPage')
    }
}
const placeorder = async (req, res) => {
    try {
        let userId = req.session.user_id
        let userDetails = await User.findOne({ _id: userId })
        if (req.body.payment == 'wallet') {
            let amount = userDetails.wallet
            let walletUpdate = amount - parseFloat(req.body.total)
            await User.updateOne({ _id: userId }, { $set: { wallet: walletUpdate } })
        }
        let CartDetails = await Cart.findOne({ user_id: userId }).populate('products.product_id')
        let orderData = new Order({
            user_id: userId,
            name: req.body.uname,
            email: userDetails.mail,
            mobile: req.body.mobile,
            products: CartDetails.products,
            total: parseFloat(req.body.total),
            state: req.body.state,
            city: req.body.city,
            street: req.body.street,
            landmark: req.body.landmark,
            address: req.body.address,
            zipcode: req.body.zipcode,
            payment_method: req.body.payment,
            date: new Date()
        })
        let success = await orderData.save()

        if (success) {
            await Cart.findOneAndDelete({ user_id: userId })
        }
        res.redirect('/')
    } catch (error) {
        console.log(error.message);
        res.render('errorPage')
    }
}