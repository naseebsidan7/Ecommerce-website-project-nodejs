const User = require('../models/User_Model')
const Products = require('../models/products_model')
const Category = require('../models/category_model')
const Order = require('../models/order_model')
const Banner = require('../models/banner_model')

const bcrypt=require('bcrypt')
const nodemailer=require('nodemailer')
const session = require('express-session')

const Cart = require('../models/cart_model');
const { render } = require('ejs')
 



       /// ------ Registeration process -----> 

// load Signup Page

const loadRegister = async(req,res)=>{
  try {
      res.render('users/signup');

  } catch (error) {
      console.log(error.message);
      res.status(500).json({ error: 'An error occurred during registration' });
  }
}

// storing signup data 
const insertUser= async(req,res)=>{
  try {
      const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
      
      const userData= await User.findOne({email:req.body.email})
      if(userData){
          res.render('users/signup',{message:"Email is already Registered"});
      }
      else if(req.body.password !== req.body.rpassword ){
          res.render('users/signup',{message:"Passwords don't match. Please verify."});
      }
      else{
        
        if (!strongPasswordRegex.test(req.body.password)) {
          return res.render("users/signup", {
            message:
              "Your Password must contain at Least 8 characters, including Letters, Numbers",
          });
        }

        let characters =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let referralCode = "";

        for (let i = 0; i < 20; i++) {
          let randomIndex = Math.floor(Math.random() * characters.length);
          referralCode += characters.charAt(randomIndex);
        }

      const spassword = await securePassword(req.body.password)
      const user = new User({
          name:req.body.name,
          email:req.body.email,
          mobile:req.body.mobile,
          password:spassword,
          rpassword:req.body.rpassword,
          is_admin:0,
          referralcode: referralCode,
      });

      const userData = await user.save();

      if (req.body.referralCode) {
        const enteredReferralCode = req.body.referralCode;
        const referredUser = await User.findOne({
          $and: [
            { referralcode: enteredReferralCode },
            { referralCodeUsed: 0 }
          ]
        });
        
             
        if (referredUser) {
          referredUser.wallet += 100;
          referredUser.referralCodeUsed = 1;
          await referredUser.save();
        } else{
          console.log("Referral is already used");
        }
      }

      if(userData){
          sendVerifyMail(req.body.name,req.body.email,user._id)
          res.render('users/signup',{message:"Your Registeration has been successfull,Please Verify your mail"})
      }else{
          res.render('users/signup',{message:"Your Registeration has been failed"})
      }
  }

  } catch (error) {

      console.log('Error Registering user'+error.message);
       

  }
}

       /// ------ Registeration process End -----> 






      /// ------ Extra Functions  -----> 

// hashing 

const securePassword = async(password)=>{
    try {
        const passwordHash = await bcrypt.hash(password,10);
        return passwordHash;

    } catch (error) {
        console.log(error.message)
    }
}

// send verification mail

const sendVerifyMail = async (name,email,id)=>{
    try {
       const transporter =  nodemailer.createTransport({
            host:'smtp.gmail.com',
            port:587,
            secure:false,
            requireTLS:true,
            auth:{
                user:"naseebsidan6@gmail.com",
                pass:"iitzubytvlydinzu"
            }
        });

        const mailOptions={
            from:"naseebsidan6@gmail.com",
            to:email,
            subject:"For verification mail",
            html:'<p>Hi.. '+name+', please Click Here to <a href=" http://localhost:3000/verify?id='+id+' "> Verify </a> your mail.</p>'
        }
        
        transporter.sendMail(mailOptions, function(error,info){
            if (error) {
                console.log(error);
            } else {
                console.log('Email has been sent: ',info.response);
            }
        })

    } catch (error) {
        console.log(error.message);
    }
}

//getMonthName

function getMonthName(month) {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  return months[month - 1];
}

// verifing mail

const verifymail = async(req,res)=>{
    try {
       const updateInfo = await User.updateOne({_id:req.query.id},{$set:{is_verifed:1}})
       console.log(updateInfo);
       res.render('users/login')
    } catch (error) {
        console.log(error.message);
    }
}

      /// ------ Extra Functions End -----> 







      /// ------ login Process  -----> 


// render login

const loadLogin = async(req,res)=>{
    try {
        res.render('users/login');
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: 'An error occurred during login page' });
    }
}

// verifing the user  

const verifyLogin = async(req,res)=>{
    try {
     
        const email=req.body.email;
        const password=req.body.password;

        const userData = await User.findOne({email:email});
        if(userData){

        const passwordMatch=await bcrypt.compare(password,userData.password)
          if(passwordMatch){
            console.log('dsdsjvdzghxcvzxcvzcxgvcnzgcvbxzgf');

            if(userData.is_blocked===true){
                res.render('users/login',{message:"your Account has been blocked"})
           
              }else if(userData.is_verifed===0){
                     
                res.render('users/login',{message:"Please verify your mail"})
                     
                 }else{   
                      req.session.user_id=userData._id ; 
                                      
                    //   res.redirect('/home',{userid:id})
                    res.redirect('/home');

                 }

         }else{
                res.render('users/login',{message:"password is incorrect"})
            }

        }else{
            res.render('users/login',{message:"Email and password is incorrect"})
        }

    } catch (error) {
        console.log(error.message);
    }
}

       /// ------ login Process  -----> 




       /// ------ logout Process  -----> 

