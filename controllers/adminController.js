
const User = require('../models/User_Model')
const Coupon = require('../models/coupon_model'); // Make sure this import comes before the function definition
const Admin = require('../models/admin_model')
const Products = require('../models/products_model')
const Order = require('../models/order_model')
const Category = require('../models/category_model')
const Banner = require('../models/banner_model')

const bcrypt = require('bcrypt')
const session = require('express-session')

const sharp = require('sharp');
const fs = require("fs");
const pdfmake = require("pdfmake");
 
const XLSX = require('xlsx');
 

 
 
// load admin login

const loadAdminLogin = async(req,res)=>{
    try {
        res.render('admin/login')
    } catch (error) {
        console.log(error.message);
    }
}

// load admin home


const loadAdminHome = async (req, res) => {
  try {

    const today = new Date(); // Get the current date

    // Get the start of the previous month
    const startPrevOfMonth = new Date(today);
    startPrevOfMonth.setMonth(startPrevOfMonth.getMonth() - 1);
    startPrevOfMonth.setDate(1); // Set the date to the 1st day of the month
    // Get the end of the previous month
    const endOfPrevMonth = new Date(today);
    endOfPrevMonth.setDate(0); 

    

    const totalAmountPrevMonth = await Order.aggregate([
      {
        $match: {
          status: { $nin: ["Cancelled"] },
          date: { $gte: startPrevOfMonth, $lte: endOfPrevMonth }, // Filter orders within the current month
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$grandTotal" },
        },
      },
    ]);
    console.log("Total Amount (Prev Mo): ", totalAmountPrevMonth[0]?.totalAmount || 0);
    
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1); // Start date of the current month
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0); // End date of the current month

    const totalAmountCurrentMonth = await Order.aggregate([
      {
        $match: {
          status: { $nin: ["Cancelled"] },
          date: { $gte: startOfMonth, $lte: endOfMonth }, // Filter orders within the current month
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$grandTotal" },
        },
      },
    ]);

    console.log("Total Amount (Current Month): ", totalAmountCurrentMonth[0]?.totalAmount || 0);


    ////////////////////////////////////////////////////////////////

                // PERCENTAGE

   
          const percentageChange = (((totalAmountCurrentMonth[0]?.totalAmount || 0) - (totalAmountPrevMonth[0]?.totalAmount || 0)) / (totalAmountPrevMonth[0]?.totalAmount || 0)) * 100;
          const formattedPercentageChange = percentageChange < 0 ? percentageChange.toFixed(2) + '%' : '+' + percentageChange.toFixed(2) + '%';
          
          console.log("Percentage Change: " + formattedPercentageChange);
                


 
    ////////////////////////////////////////////////////////////////

    

    
    const validOrderCount = await Order.countDocuments({ status: { $ne: "Cancelled" } });
    const validProductAmount = await Products.countDocuments( {  is_delete:false } );

    const totalAmountCOD = await Order.aggregate([
      {
        $match: {
          status: { $nin: ["Cancelled"] },
          payment_method: "cod" // Add the filter for payment_method "cod"
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$grandTotal" },
        },
      },
    ]);
    
    const totalAmountRazor = await Order.aggregate([
      {
        $match: {
          status: { $nin: ["Cancelled"] },
          payment_method: "Razorpay" // Add the filter for payment_method "cod"
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$grandTotal" },
        },
      },
    ]);
    
    console.log("Total Amount (RazorPay): ", totalAmountRazor[0]?.totalAmount || 0);
 

    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const date = currentDate.getDate();

    console.log(currentDate + "currentDate");


    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    const totalAmountToday = await Order.aggregate([
      {
        $match: {
          status: { $nin: ["Cancelled"] },
          date: { $gte: startOfToday },
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$grandTotal" },
        },
      },
    ]);

    console.log("Today's Total Amount: ", totalAmountToday[0]?.totalAmount || 0);

      
   
    const totalAmount = await Order.aggregate([
      {
        $match: {
          status: { $nin: ["Cancelled"] },
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$grandTotal" },
        },
      },
    ]);
    console.log("total amount: ", JSON.stringify(totalAmount));

    
    const formattedDate = currentDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const formattedTime = currentDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' });
  
    console.log(formattedDate + formattedTime +"formattedDate");
 
    res.render('admin/home', {validOrderCount:validOrderCount,
      totalAmount: totalAmount[0]?.totalAmount || 0,
       totalAmountToday: totalAmountToday[0]?.totalAmount || 0 ,
       totalAmountCOD:totalAmountCOD[0]?.totalAmount || 0,
       totalAmountRazor:totalAmountRazor[0]?.totalAmount || 0,
       totalAmountCurrentMonth: totalAmountCurrentMonth[0]?.totalAmount || 0,
       currentDate: formattedDate,
       currentTime: formattedTime,
       percentageChange:formattedPercentageChange,
       validProductAmount:validProductAmount
    });

  } catch (error) {
    console.log(error.message);
  }
}


