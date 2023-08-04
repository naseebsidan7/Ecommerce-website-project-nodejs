
const User = require('../models/User_Model');

const is_login = async (req, res, next) => {
    try {
            if (req.session.user_id) {
              const user = await User.findOne({ _id: req.session.user_id });
              if (user && user.is_blocked === true) {
                // Clear the session and redirect to the login page
                req.session.destroy((err) => {
                  if (err) {
                    console.error('Error destroying session:', err);
                  }
                  res.clearCookie('session'); // Clear session cookie if necessary
                  res.redirect('/login');
                });

             return; // Add return statement to stop further execution
        }
      } else {
        res.redirect('/login');
        return; // Add return statement to stop further execution
      }
      next();
    } catch (error) {
      console.log(error.message);
    }
  };
  

  const is_logout = async(req,res,next)=>{
    try {
        if(req.session.user_id){
            res.redirect('/home')
        }
        next();

    } catch (error) {
        console.log(error.message);
    }
};
  
  module.exports={
    is_login,
    is_logout
}