// user logout
const userLogout = async(req,res)=>{
  try {
      req.session.destroy();
      res.redirect('/')
  } catch (error) {
      console.log(error.message);
  }
}

       /// ------ logout Process End -----> 




       

// render home 

const loadHome = async (req, res) => {
  try {
    const userId = req.session.user_id;
    console.log("edaaa user id" + userId);

    let cartProducts = [];
    let finalAmount = 0;

    const cart = await Cart.findOne({ userid: userId })
      .populate('product.productid')
      .lean()
      .exec();

    if (cart) {
      cartProducts = cart.product.map((item) => {
        const total =
          Number(item.quantity) * Number(item.productid.price);

        return {
          _id: item.productid._id.toString(),
          name: item.productid.product_name,
          price: item.productid.price,
          image: item.productid.image[0],
          quantity: item.quantity,
          size: item.size,
          total: total
        };
      });

      const total = cartProducts.reduce(
        (sum, product) => sum + Number(product.total),
        0
      );

      finalAmount = total;
    }

    const ProductData = await Products.find({ is_delete: false });
    const BannerDetails = await Banner.find({status:"Active"})

    res.render('users/home', {
      finalAmount: finalAmount,
      cartProducts: cartProducts,
      ProductData: ProductData,
      userId:userId,
      BannerDetails:BannerDetails
    });

  } catch (error) {
    console.log(error.message);
  }
};

// render home 

const loadcontact = async (req, res) => {
  try {
    const userId = req.session.user_id;
     

    let cartProducts = [];
    let finalAmount = 0;

    const cart = await Cart.findOne({ userid: userId })
      .populate('product.productid')
      .lean()
      .exec();

    if (cart) {
      cartProducts = cart.product.map((item) => {
        const total =
          Number(item.quantity) * Number(item.productid.price);

        return {
          _id: item.productid._id.toString(),
          name: item.productid.product_name,
          price: item.productid.price,
          image: item.productid.image[0],
          quantity: item.quantity,
          size: item.size,
          total: total
        };
      });

      const total = cartProducts.reduce(
        (sum, product) => sum + Number(product.total),
        0
      );

      finalAmount = total;
    }
 

    res.render('users/contact', {
      finalAmount: finalAmount,
      cartProducts: cartProducts,
      userId:userId 
    });

  } catch (error) {
    console.log(error.message);
  }
};

//load all product

const loadAllProduct = async (req, res) => {
  try {
    const pageNo = parseInt(req.query.pageNO) || 1;
    const pageSize = 12;   // Number of products per page
    const filterData = req.query.filter || 'default';;
    const pageNumber = pageNo;  
  
    const filterClassMap = {
      'default': 'defaultFilter',
      'newness': 'newnessFilter',
      'low-high': 'lowHighFilter',
      'high-low': 'highLowFilter',
    };
    const activeFilterClass = filterClassMap[filterData];

    console.log(filterData+"<----filterData");
    let  sort ={};
     

    if(filterData === "high-low"){
        sort= { price : -1 }
        console.log("sort is changed to", JSON.stringify(sort));
    }else if(filterData === "low-high"){
        sort= { price : 1 }
        console.log("sort is changed to", JSON.stringify(sort));
    }else if(filterData === "newness"){
        sort= { _id : -1 }
    }

    console.log(JSON.stringify(sort) +"sort current situation");

    const ProductData = await Products.find({ is_delete: false }).skip((pageNumber - 1) * pageSize)
    .limit(pageSize)
    .sort(sort)



    const CategoryData = await Category.find({ is_Delete: false });

    const userId = req.session.user_id;
    console.log("edaaa user id" + userId);
    const cart = await Cart.findOne({ userid: userId })
      .populate('product.productid')
      .lean()
      .exec();



    let cartProducts = [];
    let finalAmount = 0;

    if (cart && cart.product) {
      cartProducts = cart.product.map((item) => {
        const total = Number(item.quantity) * Number(item.productid.price);

        return {
          _id: item.productid._id.toString(),
          name: item.productid.product_name,
          price: item.productid.price,
          image: item.productid.image[0],
          quantity: item.quantity,
          size: item.size,
          total: total,
        };
      });

      finalAmount = cartProducts.reduce(
        (sum, product) => sum + Number(product.total),
        0
      );
    }

    const totalProducts = await Products.countDocuments({ is_delete: false });
    const totalPages = Math.ceil(totalProducts / pageSize);

    res.render('users/allProducts', {
      cartProducts: cartProducts,
      finalAmount: finalAmount,
      ProductData: ProductData,
      Category: CategoryData,
      activeFilterClass: activeFilterClass,
      currentPage: pageNo,
      totalPages: totalPages,
    });

  } catch (error) {
    console.log(error.message);
    
    res.render('error', { error: 'An error occurred while loading the products.' });
  }
};

 



//loading otp login

const loadOtpLogin= async(req,res)=>{
    try {
        res.render('users/otp')
        
    } catch (error) {
        console.log(error.message);
    }
}


// load forgot password page

const forgotPassword = async (req,res)=>{
  try {
   
    res.render('users/forgetPass')
  } catch (error) {
    console.log(error.message);
  }
}

// newPassword post 