// verify Admin login 

const verifyLogin = async(req,res)=>{
    try {
        const email=req.body.email;
        const password=req.body.password;

        const Admindata = await Admin.findOne({email:email})

        if(Admindata){

            const passwordMatch= await bcrypt.compare(password,Admindata.password)
            if(passwordMatch){

                    if(Admindata.is_admin===0){
                    res.render('admin/login',{message:'Email and password is incorrect'})
                    }else{
                    req.session.admin_id=Admindata._id
                    res.redirect('/admin/home')
                }
            }else{
                res.render('admin/login',{message:'Password is incorrect'})
            }

        }else{
            res.render('admin/login',{message:'Email and password is incorrect'})
        }
    } catch (error) {
        console.log(error.message);
    }
}

// logout

const logout = async(req,res)=>{
    try {
        req.session.destroy()
        res.redirect('/admin')
        
    } catch (error) {
        console.log(error.message);
    }

}


// list users

const listUsers= async(req,res)=>{
    try {
        const usersData = await User.find({is_verifed :1})

        res.render('admin/users/list-user',{users:usersData});
    } catch (error) {
        console.log(error.message);
    }
}



// load add product

const loadProductPage = async(req,res)=>{
    try {
        const CategoryData = await Category.find({is_Delete:false})
        res.render('admin/products/addProducts',{Category:CategoryData});
    } catch (error) {
        console.log(error.message);

    }
}

// const addProducts = async (req, res) => {
//   try {
   
//       const product =  new Products({
//         product_name: req.body.product_name,
//         image: req.files.map((file)=>file.filename),
//         brand: req.body.brand,
//         Category: req.body.Category,
//         size: req.body.size.split(',').map(size => size.trim()),
//         description: req.body.description,
//         price: req.body.price
//       });

//       const product_data = await product.save();
//       if (product_data) {
//           res.redirect('/admin/addProduct');
//           console.log('Product added successfully:');
//           console.log(product_data);
//         } else {
//           console.log('Error uploading product');
//         }
//         upload.single('image')(req, res, function (err) {
//           if (err) {
//             // Handle any upload error
//             console.log(err);
//             return;
//           }

//     });
//   } catch (error) {
//     console.log(error.message);
//   }
// };
// add product 

const addProducts = async (req, res) => {
  try {
    const product = new Products({
      product_name: req.body.product_name,
      brand: req.body.brand,
      Category: req.body.Category,
      size: req.body.size.split(',').map((size) => size.trim()),
      description: req.body.description,
      price: req.body.price,
      stock:req.body.Stock
    });

    const croppedImages = [];
    for (let file of req.files) {
      const croppedImage = `cropped_${file.filename}`;

      await sharp(file.path)
        .resize(1117, 1400,  { fit: "cover" })
        .toFile(`./public/product-images/${croppedImage}`);

      croppedImages.push(croppedImage);
    }

    product.image = croppedImages;

    const product_data = await product.save();
    if (product_data) {
      res.redirect('/admin/addProduct');
      console.log('Product added successfully:');
      console.log(product_data);
    } else {
      console.log('Error uploading product');
    }
  } catch (error) {
    console.log(error.message);
  }
};

  
// editProduct

const editProduct= async(req,res)=>{
    try {
 
        // req.files.map((file)=>file.filename)
        const id=req.body.id;
        const currentProduct = await Products.findOne({_id:id})
        const updationProduct={
            product_name: req.body.product_name,
            image:currentProduct.image,
            brand: req.body.brand,
            Category: req.body.Category,
            size: req.body.size.split(',').map(size => size.trim()),
            description: req.body.description,
            price: req.body.price,
        }

        if(req.files && req.files.length >0){
            updationProduct.image.push(...req.files.map((file) =>file.filename))
        }

        console.log("update aayitt makkale "+updationProduct);

         
        const newProduct = await Products.findByIdAndUpdate(
            {_id:id},
            { $set: updationProduct });
        if(newProduct){
                res.redirect('/admin/allProduct')
            }

    } catch (error) {
        console.log(error.message);
    }
}
 

