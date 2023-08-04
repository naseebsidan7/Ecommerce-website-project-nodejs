const updateCart = async (req, res) => {
    try {
        let userId = req.session.user_id
        let updateValues = req.body.products
        let idx = req.body.iddd
        console.log(idx);

        id = updateValues[0].prod_id
        let product = await Product.findOne({ _id: id })
        let Stock = product.stock
        let quant = updateValues[0].quantity

        if (quant <= Stock) {
            for (let data of updateValues) {
                const { prod_id, quantity, finalAmount } = data;
                const changeCart = await Cart.updateOne({ $and: [{ user_id: userId }, { 'products.product_id': prod_id }] }, { $set: { 'products.$.quantity': quantity, total: finalAmount } })
            }
            res.send({ isOk: true })
        }
    } catch (error) {
        console.log(error.message);
        res.render('errorPage')
    }
}