const newPassword = async(req,res)=>{
  try {

    const email=req.body.email;
    const NewPasswordAgain=req.body.NewPasswordAgain;
    const NewPassword=req.body.NewPassword;
     
    if(NewPasswordAgain !== NewPassword ){
      res.render('users/newPassword',{email:email, message:"Passwords don't match. Please verify."})
     console.log("it is not matching ....");
    }else{

    const spassword = await securePassword(NewPassword)
      
    const newPass= await User.updateOne({email:email},{$set:{password:spassword}})

    console.log("user Data"+newPass);
     res.render('users/login')
    }
  } catch (error) {
    console.log(error.message);
  }
}


//mailing function

const otpVerifyMail= async(username, email, otp)=>{
        try {
            const transporter= nodemailer.createTransport({
                host:'smtp.gmail.com',
                port:587,
                secure:false,
                requireTLS:false,
                auth:{
                    user:"naseebsidan6@gmail.com",
                    pass:"iitzubytvlydinzu"
                }
            })
            const mailOptions={
                from:"naseebsidan6@gmail.com",
                to:email,
                subject: 'For OTP login',
                html:'<p>Dear ' +username+',Your OTP is <a>' +otp+'</a> </p>'
            }
            transporter.sendMail(mailOptions,function(error,info){
                if(error){
                    console.log(error);
                }else{
                    console.log("Email has been sent :-",info.response);
                }
            })
    

        } catch (error) {
            console.log(error.message);
        }
}

//user sending Email to  company (Contact page form)

const sendEmailContact = async(req,res)=>{
  try {

    const userEmail = req.body.userEmail;
    const message = req.body.msg;

    console.log(userEmail+" <== user Email id ");
    console.log(message+" <== user message ")



    const transporter = nodemailer.createTransport({
      host:'smtp.gmail.com',
      port:587,
      secure:false,
      requireTLS:false,
      
      auth:{
        user:'naseebsidan6@gmail.com',
        pass:'iitzubytvlydinzu',
        
      }
    });

    const mailInfo = {
      from:userEmail,
      to:'naseebsidan6@gmail.com',
      subject: 'New message From Active Kicks User',
     
      html: `<h4>User Email id : ${userEmail}, <br><br>The message : <br>
      <span style="color: #d9414e; font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;font-size: 13px;">${message}</span>
    </h4>`    };


    transporter.sendMail(mailInfo,function (error, success) {
      if (error) {
        console.log('SMTP Connection Error: ', error);
      } else {
        console.log(" Message From User is sented Active Kicks Successfully !!");
        console.log(success.response);
      }
    })
   

    res.redirect('/contact')
    
  } catch (error) {
    console.log(error.message);
    res.render('error-404')
  }
}

// sending otp for login

const otpSend= async(req,res)=>{
    try {
        const userMail = await User.findOne({ email:req.body.email})
        if(userMail){
            let OTP=""
            let digits='0123456789'
            for(let i=0;i<6;i++){
                OTP += digits[Math.floor(Math.random() *10)]
            }
            const updatedUser= await User.updateOne({email: req.body.email},{$set:{otp:OTP} })
            otpVerifyMail(userMail.name,userMail.email,OTP)
            res.render('users/otpSend')
        }else{
            res.render('users/otp',{message:'Invalid Mail Id'})
        }
    } catch (error) {
        console.log(error.message);
    }
}

// sending otp for forgot

const forgetpageEmail= async(req,res)=>{
  try {
      const email =req.body.email
      const userMail = await User.findOne({ email:req.body.email})
      if(userMail){
          let OTP=""
          let digits='0123456789'
          for(let i=0;i<6;i++){
              OTP += digits[Math.floor(Math.random() *10)]
          }
          const updatedUser= await User.updateOne({email: req.body.email},{$set:{otp:OTP} })
          otpVerifyMail(userMail.name ,userMail.email,OTP)
          res.render('users/otpEnterForgot',{email:email})
      }else{
          res.render('users/otp',{message:'Invalid Mail Id'})
      }
  } catch (error) {
      console.log(error.message);
  }
}


// verifing Otp post requset

const verifyOtp = async (req,res)=>{
    try {
        let OTP= req.body.otp;
        let userData = await User.findOne({ otp:OTP })

        if(userData){
            req.session.user_id=userData._id; 
            res.redirect('/home')
        }else{
            res.render('users/otpSend',{message:"OTP is invalid"})
        }


    } catch (error) {
        console.log(error.message);
    }
}

//  forgot password otp post req

const verifyOtpforgot = async (req,res)=>{
  try {
      const email = req.body.email;
      let OTP= req.body.otp;
      let userData = await User.findOne({ otp:OTP })

      if(userData){
          req.session.user_id=userData._id; 
           res.render('users/newPassword',{email:email})
      }else{
          res.render('users/forgetPass',{message:"OTP is invalid"})
      }


  } catch (error) {
      console.log(error.message);
  }
}







// product details page load

