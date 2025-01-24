const express = require('express');
const router = express.Router();
const { 
    registerUser, 
    loginByEmail,
    loginByPass, 
    userDetails,
    logout,
    updateUserDetails
        } = require('../controllers/userController')

//creating user api 

router.post("/register", registerUser);
router.post("/loginEmail", loginByEmail);
router.post("/loginPass", loginByPass)
router.get("/user-details", userDetails);
router.get("/logout", logout);
router.post("/update-userInfo", updateUserDetails)


module.exports = router; 