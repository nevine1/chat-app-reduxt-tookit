const multer = require("multer");
const express = require("express");
const {verifyToken} = require("../middleware/authMiddleware");

const router = express.Router();


const { 
    registerUser, 
    loginByEmail,
    loginByPass, 
    resetPass,
    getToken,
    newPass,
    userDetails,
    logout,
  updateUserDetails, 
    searchForUser
        } = require('../controllers/userController')



    

//creating user api 

router.post("/register", registerUser);
router.post("/loginEmail", loginByEmail);
router.post("/loginPass", loginByPass);
router.get("/getUserToken", getToken)

router.post("/resetPassword", resetPass);
router.post("/newPassword", newPass);
router.get("/user-details", userDetails);
router.post("/searchingUser", searchForUser);
router.get("/logout", logout);

/* router.put(
  "/update-userInfo",
  verifyToken,
  upload.single("profile_pic"), // Multer handles file upload
  updateUserDetails
); */
router.put(
  "/update-userInfo",
  updateUserDetails
);

module.exports = router; 