const productDetails = async (req, res) => {
  try {
    const id = req.query.id;
    const ProductData = await Products.findOne({ _id: id });
    const findbrand = ProductData.brand;

    const allProductsData = await Products.find({
      $and:[ {brand: findbrand},{is_delete:false}] });

    const userId = req.session.user_id;
    console.log("edaaa user id" + userId);
    const cart = await Cart.findOne({ userid: userId })
      .populate('product.productid')
      .lean()
      .exec();

    let cartProducts = [];
    let finalAmount = 0;

    if (cart && cart.product) {
      cartProducts = cart.product.map((item) => {
        const total = Number(item.quantity) * Number(item.productid.price);

        return {
          _id: item.productid._id.toString(),
          name: item.productid.product_name,
          price: item.productid.price,
          image: item.productid.image[0],
          quantity: item.quantity,
          size: item.size,
          total: total,
        };
      });

      finalAmount = cartProducts.reduce(
        (sum, product) => sum + Number(product.total),
        0
      );
    }

    res.render('users/productDetails', {
      cartProducts: cartProducts,
      finalAmount: finalAmount,
      Product: ProductData,
      allProducts: allProductsData,
    });
    
  } catch (error) {
    console.log(error.message);
    // Handle the error appropriately (e.g., show an error page)
    res.render('error', { error: 'An error occurred while loading the product details.' });
  }
};


// load the user profile page

const loadUserProfile = async (req, res) => {
  try {
    const userId = req.session.user_id;
    console.log("edaaa user id" + userId);
    const cart = await Cart.findOne({ userid: userId })
      .populate('product.productid')
      .lean()
      .exec();

    let cartProducts = [];
    let finalAmount = 0;

    if (cart && cart.product) {
      cartProducts = cart.product.map((item) => {
        const total = Number(item.quantity) * Number(item.productid.price);

        return {
          _id: item.productid._id.toString(),
          name: item.productid.product_name,
          price: item.productid.price,
          image: item.productid.image[0],
          quantity: item.quantity,
          size: item.size,
          total: total,
        };
      });

      finalAmount = cartProducts.reduce(
        (sum, product) => sum + Number(product.total),
        0
      );
    }

    const userData = await User.findOne({ _id: req.session.user_id });

    let addressDetails = [];
    if (userData && userData.address) {
      addressDetails = userData.address.map((data) => {
        return {
          state: data.state,
          landmark: data.landmark,
          location: data.location,
          pincode: data.pincode,
          mobile: data.mobile,
          country: data.country,
          city: data.city,
          id: data._id,
        };
      });
    }

    res.render('users/userProfile', {
      cartProducts: cartProducts,
      finalAmount: finalAmount,
      userData: userData,
      addressDetails: addressDetails,
    });
  } catch (error) {
    console.log(error.message);
    // Handle the error appropriately (e.g., show an error page)
    res.render('error', { error: 'An error occurred while loading the user profile.' });
  }
};


// load add address page 

const loadaddAddress = async (req, res) => {
  try {
    const userId = req.session.user_id;
    console.log("edaaa user id" + userId);
    const cart = await Cart.findOne({ userid: userId })
      .populate('product.productid')
      .lean()
      .exec();

    let cartProducts = [];
    let finalAmount = 0;

    if (cart && cart.product) {
      cartProducts = cart.product.map((item) => {
        const total = Number(item.quantity) * Number(item.productid.price);

        return {
          _id: item.productid._id.toString(),
          name: item.productid.product_name,
          price: item.productid.price,
          image: item.productid.image[0],
          quantity: item.quantity,
          size: item.size,
          total: total,
        };
      });

      finalAmount = cartProducts.reduce(
        (sum, product) => sum + Number(product.total),
        0
      );
    }

    const id = req.session.user_id;
    const userData = await User.findOne({ _id: id });

    res.render('users/addAddress', {
      cartProducts: cartProducts,
      finalAmount: finalAmount,
      userData: userData,
    });
  } catch (error) {
    console.log(error.message);
    // Handle the error appropriately (e.g., show an error page)
    res.render('error', { error: 'An error occurred while loading the add address page.' });
  }
};

// add address

const addAddress = async(req,res)=>{
    try {

        const id= req.session.user_id
        const user= await User.findById({ _id:id })
        const address = req.body

       user.address.push({
            location:address.location,
            landmark:address.landmark,
            country:address.country,
            city:address.city,
            pincode:address.pincode,
            mobile:address.mobile,
            state:address.state
        });

        await user.save()

 
        
           res.redirect('/userProfile')
    
        
    } catch (error) {
        console.log(error.message);
    }
}


// load editAddress page

const editAddresspage = async (req, res) => {
  try {
    const userId = req.session.user_id;
    console.log("edaaa user id" + userId);
    const cart = await Cart.findOne({ userid: userId })
      .populate('product.productid')
      .lean()
      .exec();

    let cartProducts = [];
    let finalAmount = 0;

    if (cart && cart.product) {
      cartProducts = cart.product.map((item) => {
        const total = Number(item.quantity) * Number(item.productid.price);

        return {
          _id: item.productid._id.toString(),
          name: item.productid.product_name,
          price: item.productid.price,
          image: item.productid.image[0],
          quantity: item.quantity,
          size: item.size,
          total: total,
        };
      });

      finalAmount = cartProducts.reduce(
        (sum, product) => sum + Number(product.total),
        0
      );
    }

    const userData = await User.findOne({ _id: req.session.user_id });
    const index = req.query.index;

    if (!userData || index >= userData.address.length) {
      // User or address index not found, handle the error or redirect to an error page
      return res.status(404).send('User or address not found');
    }

    const addressDetails = userData.address[index];

    res.render('users/editAddress', {
      cartProducts: cartProducts,
      finalAmount: finalAmount,
      addressDetails: addressDetails,
      userData: userData,
      index: index,
    });
  } catch (error) {
    console.log(error.message);
    // Handle the error appropriately (e.g., show an error page)
    res.render('error', { error: 'An error occurred while loading the edit address page.' });
  }
};


