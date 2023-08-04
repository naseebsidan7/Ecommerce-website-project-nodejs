const express = require('express');
const router = express.Router();
const session = require('express-session')
const userController = require('../controllers/userController')
const paymentController = require('../controllers/paymentController')

const auth = require('../middleware/auth')




const multer = require('multer')
const path = require('path')
 

const stoge= multer.diskStorage({
    destination:(req,file,cb)=>{
       cb(null,path.join(__dirname,'../public/userProfilesUpload'))
    },
    filename:(req,file,cb)=>{
              const name = Date.now()+'-'+file.originalname;
              cb(null,name);
        }
    })
 

const upload = multer({storage:stoge}); 




router.get('/register',auth.is_logout,userController.loadRegister)
router.post('/register',userController.insertUser)
    

// router.get('/',auth.is_logout,userController.loadLogin)
router.get('/login',auth.is_logout,userController.loadLogin)
router.post('/login',userController.verifyLogin)
router.get('/logout',auth.is_login,userController.userLogout)



router.get('/',userController.loadHome) 
router.get('/home',userController.loadHome) 
router.get('/verify',userController.verifymail)
router.get('/allProducts',userController.loadAllProduct)
router.get('/contact',userController.loadcontact) 
router.get('/ProductPagination',userController.loadAllProductPagination)


router.get('/forgetPassword',auth.is_logout,userController.forgotPassword )
router.post('/forgetpageEmail',userController.forgetpageEmail)
router.post('/verifyOtpforgot',userController.verifyOtpforgot)
router.post('/newPassword',userController.newPassword)

router.post('/cancelProduct',userController.cancelProduct)

 

router.get('/otpPage',auth.is_logout,userController.loadOtpLogin)
router.post('/otpPage',userController.otpSend)
router.post('/verifyOtp',userController.verifyOtp)

router.get('/productDetails' ,userController.productDetails)

router.get('/userProfile',auth.is_login,userController.loadUserProfile)
//change user profile 
router.post('/upload-profile-image',upload.array('image',1),userController.uploadProfileImage)

router.get('/addAddress',auth.is_login,userController.loadaddAddress)
router.post('/addAddress',auth.is_login,userController.addAddress)

router.get('/editAddress',auth.is_login,userController. editAddresspage)
router.post('/editAddress',auth.is_login,userController.editAddress)
router.get('/deleteAddress',auth.is_login,userController.deleteAddress)
router.get('/getAddress', userController.getAddress);

router.get('/cart',auth.is_login,userController.showCart)
router.post('/addtocart',userController.addtocart)
router.post('/update-cart', userController.updateCart);
router.get('/deleteCartProduct',auth.is_login,userController.deleteCartProduct)
 
router.get('/checkout',auth.is_login,userController.showCheckout)
router.post('/checkoutOrder',userController.checkoutOrder)
router.post('/checkoutOnline',paymentController.OnlinePaymentOrder)

router.post('/validateCoupon',paymentController.validateCoupon)

router.get('/confirmation',auth.is_login,userController.showConfirmationPage)

router.get('/OrderHistory',auth.is_login,userController.loadOrderHistory)
router.get('/productOrderDetails' ,userController.productOrderDetails)

router.get('/searchProduct',userController.searchProduct)


 
module.exports = router;




 