//load all products

const loadAllProduct= async(req,res)=>{
    try {
        const ProductData = await Products.find({is_delete:false})

        res.render('admin/products/allproducts',{ Product:ProductData });
    } catch (error) {
        console.log(error.message);
    }
}



// load category list

const loadCategoryPage = async(req,res)=>{
    try {
        
        const CategoryData = await Category.find({is_Delete:false})
        console.log(CategoryData);
        console.log(CategoryData[0]._id+"<-------");
        const message = req.query.message

        res.render('admin/products/categoryList',{Category:CategoryData,message})
        
    } catch (error) {
        console.log(error.message);
    }
}
    
// add Category 

const addCategory = async(req,res)=>{
    try {
        const CategoryData = req.body.Category
       
        if(CategoryData==''){
            //value is empty
            var message= "Enter Category"
            res.redirect(`/admin/listCategory?message=${encodeURIComponent(message)}`)
        }else{
            // const CategoryCheck = await Category.findOne({Category: CategoryData})
            const Categorycheck = await Category.findOne({
                Category:{$regex : new RegExp(`^${CategoryData}$`,"i")}
            })
            if(!Categorycheck){
                var message= "Category is Added...✔"
                const CategoryAdd = new Category({
                    Category:CategoryData
                }).save();
                //category is Added
            res.redirect(`/admin/listCategory?message=${encodeURIComponent(message)}`);
            }else{

                //category is already exist
                 var message= "Category is Already Exist .."

                res.redirect(`/admin/listCategory?message=${encodeURIComponent(message)}`)
            }
        }

    } catch (error) {
        console.log(error.message);
    }
}

// load Edit Category
const  loadEditCategory = async(req,res)=>{
    try {
        const id=req.query.id;
        const categories = await Category.findOne({_id:id});
        console.log("cataaaaaaaaa.............."+categories.Category);
        res.render('admin/products/editCategory',{Category:categories})
        
    } catch (error) {
        console.log(error.message);
    }
}

// edit Category
const editCategory = async(req,res)=>{
try{
    const id=req.body.id;
  
    const UpdationData={
        Category:req.body.Category
    }
   
  
    const newCategory = await Category.findByIdAndUpdate(
        {_id:id},
        { $set: UpdationData });

        var message= "Category is Edit "
        if(newCategory){
            res.redirect(`/admin/listCategory?message=${encodeURIComponent(message)}`)
        }

   }catch(error){
   console.log(error.message);
  } 

};

// load edit product 
const loadEditProduct =async(req,res)=>{
    try {

        const id=req.query.id;
        const ProductData = await Products.findOne({_id:id});
    

        res.render('admin/products/editProduct',{Product:ProductData});
        
    } catch (error) {
        console.log(error.message);
    }
};

// delete Category
const  deleteCategory = async(req,res)=>{
    try {
        const id=req.query.id;
        const categories = await Category.findOne({_id:id});
        
         await Category.findByIdAndUpdate({_id:id},{ $set:{is_Delete:true}});
            console.log("cataaaaaaaaa.............."+categories.is_Delete);
        // const deleteCata = await Category.updateOne({})
        res.redirect('/admin/listCategory')
        
    } catch (error) {
        console.log(error.message);
    }
};

// deleteProduct

const  deleteProduct = async(req,res)=>{
    try {
        const id=req.query.id;
        const Product = await Products.findOne({_id:id});
        
         await Products.findByIdAndUpdate({_id:id},{ $set:{is_delete:true}});
            console.log("cataaaaaaaaa.............."+Product.is_delete)
        res.redirect('/admin/allProduct')
        
    } catch (error) {
        console.log(error.message);
    }
};

// delete image