// editAddress

const editAddress = async (req, res) => {
    try {
      const id = req.session.user_id;
      const index = req.body.index;
  
      const userData = await User.findOne({ _id: id });
      const address = userData.address[index];
  
      console.log('Address to be updated:', address);
  
      const updationData = {
        location: req.body.location,
        landmark: req.body.landmark,
        country: req.body.country,
        city: req.body.city,
        pincode: req.body.pincode,
        mobile: req.body.mobile,
        state: req.body.state
      };
  
      userData.address[index] = updationData; // Update the array element
  
      const newAddress = await userData.save(); // Save the updated document
      
      console.log('Updated address:', newAddress);
  
      if (newAddress) {
        res.redirect('/userProfile');
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  

// delete Address 

const deleteAddress = async (req, res) => {
  try {
    const id = req.session.user_id;
    const index = req.query.index;

    const userData = await User.findOne({ _id: id });
    const address = userData.address[index];

    console.log('Address to be deleted:', address);

    userData.address.pull(address); // Remove the array element

    const newAddress = await userData.save(); // Save the updated document

    console.log('Updated address:', newAddress);

    if (newAddress) {
      res.redirect('/userProfile');
    }
  } catch (error) {
    console.log(error.message);
  }
};



// searching the  product function (all product page)

const searchProduct = async(req,res)=>{
   try {

          // const ProductData = await Products.find({is_delete:false})
          let search=req.query.search
          let searchRegex = new RegExp(search,'i')
          
          const searchedProduct = await Products.find({
            product_name: { $regex: searchRegex },
            is_delete: false
          }).lean();

    
        const pageNo = parseInt(req.query.pageNO) || 1;
        const pageSize = 12;   // Number of products per page
        const filterData = req.query.filter || 'default';;
        const pageNumber = pageNo;  
      
        const filterClassMap = {
          'default': 'defaultFilter',
          'newness': 'newnessFilter',
          'low-high': 'lowHighFilter',
          'high-low': 'highLowFilter',
        };
        const activeFilterClass = filterClassMap[filterData];
    
        console.log(filterData+"<----filterData");
        let  sort ={};
         
    
        if(filterData === "high-low"){
            sort= { price : -1 }
            console.log("sort is changed to", JSON.stringify(sort));
        }else if(filterData === "low-high"){
            sort= { price : 1 }
            console.log("sort is changed to", JSON.stringify(sort));
        }else if(filterData === "newness"){
            sort= { _id : -1 }
        }
    
        console.log(JSON.stringify(sort) +"sort current situation");
    
        const ProductData = await Products.find({ is_delete: false }).skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .sort(sort)
    
    
    
        const CategoryData = await Category.find({ is_Delete: false });
    
        const userId = req.session.user_id;
        console.log("edaaa user id" + userId);
        const cart = await Cart.findOne({ userid: userId })
          .populate('product.productid')
          .lean()
          .exec();
    
    
    
        let cartProducts = [];
        let finalAmount = 0;
    
        if (cart && cart.product) {
          cartProducts = cart.product.map((item) => {
            const total = Number(item.quantity) * Number(item.productid.price);
    
            return {
              _id: item.productid._id.toString(),
              name: item.productid.product_name,
              price: item.productid.price,
              image: item.productid.image[0],
              quantity: item.quantity,
              size: item.size,
              total: total,
            };
          });
    
          finalAmount = cartProducts.reduce(
            (sum, product) => sum + Number(product.total),
            0
          );
        }
    
        const totalProducts = await Products.countDocuments({ is_delete: false });
        const totalPages = Math.ceil(totalProducts / pageSize);
    
        res.render('users/allProducts', {
          cartProducts: cartProducts,
          finalAmount: finalAmount,
          ProductData: ProductData,
          Category: CategoryData,
          activeFilterClass: activeFilterClass,
          currentPage: pageNo,
          totalPages: totalPages,
          ProductData:searchedProduct
        });


   } catch (error) {
      console.log(error.message);
   }

}


 

// // Display the cart page
const showCart = async (req, res) => {
  try {
    const userId = req.session.user_id;
    console.log("edaaa user id" + userId);
    const cart = await Cart.findOne({ userid: userId })
      .populate('product.productid')
      .lean()
      .exec();

    const user = await User.findOne({ _id: userId });
    const address = user.address;

    console.log("users Address is heree.........." + address);

    console.log("edaaa Carttt........" + JSON.stringify(cart));

    if (!cart || cart.product.length === 0) {
      return res.render('users/cart', { address: address, cartProducts: '', total: '0', finalAmount: '0' });
    }

    const cartProducts = cart.product.map((item) => {
      const total = Number(item.quantity) * Number(item.productid.price);

      return {
        _id: item.productid._id.toString(),
        name: item.productid.product_name,
        price: item.productid.price,
        image: item.productid.image[0],
        quantity: item.quantity,
        size: item.size,
        total: total,
      };
    });

    const total = cartProducts.reduce((sum, product) => sum + Number(product.total), 0);

    const finalAmount = total.toFixed(2);

    const grandTotal = cart.grandTotal.toFixed(2);

    console.log("cartProducts..............." + JSON.stringify(cartProducts));
    console.log("total amount..........." + total);
    console.log("final amount..........." + finalAmount);
    console.log(" grandTotal..........." + grandTotal);

    res.render('users/cart', { address: address, cartProducts: cartProducts, total: total, finalAmount: finalAmount });

  } catch (error) {
    console.log(error.message);
    res.render('error');
  }
};



// Add a product to the cart

const addtocart = async (req, res) => {
    try {
    
      console.log("ivideee ethi............");
      const userId = await req.session.user_id;

      if (userId === undefined ) {
        res.send({ ok: false });
        console.log("User not logged in, Add to cart button clicked");
        

      } else {

      const proid = req.body.id;
      const prosize = req.body.size;
      const productPrice = req.body.price;
      const quantity = parseInt(req.body.qnty);
  
      console.log("product inte price" + productPrice);
      console.log("product id yum product size um  pinne qnty  " + proid, prosize, quantity);
  
      console.log("type of qnty " + typeof(quantity));
  
      const product = await Products.findOne({ _id: proid });
      let cart = await Cart.findOne({ userid: userId });
  
      if (!cart) {
        // If cart does not exist, create a new one
        const newCart = new Cart({
          userid: userId,
          product: [],
          grandTotal: 0, // Add a new field to store the grand total
        });
  
        cart = await newCart.save();
      }
  
      const existingproductindex = cart?.product.findIndex(
        (item) => item.productid == proid && item.size == prosize
      );
  
      console.log("product exist" + existingproductindex);
  
      if (existingproductindex == -1) {
        // Product does not exist in the cart, add it
        cart.product.push({ productid: proid, quantity: quantity, size: prosize, total: productPrice });
      } else {
        // Product already exists in the cart, update the quantity
        cart.product[existingproductindex].quantity += quantity;
        cart.product[existingproductindex].size = req.body.size;
        cart.product[existingproductindex].total = req.body.price;
      }
  
      // Update the grand total
      const productTotal = cart.product.reduce((total, item) => {
        return total + parseFloat(item.total);
      }, 0);
  
      const grandTotal = productTotal  ; // Add the delivery charge (90) to the product total
  
      cart.grandTotal = grandTotal;
      await cart.save();
  
      res.send({ ok: true });
    }

    } catch (error) {
      console.log(error.message);
      res.render('error');
    }
  };
  

// update the cart qnty and price according to user's action (ajax)

const updateCart = async (req, res) => {
    try {
      const { productId, quantity, totalPrice, finalAmount } = req.body;
      console.log("proid, qnty, total price, final amount: ", productId, quantity, totalPrice, finalAmount);
  
      const userId = req.session.user_id;
       const finalAmnt=finalAmount
      const updatedCart = await Cart.findOneAndUpdate(
        { userid: userId, 'product.productid': productId },
        { $set: { 'product.$.quantity': quantity, 'product.$.total': totalPrice }, grandTotal: finalAmnt },
        { new: true }
      );
  
      await updatedCart.save();
  
      console.log({ message: 'Cart updated successfully' });
    } catch (error) {
      console.error(error.message);
      console.log({ error: 'An error occurred while updating the cart' });
    }
  };
  


// Controller action to get the address data based on the selected index

const getAddress = async (req, res) => {
  const { index } = req.query;

  try {
    const user = await User.findById(req.session.user_id); // Assuming you have user authentication implemented and req.user is available

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (index < 0 || index >= user.address.length) {
      return res.status(400).json({ message: 'Invalid address index' });
    }

    const address = user.address[index];

    // Return the address data
    return res.status(200).json({
      location: address.location,
      landmark: address.landmark,
      state: address.state,
      city: address.city,
      pincode: address.pincode,
      mobile: address.mobile,
      country: address.country
    });

  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: 'Server error' });
  }
};


// load checkout page 
const showCheckout = async (req, res) => {
  try {
    const userId = req.session.user_id;
    console.log("edaaa user id" + userId);
    const cart = await Cart.findOne({ userid: userId })
      .populate('product.productid')
      .lean()
      .exec();

    let cartProducts = [];
    let finalAmount = 0;

    if (cart && cart.product) {
      cartProducts = cart.product.map((item) => {
        const total = Number(item.quantity) * Number(item.productid.price);

        return {
          _id: item.productid._id.toString(),
          name: item.productid.product_name,
          price: item.productid.price,
          image: item.productid.image[0],
          quantity: item.quantity,
          size: item.size,
          total: total,
        };
      });

      finalAmount = cartProducts.reduce(
        (sum, product) => sum + Number(product.total),
        0
      );
    }


    const { index } = req.query;


    const user = await User.findById(req.session.user_id); // Assuming you have user authentication implemented and req.user is available

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (index < 0 || index >= user.address.length) {
      return res.status(400).json({ message: 'Invalid address index' });
    }

    const address = user.address[index];
    console.log(address + "address kittiyutund....");

    const userData= await User.findOne({_id: req.session.user_id})

    

    res.render('users/checkout', { finalAmount: finalAmount, cartProducts: cartProducts, address: address ,userData:userData});
  } catch (error) {
    console.log(error.message);
  }
};



// Delete a product from the cart
const deleteCartProduct = async (req, res) => {
  try {
    const userId = req.session.user_id;
    const productId = req.query.productId
  

    console.log("product id: and size...................."+productId);
    const cart = await Cart.findOneAndUpdate(
      { userid: userId },
      { $pull: { product: { productid: productId } } },
      { new: true }
    );

    if (!cart) {
      console.log({ error: 'Cart not found' });
    }
    console.log({ message: 'Product removed from cart successfully' });
    res.redirect('/cart')

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};



// load confimation page
const showConfirmationPage = async (req,res)=>{
  try {

    const orderId = req.query.orderId
    console.log("..........order id........."+ orderId);
    const order = await Order.findOne({_id: orderId}).populate('product.productid')
   
    console.log("......."+order+ "......order ");

    res.render('users/confirmation',{ order: order })
    
  } catch (error) {
    console.log(error.message);
  }
}


const checkoutOrder = async (req,res)=>{
  try {

    const id= req.session.user_id
    let OrderDetails = await Order.findOne({ userid:id })
    const CartDetails = await Cart.findOne({ userid: id })
    .populate('product.productid')
    
    
      // If cart does not exist, create a new one
      let newOrder = new Order({
        userid: id,
        product: [],
        address:[],
        grandTotal: 0,
        discoundAmount:0,
        name: req.body.name,
        email:  req.body.email,
        payment_method: req.body.payment,
        date: new Date(),   
        product: CartDetails.product,
      });

      OrderDetails = await newOrder.save();
      
      const address = req.body

      OrderDetails.address.push({
          location:address.location,
          landmark:address.landmark,
          country:address.country,
          city:address.city,
          pincode:address.pincode,
          mobile:address.mobile,
          state:address.state
      });
  
      await OrderDetails.save()
    
    
    const productTotal = OrderDetails.product.reduce((total, item) => {
      return total + parseFloat(item.total);
    }, 0);

 
    const couponAppliedamount = req.body.couponAppliedamount ;
  
    const numericCouponAmount = parseFloat(couponAppliedamount.replace(/[^\d.-]/g, '')) || 0;
 
    console.log("Numeric Value:", numericCouponAmount);

  
    const grandTotal = productTotal-numericCouponAmount  ; // Add the delivery charge (90) to the product total

    console.log("{grandTotal-------------->"+grandTotal+"<--------------grandTotal}");

    OrderDetails.discoundAmount=numericCouponAmount;
    OrderDetails.grandTotal = grandTotal;
    await OrderDetails.save();

    if(OrderDetails){
      await Cart.findOneAndDelete({ userid: id })
      console.log("cart item is deleted.........")
    }

    console.log(OrderDetails+"OrderDetails.............");
    

    res.redirect('/confirmation?orderId=' + OrderDetails._id);

    
  } catch (error) {
    

    console.log(error.message);
  }
}


// order history


const loadOrderHistory = async (req, res) => {
  try {
    const userId = req.session.user_id;
    const CategoryData = await Category.find({ is_Delete: false });

    const cart = await Cart.findOne({ userid: userId })
      .populate('product.productid')
      .lean()
      .exec();

    let cartProducts = [];
    let finalAmount = 0;

    if (cart && cart.product) {
      cartProducts = cart.product.map((item) => {
        const total = Number(item.quantity) * Number(item.productid.price);

        return {
          _id: item.productid._id.toString(),
          name: item.productid.product_name,
          price: item.productid.price,
          image: item.productid.image[0],
          quantity: item.quantity,
          size: item.size,
          total: total,
        };
      });

      finalAmount = cartProducts.reduce(
        (sum, product) => sum + Number(product.total),
        0
      );
    }

    const orderData = await Order.find({ userid: userId })
    .sort({ date: -1 }) // Sort by date field in descending order
    .populate('product.productid');
  

    const orderDetails = orderData.map((ord) => {
      const orderDate = new Date(ord.date);
      const year = orderDate.getFullYear();
      const month = getMonthName(orderDate.getMonth() + 1);
      const date = orderDate.getDate();
      const formattedDate = `${date} ${month} ${year}`  ;

      return {
        orderid: ord._id,
        name: ord.name,
        mobile: ord.address[0].mobile,
        grandTotal: ord.grandTotal,
        status: ord.status,
        discoundAmount:ord.discoundAmount,
        payment_method: ord.payment_method,
        orderdate: formattedDate,
        delivery_date: ord.delivery_date,
        return: ord.return.status,
       
        product: ord.product.map((prod) => ({
          productid: prod.productid._id,
          quantity:prod.quantity,
          size:prod.size,
          product_name: prod.productid.product_name,
          price: prod.productid.price,
          quantity: prod.quantity,
          size: prod.size,
          total: prod.total,
          image: prod.productid.image[0]
        })),
      };
    });

    console.log("itha... orders list .....> ", orderDetails);

    res.render('users/MyOrder', {
      cartProducts: cartProducts,
      finalAmount: finalAmount,
      orderDetails: orderDetails,
      Category: CategoryData,
    });


  } catch (error) {
    console.log(error.message);
    // Handle the error appropriately (e.g., show an error page)
    res.render('error', { error: 'An error occurred while loading the products.' });
  }
};



//productOrderDetails page loading 

const productOrderDetails = async (req, res) => {
  try {
    const OrderId = req.query.id;
    console.log(" ----------------------> product id   ---->" + OrderId);

    const userId = req.session.user_id;
    console.log("user id ...........----.......---->" + userId);

    const cart = await Cart.findOne({ userid: userId })
      .populate('product.productid')
      .lean()
      .exec();

    let cartProducts = [];
    let finalAmount = 0;

    if (cart && cart.product) {
      cartProducts = cart.product.map((item) => {
        const total = Number(item.quantity) * Number(item.productid.price);

        return {
          _id: item.productid._id.toString(),
          name: item.productid.product_name,
          price: item.productid.price,
          image: item.productid.image[0],
          quantity: item.quantity,
          size: item.size,
          total: total,
        };
      });

      finalAmount = cartProducts.reduce((sum, product) => sum + Number(product.total), 0);
    }

    console.log("OrderId:", OrderId);
    const orderData = await Order.findOne({ _id: OrderId }).populate('product.productid');
    console.log("orderData:", orderData);

    const orderDate = new Date(orderData.date);
    const year = orderDate.getFullYear();
    const month = getMonthName(orderDate.getMonth() + 1);
    const date = orderDate.getDate();
    const formattedDate = `${date} ${month} ${year}`;

    const orderDetails = {
      orderid: orderData._id,
      userid:orderData.userid,
      name: orderData.name,
      mobile: orderData.address[0].mobile,
      grandTotal: orderData.grandTotal,
      discoundAmount:orderData.discoundAmount,
      status: orderData.status,
      payment_method: orderData.payment_method,
      orderdate: formattedDate,
      delivery_date: orderData.delivery_date,
      return: orderData.return.status,
      address: orderData.address ,
      product: orderData.product.map((prod) => ({
        productid: prod.productid._id,
        quantity: prod.quantity,
        size: prod.size,
        product_name: prod.productid.product_name,
        price: prod.productid.price,
        total: prod.total,
        image: prod.productid.image[0],
      })),
    };

    const orderProductTotal = orderDetails.product.reduce((total, item) => {
      return total + parseFloat(item.total);
    }, 0);

    console.log("Order details: ", orderDetails);

    res.render('users/productOrderDetail', {
      cartProducts: cartProducts,
      finalAmount: finalAmount,
      orderDetails: orderDetails,
      orderProductTotal:orderProductTotal
    });
  } catch (error) {
    console.log(error.message);
    // Handle the error appropriately (e.g., show an error page)
    res.render('error', { error: 'An error occurred while loading the product details.' });
  }
};

 


const cancelProduct = async (req, res) => {
  try {
    const orderid = req.query.orderId; // Access orderId from query parameters
    const userId = req.query.userId;
    const PriceOfOrder = req.query.grandTotal;
    const PaymentMethod = req.query.PaymentMethod;
    const cancelReason = req.body.cancelReason; // Access cancelReason from request body

    console.log("PaymentMethod ---->" + PaymentMethod + "<-------PaymentMethod");
    console.log("userId ---->" + userId + "<-------userId");
    console.log(cancelReason + " Reason for cancelling");

    const order = await Order.findOneAndUpdate(
      { _id: orderid },
      {
        $set: {
          status: 'Cancelled' // Update the status to "Cancelled"
        }
      },
      { new: true }
    );
    console.log("Order is Cancelled Successfully");

    if (PaymentMethod === "Razorpay") {
      const walletUpdation = await User.findOneAndUpdate(
        { _id: userId },
        {
          $inc: {
            wallet: PriceOfOrder
          }
        },
        { new: true }
      );
      
      console.log("Wallet is Added ₹ " + PriceOfOrder);
    } else {
      console.log("Nothing Added to Wallet ");
    }

    res.redirect('/OrderHistory');
  } catch (error) {
    console.log(error);
  }
};

 
const newPasword = async(req,res)=>{
  try {

    const email=req.body.email;
    const NewPasswordAgain=req.body.NewPasswordAgain;
    const NewPassword=req.body.NewPassword;
     
    if(NewPasswordAgain !== NewPassword ){
      res.render('users/newPassword',{email:email, message:"Passwords don't match. Please verify."})
     console.log("it is not matching ....");
    }else{

    const spassword = await securePassword(NewPassword)
      
    const newPass= await User.updateOne({email:email},{$set:{password:spassword}})

    console.log("user Data"+newPass);
     res.render('users/login')
    }
  } catch (error) {
    console.log(error.message);
  }
}
 
const uploadProfileImage = async (req, res) => {
  try {
    const id = req.session.user_id;
    const profileImageInput = req.files.map((file) => file.filename);

    const user = await User.findByIdAndUpdate(
      { _id: id },
      { $push: { profileImage: { $each: profileImageInput } } },
      { new: true }
    );

    console.log("Image added successfully");
    return res.status(200).json(user);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: "Failed to upload image." });
  }
};


 module.exports={

    loadRegister,
    insertUser,
    verifymail,
    loadLogin,
    verifyLogin,
    loadHome,
    userLogout,
    loadOtpLogin,
    otpVerifyMail,
    otpSend,
    verifyOtp,
    loadAllProduct,
    productDetails,
    loadUserProfile,
    loadaddAddress,
    addAddress,
    editAddresspage,
    editAddress,
    deleteAddress,
    searchProduct,
    showCart,
    addtocart,
    updateCart,
    getAddress,
    showCheckout,
    showConfirmationPage,
    checkoutOrder,
    deleteCartProduct,
    loadOrderHistory,
    forgotPassword ,
    forgetpageEmail,
    verifyOtpforgot,
    newPassword,
    productOrderDetails,
    loadcontact,
    cancelProduct,
    uploadProfileImage,
    sendEmailContact
   
 }