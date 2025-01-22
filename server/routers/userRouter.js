const express = require('express');
const router = express.Router();
const { 
    registerUser
    } = require('../controllers/userController')

//creating user api 

router.post("/register", registerUser);


module.exports = router; 