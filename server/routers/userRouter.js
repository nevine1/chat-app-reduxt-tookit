const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const { 
    registerUser, 
    loginByEmail,
    loginByPass, 
    resetPass,
    getToken,
    newPass,
    userDetails,
    logout,
    updateUserDetails
        } = require('../controllers/userController')



//creating user api 

router.post("/register", registerUser);
router.post("/loginEmail", loginByEmail);
router.post("/loginPass", loginByPass);
router.get("/getUserToken", getToken)

router.post("/resetPassword", resetPass);
router.post("/newPassword", newPass);
router.get("/user-details", userDetails);
router.get("/logout", logout);
router.put("/update-userInfo", verifyToken, updateUserDetails)


module.exports = router; 