const deleteImage = async (req, res) => {
    try {
      const id = req.query.id;
      const imageIndex = req.query.index;
  
      const productData = await Products.findOne({ _id: id });
  
      if (!productData) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      if (imageIndex < 0 || imageIndex >= productData.image.length) {
        return res.status(400).json({ message: 'Invalid image index' });
      }
  
      // Remove the image at the specified index from the product's images array
      productData.image.splice(imageIndex, 1);
      await productData.save();
  
      res.redirect('/admin/editProduct?id='+id);

    } catch (error) {
      console.log(error.message);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
 

// block user
const blockUser = async(req,res)=>{
    try {
        const id=req.query.id;
        const userData= await User.findOne({_id:id});

        await User.findByIdAndUpdate({_id:id},{$set:{is_blocked:true}});
        res.redirect('/admin/listUser')
      
    } catch (error) {
      console.log(error.message);
    }
};

  // unblock user
const unblockUser = async(req,res)=>{
    try {
        const id=req.query.id;
        const userData= await User.findOne({_id:id});

        await User.findByIdAndUpdate({_id:id},{$set:{is_blocked:false}});
        res.redirect('/admin/listUser')
      
    } catch (error) {
      console.log(error.message);
    }
}


// canecell product 
const cancelProduct = async (req, res) => {
    try {
      const productId = req.query.id; // Assuming you pass the product ID as a query parameter
  
      // Find the order that contains the specified product
      const order = await Order.findOneAndUpdate(
        { 'product.productid': productId },
        { $set: { 'product.$.status': 'Cancelled' } },
        { new: true }
      );
  
      if (!order) {
         console.log("Order not found");
      }
  
      console.log("Updated order:", order);
      res.redirect('/admin/listOrder');
    } catch (error) {
      console.log(error.message);
       
    }
  };
  
 //changeStatus updating in db according to ajax request coming from orderproductDetails.ejs file

const changeProductStatus = async (req, res) => {
  try {
    const productId = req.body.id;
    const orderStatus = req.body.status;

    const order = await Order.findOneAndUpdate(
      { 'product.productid': productId },
      { $set: { 'product.$.status': orderStatus } },
      { new: true }
    );

    if (!order) {
      console.log("Order not found");
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ message: 'Order status updated successfully' });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

 //changeStatus updating in db according to ajax request coming from orderproductDetails.ejs file

 const updateOrderStatus = async (req, res) => {
  try {
    const orderId = req.body.orderid;
    const orderStatus = req.body.status;

    console.log(orderId+"order id.......");

    const order = await Order.findOneAndUpdate(
      { _id: orderId },
      { 
        $set: { 
          
          'status': orderStatus  
        } 
      },
      { new: true }
    );

    if (!order) {
      console.log("Order not found");
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ message: 'Order status updated successfully' });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// canecell order  

const cancelOrder = async (req, res) => {
  try {
    const orderId = req.query.id; // Assuming you pass the order ID as a query parameter
    const orderDetails = await find({_id:id})
    const userid = orderDetails.userid

    console.log("userid......... "+userid+"  userid.....");

    // Find and update the order with the specified ID
    const order = await Order.findOneAndUpdate(
      { _id: orderId },
      {
        $set: {
          'status': 'Cancelled' // Update the status to "Cancelled"
        }
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    console.log("Updated order:", order);
    res.redirect('/admin/listOrder');
  } catch (error) {
    console.log(error.message);
    // Handle error response
    res.status(500).json({ message: 'Internal server error' });
  }
};


//load all products

const listOrder= async(req,res)=>{
    try {
       
       
        const orderData = await Order.find({});

        orderData.forEach(order => {
          console.log("Product array -------------> "+ order.product +" <------------- Product array");
        });
    
        const orderDetails = orderData.map(ord => {
          const orderDate = new Date(ord.date);
          const year = orderDate.getFullYear();
          const month = orderDate.getMonth() + 1;
          const date = orderDate.getDate();
    
          return {
            orderid: ord._id,
            name: ord.name,
            mobile: ord.address[0].mobile,
            grandTotal: ord.grandTotal,
            status: ord.status,
            payment_method: ord.payment_method,
            orderdate: `${date}/${month}/${year}`,
            delivery_date: ord.delivery_date,
            return: ord.return.status,
            product: ord.product // Include the product array
          };
        });


       

        res.render('admin/orders/listorders', { orderDetails: orderDetails });
       
    


        // if (orderdata.length > 0) {
        //     const orderDetails = orderdata.map(ord => {
        //         const orderDate = new Date(ord.date); // Convert orderdate to a Date object
        //         const year = orderDate.getFullYear();
        //         const month = orderDate.getMonth() + 1;
        //         const date = orderDate.getDate();
        
        //         return {
        //             orderid: ord._id,
        //             email: ord.email,
        //             mobile: ord.address[0].mobile,
        //             grandTotal: ord.grandTotal,
        //             status: ord.product[0].status,
        //             payment_method: ord.payment_method,
        //             orderdate: `${date}/${month}/${year}`,
        //             delivereddate: ord.delivereddate,
        //             return:ord.return.status
        //         };
        //     });
            // res.render('admin/orders/listorders', { orderDetails: orderDetails });
        // } else {
        //     // res.render('admin/orders/listorders', { message: 'No orders',orderdetails:'' });
        // }
        

     
    } catch (error) {
        console.log(error.message);
    }
}



// view order product details 
const viewOrderProduct = async (req, res) => {
  try {
    const orderData = await Order.find({}).populate('address'); // Populate both 'product.productid' and 'address'

    const orderDetails = orderData.map((ord) => {
      const orderDate = new Date(ord.date);
      const year = orderDate.getFullYear();
      const month = orderDate.getMonth() + 1;
      const date = orderDate.getDate();

      return {
        orderid: ord._id,
        name: ord.name,
        mobile: ord.address[0].mobile,
        grandTotal: ord.grandTotal,
        status: ord.product.status,
        payment_method: ord.payment_method,
        orderdate: `${date}/${month}/${year}`,
        delivery_date: ord.delivery_date,
        return: ord.return.status,
        product: ord.product, // Include the product array
        address: ord.address, // Include the address array
      };
    });

    const index = req.query.index;
    const order = orderDetails[index];

    if (!order) {
      console.log('Order not found');
      return res.status(404).json({ message: 'Order not found' });
    }

    const productIds = order.product.map((item) => item.productid);

    const products = await Products.find({ _id: { $in: productIds } });

    const productDetails = order.product.map((prod) => {
      const fetchedProduct = products.find(
        (p) => p._id.toString() === prod.productid.toString()
      );

      return {
        productid: prod.productid,
        quantity: prod.quantity,
        size: prod.size,
        total: prod.total,
        status: prod.status,
        image: fetchedProduct.image,
        product_name: fetchedProduct.product_name,
        brand: fetchedProduct.brand,
        description: fetchedProduct.description,
        price: fetchedProduct.price,
      };
    });

    const AddressDetails = order.address.map((add) => { 
      return {
        state: add.state,
        location: add.location,
        landmark: add.landmark,
        city: add.city,
        pincode: add.pincode,
        country: add.country,
        mobile: add.mobile,
      };
    });

    console.log("AddressDetails: ", AddressDetails);
    console.log("productDetails: ", productDetails);

    res.render('admin/orders/orderProductDetails', { order: order,Product: productDetails, AddressDetails: AddressDetails });

  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


  
// loading couponPage

  const loadcouponPage = async (req, res) => {
    try {
      const coupons = await Coupon.find(); 
      console.log("coupon ", coupons);
      res.render('admin/coupon/coupon', { Coupon: coupons });
    } catch (error) {
      console.log(error.message);
    }
  };

// Function to get the month name from a numeric month value
function getMonthName(month) {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  return months[month - 1];
}

// loading salesReport page 
const loadSaleReport = async (req, res) => {
  try {
    const orderData = await Order.find({ status: { $ne: "Cancelled" } });

    // Get all unique product IDs from all orders
    const productIds = Array.from(new Set(orderData.flatMap((order) => order.product.map((product) => product.productid))));

    // Find the products with matching IDs
    const prod = await Products.find({ _id: { $in: productIds } });

    // Create a Map to store product names with their IDs as keys
    const productMap = new Map(prod.map((product) => [product._id.toString(), product.product_name]));

    const orderDetails = orderData.map(ord => {
      const orderDate = new Date(ord.date);
      const year = orderDate.getFullYear();
      const month = getMonthName(orderDate.getMonth() + 1); // Get the month in words
      const date = orderDate.getDate();
      const formattedDate = `${date} ${month} ${year}`;

      const productsWithNames = ord.product.map(product => {
        const productName = productMap.get(product.productid.toString());
        return { ...product, product_name: productName };
      });

      return {
        orderid: ord._id,
        name: ord.name,
        mobile: ord.address[0].mobile,
        grandTotal: ord.grandTotal,
        status: ord.status,
        payment_method: ord.payment_method,
        orderdate: formattedDate,
        delivery_date: ord.delivery_date,
        return: ord.return.status,
        product: productsWithNames,
      };
    });

    res.render('admin/salesReport/salesReport', { orderDetails: orderDetails });
  } catch (error) {
    console.log(error.message);
    res.render('error-404', { message: error.message });
  }
};


const getSalesReportData = async (req, res) => {
  try {
    const fromDate = new Date(req.query.fromDate);
    const toDate = new Date(req.query.toDate);

    // Fetch order data for the specified date range using the aggregate pipeline
    const orderData = await Order.aggregate([
      {
        $match: {
          date: {
            $gte: new Date(new Date(fromDate).setHours(0, 0, 0)), // Start of the day
            $lte: new Date(new Date(toDate).setHours(23, 59, 59)), // End of the day
          },
          status: { $ne: "Cancelled" }, // Exclude orders with status "Cancelled"
        },
      },
    ]);

    // Get all unique product IDs from all orders
    const productIds = Array.from(new Set(orderData.flatMap((order) => order.product.map((product) => product.productid))));

    // Find the products with matching IDs
    const prod = await Products.find({ _id: { $in: productIds } });

    // Create a Map to store product names with their IDs as keys
    const productMap = new Map(prod.map((product) => [product._id.toString(), product.product_name]));

    // Prepare the orderDetails array with required data for rendering
    const orderDetails = orderData.map(ord => {
      const orderDate = new Date(ord.date);
      const year = orderDate.getFullYear();
      const month = getMonthName(orderDate.getMonth() + 1); // Get the month in words
      const date = orderDate.getDate();
      const formattedDate = `${date} ${month} ${year}`;

      const productsWithNames = ord.product.map(product => {
        const productName = productMap.get(product.productid.toString());
        return { ...product, product_name: productName };
      });

      return {
        orderid: ord._id,
        name: ord.name,
        mobile: ord.address[0].mobile,
        grandTotal: ord.grandTotal,
        status: ord.status,
        payment_method: ord.payment_method,
        orderdate: formattedDate,
        delivery_date: ord.delivery_date,
        return: ord.return.status,
        product: productsWithNames,
      };
    });

    // Respond with the combined data (orderDetails and salesReportResult)
    res.json({ orderDetails });
  } catch (error) {
    console.error('Error fetching sales report data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


// download in pdf

const downloadSalesReport = async (req, res) => {
  try {
    console.log(".......... the pdf ...........");
    let startY = 150;
    const writeStream = fs.createWriteStream("order.pdf");
    const printer = new pdfmake({
      Roboto: {
        normal: "Helvetica",
        bold: "Helvetica-Bold",
        italics: "Helvetica-Oblique",
        bolditalics: "Helvetica-BoldOblique",
      },
    });
    const order = await Order.find({ status: { $ne: "Cancelled" } })
      .lean()
      .exec();

    // Get all unique product IDs from all orders
    const productIds = Array.from(new Set(order.flatMap((orderdata) => orderdata.product.map((product) => product.productid))));

    // Find the products with matching IDs
    const prod = await Products.find({ _id: { $in: productIds } });

    // Create a Map to store product names with their IDs as keys
    const productMap = new Map(prod.map((product) => [product._id.toString(), product.product_name]));

    // Create an array to store product names for each order
    const productsWithNames = order.map(ord => {
      return ord.product.map(product => {
        const productName = productMap.get(product.productid.toString());
        return { ...product, product_name: productName };
      });
    });

 
    const totalAmount = await Order.aggregate([
      {
        $match: {
          status: { $nin: ["Cancelled"] },
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$grandTotal" },
        },
      },
    ]);

    const dateOptions = { year: "numeric", month: "long", day: "numeric" };
    // Create document definition
    const docDefinition = {
      content: [
        { text: "Active Kicks", style: "header" },
        { text: "\n" },
        { text: "Order Information", style: "header1" },
        { text: "\n" },
        { text: "\n" },
      ],
      styles: {
        header: {
          fontSize: 25,
          alignment: "center",
        },
        header1: {
          fontSize: 12,
          alignment: "center",
        },
        total: {
          fontSize: 20,
        },
        fonts: {
          RupeeFont: {
            normal: "RupeeFont-Regular.ttf", // Path to the custom font file (e.g., TTF or OTF format)
          },
        },
      },
    };

    // Create the table data
    const tableBody = [
      ["Index", "Ordered Date", "Customer name", "Payment Method", "Product Name",  "Status","Amount"], // Table header
    ];

    for (let i = 0; i < order.length; i++) {
      const data = order[i];
      const formattedDate = new Intl.DateTimeFormat("en-US", dateOptions).format(new Date(data.date));

      // Concatenate product names for each order
      const productNames = productsWithNames[i].map(prod => prod.product_name).join(", ");

      tableBody.push([
        (i + 1).toString(),
        formattedDate,
        data.name, // Assuming "name" field is used for "Customer name"
        data.payment_method,
        productNames,
        data.status,
        data.grandTotal, // Assuming "grandTotal" field is used for "Amount"
      ]);
    }

    const table = {
      table: {
        widths: ["auto", "auto", "auto", "auto", "auto", "*", "auto"],
        headerRows: 1,
        body: tableBody,
        alignment: "center", // Align the table at the center
      },
    };

    // Add the table to the document definition
    docDefinition.content.push(table);
    docDefinition.content.push([
      { text: "\n" },
      {
        columns: [
          { text: "\n" },
          { text: `Total: ${totalAmount[0]?.totalAmount || 0}`, style: "total" }, // Total amount with rupee symbol aligned to the right
        ],
        columnGap: 5, // Set a small column gap
      },
    ]);

    // Generate PDF from the document definition
    const pdfDoc = printer.createPdfKitDocument(docDefinition);

    // Pipe the PDF document to a write stream
    pdfDoc.pipe(writeStream);

    // Finalize the PDF and end the stream
    pdfDoc.end();

    writeStream.on("finish", () => {
      res.download("order.pdf", "order.pdf");
    });
  } catch (error) {
    console.log(error.message);
    res.render("error", { error: error.message });
  }
};


// download in excel 
 
const downloadSalesReportinExcel = async (req, res) => {
  try {
    const order = await Order.find({ status: { $ne: 'Cancelled' } }).lean().exec();

    // Get all unique product IDs from all orders
    const productIds = Array.from(new Set(order.flatMap(orderdata => orderdata.product.map(product => product.productid))));

    // Find the products with matching IDs
    const prod = await Products.find({ _id: { $in: productIds } });

    // Create a Map to store product names with their IDs as keys
    const productMap = new Map(prod.map(product => [product._id.toString(), product.product_name]));

    // Create an array to store product names for each order
    const productsWithNames = order.map(ord => {
      return ord.product.map(product => {
        const productName = productMap.get(product.productid.toString());
        return { ...product, product_name: productName };
      });
    });

    const totalAmount = await Order.aggregate([
      {
        $match: {
          status: { $nin: ["Cancelled"] },
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$grandTotal" },
        },
      },
    ]);

    const dateOptions = { year: "numeric", month: "long", day: "numeric" };
    // Create document definition
    const docDefinition = {
      content: [
        { text: "Active Kicks", style: "header" },
        { text: "\n" },
        { text: "Sales Report", style: "header1" },
        { text: "\n" },
        { text: "\n" },
      ],
      styles: {
        header: {
          fontSize: 25,
          alignment: "center",
        },
        header1: {
          fontSize: 12,
          alignment: "center",
        },
        total: {
          fontSize: 20,
        },
        fonts: {
          RupeeFont: {
            normal: "RupeeFont-Regular.ttf", // Path to the custom font file (e.g., TTF or OTF format)
          },
        },
      },
    };

    // Create the table data
    const tableBody = [
      ["Index", "Ordered Date", "Customer name", "Payment Method", "Product Name",  "Status","Amount"], // Table header
    ];

    for (let i = 0; i < order.length; i++) {
      const data = order[i];
      const formattedDate = new Intl.DateTimeFormat("en-US", dateOptions).format(new Date(data.date));

      // Concatenate product names for each order
      const productNames = productsWithNames[i].map(prod => prod.product_name).join(", ");

      tableBody.push([
        (i + 1).toString(),
        formattedDate,
        data.name, // Assuming "name" field is used for "Customer name"
        data.payment_method,
        productNames,
        data.status,
        data.grandTotal, // Assuming "grandTotal" field is used for "Amount"
      ]);
    }

    const table = {
      table: {
        widths: ["auto", "auto", "auto", "auto", "auto", "*", "auto"],
        headerRows: 1,
        body: tableBody,
        alignment: "center", // Align the table at the center
      },
    };


    // Create a new workbook
    const workbook = XLSX.utils.book_new();

    // Create a new worksheet
    const worksheet = XLSX.utils.json_to_sheet(tableBody, { header: tableBody[0] });

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sales Report');

    // Generate the Excel file in memory
    const excelFileBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    // Set the appropriate response headers for download
    res.set('Content-Disposition', 'attachment; filename="sales_report.xlsx"');
    res.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

    // Send the Excel file as a downloadable attachment
    res.send(excelFileBuffer);


  } catch (error) {
    console.error('Error generating Excel file:', error);
    res.status(500).send('Error generating Excel file');
  }
};

 



const addCoupon = async(req,res)=>{
  try {
    const coupon = new Coupon({
      couponCode: req.body.couponName,
      couponAmount: req.body.couponAmount,
      expireDate: req.body.expireDate,
      couponDescription: req.body.couponDescription,
      minimumAmount: req.body.minimumAmount,
      createdAt: new Date() 
    });
  const newCoupon = coupon.save();

  if(newCoupon){
    console.log('coupon added successfully.....');
    res.redirect('/admin/couponPage')
  }

  } catch (error) {
    console.log(error.message);
  }
}



const deleteCoupon = async(req,res)=>{
  try {
    const id=req.query.couponid;
    const BannerData = await Coupon.deleteOne({_id : id})

     res.redirect('/admin/couponPage');
    
  } catch (error) {
    console.log(error.message);
  }
}


const loadBannerManagement = async(req,res)=>{
  try {
     const BannerDetails = await Banner.find({})
     console.log(BannerDetails[0]._id+"<--id");

    res.render('admin/bannerMangement/banner',{BannerData:BannerDetails})

  } catch (error) {
    console.log(error.message);
  }
}

const activateBanner = async(req,res)=>{
  try {
    const bannerId = req.body.bannerId
    
    const BannerDetails = await Banner.findByIdAndUpdate({_id:bannerId},
      {$set:{status:"Active"}},
      {new:true})

    BannerDetails.save();
    console.log("Activated Banner successfully !!");
    res.redirect('/adminBanner')

  } catch (error) {
    console.log(error.message);
  }
}

const inActivateBanner = async(req,res)=>{
  try {

   const bannerId = req.body.bannerId
   
    const BannerDetails = await Banner.findByIdAndUpdate({_id:bannerId},
    { $set: { status: "Inactive" } },
    { new: true })

    BannerDetails.save();
    console.log("InActivate Banner successfully !!");

    res.redirect('/adminBanner')
    
  } catch (error) {
    console.log(error.message);
  }
}

// add banner post

const addBanner = async(req,res)=>{
  try {
    const BannerData = new Banner({
      bannerName:req.body.bannername,
      status:req.body.status,
    })

    if(req.files && req.files.length >0){
      BannerData.image.push(...req.files.map((file) =>file.filename))
    }

    const BannerDetails = await BannerData.save();

    console.log("Banner Data : ---> "+BannerDetails+ "<---- : Banner Data" );

    console.log("<----Banner Added successfully-----> ");

    res.redirect('/admin/Banner');

    
  } catch (error) {
    console.log(error.message);
  }
}
 
// delete banner 

const  deleteBanner = async(req,res)=>{
  try {
      const id=req.query.bannerid;
      const BannerData = await Banner.deleteOne({_id : id})
      
       res.redirect('/admin/Banner');
      
  } catch (error) {
      console.log(error.message);
  }
};



module.exports={

    loadAdminLogin,
    loadAdminHome,
    verifyLogin,
    logout,
    listUsers,
    blockUser,
    loadProductPage,
    addProducts,
    loadAllProduct,
    loadCategoryPage,
    addCategory,
    loadEditCategory,
    editCategory,
    deleteCategory ,
    unblockUser,
    loadEditProduct,
    editProduct,
    deleteProduct,
    deleteImage,
    listOrder,
    cancelOrder,
    viewOrderProduct,
    cancelProduct,
    changeProductStatus,
    updateOrderStatus,
    loadcouponPage,
    addCoupon,
    deleteCoupon,
    loadSaleReport,
    getSalesReportData,
    downloadSalesReport,
    loadBannerManagement,
    addBanner,
    activateBanner,
    inActivateBanner,
    deleteBanner,
    downloadSalesReportinExcel
}