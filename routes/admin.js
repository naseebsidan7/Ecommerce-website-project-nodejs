const express = require('express');
const admin_router = express();

const adminController = require('../controllers/adminController')
const adminAuth = require('../middleware/adminAuth')


const multer = require('multer')
const path = require('path')

const session = require('express-session')
const config = require('../config/config')



const stoge= multer.diskStorage({
    destination:(req,file,cb)=>{
       cb(null,path.join(__dirname,'../public/product-images'))
    },
    filename:(req,file,cb)=>{
              const name = Date.now()+'-'+file.originalname;
              cb(null,name);
        }
    })
 

    const upload = multer({storage:stoge}); 




admin_router.get('/',adminAuth.isLogout,adminController.loadAdminLogin)

admin_router.post('/',adminController.verifyLogin)

admin_router.get('/home',adminAuth.isLogin,adminController.loadAdminHome)

admin_router.get('/logout',adminAuth.isLogin,adminController.logout)

admin_router.get('/listUser',adminAuth.isLogin,adminController.listUsers)
//  const storage = multer.diskStorage

admin_router.get('/listOrder',adminAuth.isLogin,adminController.listOrder)

admin_router.get('/viewOrder',adminAuth.isLogin,adminController.viewOrderProduct)

admin_router.get('/cancelOrder',adminAuth.isLogin,adminController.cancelOrder)

admin_router.get('/cancelProduct',adminAuth.isLogin,adminController.cancelProduct)

admin_router.post('/updateOrderStatus',adminAuth.isLogin,adminController.changeProductStatus)
admin_router.post('/update-Order-Status',adminAuth.isLogin,adminController.updateOrderStatus)

admin_router.get('/blockUser',adminAuth.isLogin,adminController.blockUser)
admin_router.get('/unblockUser',adminAuth.isLogin,adminController.unblockUser)

admin_router.get('/addProduct',adminAuth.isLogin,adminController.loadProductPage)

admin_router.get('/allProduct',adminAuth.isLogin,adminController.loadAllProduct)

admin_router.post('/addProduct',upload.array('image',5),adminController.addProducts)

admin_router.get('/listCategory',adminAuth.isLogin,adminController.loadCategoryPage)

admin_router.post('/addCategory',adminAuth.isLogin,adminController.addCategory)

admin_router.get('/editCategory',adminAuth.isLogin,adminController.loadEditCategory)

admin_router.post('/editCategory',adminController.editCategory)

admin_router.get('/editProduct',adminAuth.isLogin,adminController.loadEditProduct)

admin_router.post('/editProduct',upload.array('image',5),adminController.editProduct)

admin_router.get('/deleteCategory',adminAuth.isLogin,adminController.deleteCategory)

admin_router.get('/deleteProduct',adminAuth.isLogin,adminController.deleteProduct)

admin_router.get('/deleteImage',adminAuth.isLogin,adminController.deleteImage)


// coupon 

admin_router.get('/couponPage',adminAuth.isLogin,adminController.loadcouponPage)

admin_router.post('/addCoupon',adminController.addCoupon)

admin_router.get('/deleteCoupon',adminAuth.isLogin,adminController.deleteCoupon)

// sales report 

admin_router.get('/salesReport',adminAuth.isLogin,adminController.loadSaleReport)
admin_router.get('/getSalesReportData',adminAuth.isLogin,adminController.getSalesReportData)

admin_router.get("/download-sales-report",adminController.downloadSalesReport);
admin_router.get("/download-sales-report-Excel",adminController.downloadSalesReportinExcel);

// banner 

admin_router.get('/Banner',adminAuth.isLogin,adminController.loadBannerManagement)
admin_router.post('/addBanner',upload.array('image',5),adminController.addBanner)
admin_router.post('/activateBanner',adminController.activateBanner)
admin_router.post('/inActivateBanner',adminController.inActivateBanner)
admin_router.get('/BannerDelete',adminController.deleteBanner)

admin_router.get('*',(req,res)=>{

    res.redirect('/admin')

})

module.exports = admin_router;
