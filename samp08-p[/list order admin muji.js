// orders list
const orders = async (req, res) => {
    try {
        const orderdata = await Order.find({});
    
        if (orderdata.length > 0) {
            const orderDetails = orderdata.map(ord => {
                const orderDate = new Date(ord.orderdate); // Convert orderdate to a Date object
                const year = orderDate.getFullYear();
                const month = orderDate.getMonth() + 1;
                const date = orderDate.getDate();
        
                return {
                    orderid: ord._id,
                    name: ord.address[0].name,
                    phone: ord.address[0].phone,
                    totalamount: ord.totalamount,
                    status: ord.status,
                    payment: ord.paymentmethod,
                    orderdate: `${date}/${month}/${year}`,
                    delivereddate: ord.delivereddate,
                    return:ord.return.status
                };
            });
            res.render('orders', { orderdetails: orderDetails });
        } else {
            res.render('orders', { message: 'No orders',orderdetails:'' });
        }
    } catch (error) {
        res.render('error', { error: error.message });
    }
};
// order detatils
const orderdetails=async(req,res)=>{
    try{
        let orderid=req.query.orderId;
        let order=await Order.findOne({_id:orderid}).populate('items.product');
        if(order){
            let products= order.items.map(item=>{
                return{
                    image:item.product.image[0],
                    name:item.product.name,
                    price:item.product.price,
                    brand:item.product.brand,
                    quantity:item.quantity
                };
      
            });
            res.render('orderdetails',{orderid:orderid, order:order,address:order.address[0],products:products});
        }
    }
    catch(error){
        res.render('error', { error: error.message });
    }
};
// update order status
const updateorderstatus=async(req,res)=>{
    try{
        const orderid=req.body.orderID;
        const status=req.body.status;
        let order;
        if(status==='Delivered'){
            order=await Order.updateOne({_id:orderid},{$set:{status:status,delivereddate:Date.now()}});
        }
        else{
            order=await Order.updateOne({_id:orderid},{$set:{status:status}});
        }
        if(order){
            res.send({isOk: true, message: ''});
        }else{
            res.send({isOk:false, message: 'error'});
        }
    }catch(error)
    {
        res.render('error', { error: error.message });
    }
};
