const express = require('express');
const router = express.Router();
const { 
    registerUser, 
    loginByEmail,
    loginByPass
    } = require('../controllers/userController')

//creating user api 

router.post("/register", registerUser);
router.post("/loginEmail", loginByEmail);
router.post("/loginPass", loginByPass)


module.exports = router; 